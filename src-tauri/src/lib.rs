use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use serde::{Deserialize, Serialize};
use base64::Engine;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ErdFileInfo {
    pub name: String,
    pub path: String,
    pub relative_path: String,
    pub content: String,
    pub size: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GitCommitInfo {
    pub hash: String,
    pub short_hash: String,
    pub author: String,
    pub date: String,
    pub message: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GitStatusInfo {
    pub is_repo: bool,
    pub current_branch: String,
    pub is_clean: bool,
    pub changed_files: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ProjectSummary {
    pub root_dir: String,
    pub files: Vec<ErdFileInfo>,
    pub git: GitStatusInfo,
}

fn run_git_cmd(dir: &str, args: &[&str]) -> Result<String, String> {
    let output = Command::new("git")
        .current_dir(dir)
        .args(args)
        .output()
        .map_err(|e| format!("Failed to run git: {}", e))?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
        return Err(if err.is_empty() {
            format!("Git command failed with code {:?}", output.status.code())
        } else {
            err
        });
    }

    Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
}

#[tauri::command]
fn select_directory() -> Result<Option<String>, String> {
    let folder = rfd::FileDialog::new().pick_folder();
    Ok(folder.map(|p| p.to_string_lossy().to_string()))
}

#[tauri::command]
fn git_status(dir_path: String) -> Result<GitStatusInfo, String> {
    let is_repo_check = Command::new("git")
        .current_dir(&dir_path)
        .args(["rev-parse", "--is-inside-work-tree"])
        .output();

    match is_repo_check {
        Ok(out) if out.status.success() => {
            // It is a git repo
            let branch = run_git_cmd(&dir_path, &["branch", "--show-current"])
                .unwrap_or_else(|_| {
                    run_git_cmd(&dir_path, &["rev-parse", "--short", "HEAD"])
                        .unwrap_or_else(|_| "HEAD".to_string())
                });

            let status_out = run_git_cmd(&dir_path, &["status", "--porcelain"])
                .unwrap_or_default();

            let changed_files: Vec<String> = status_out
                .lines()
                .map(|l| l.trim().to_string())
                .filter(|l| !l.is_empty())
                .collect();

            let is_clean = changed_files.is_empty();

            Ok(GitStatusInfo {
                is_repo: true,
                current_branch: if branch.is_empty() { "HEAD".to_string() } else { branch },
                is_clean,
                changed_files,
            })
        }
        _ => Ok(GitStatusInfo {
            is_repo: false,
            current_branch: String::new(),
            is_clean: true,
            changed_files: Vec::new(),
        }),
    }
}

#[tauri::command]
fn git_init(dir_path: String) -> Result<String, String> {
    run_git_cmd(&dir_path, &["init"])
}

#[tauri::command]
fn git_branches(dir_path: String) -> Result<Vec<String>, String> {
    let out = run_git_cmd(&dir_path, &["branch", "--list", "--format=%(refname:short)"])?;
    let branches: Vec<String> = out
        .lines()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .collect();
    Ok(branches)
}

#[tauri::command]
fn git_checkout(dir_path: String, branch: String) -> Result<String, String> {
    run_git_cmd(&dir_path, &["checkout", &branch])
}

#[tauri::command]
fn git_create_branch(dir_path: String, branch: String) -> Result<String, String> {
    run_git_cmd(&dir_path, &["checkout", "-b", &branch])
}

#[tauri::command]
fn git_commit(dir_path: String, message: String) -> Result<String, String> {
    if message.trim().is_empty() {
        return Err("Commit message cannot be empty".to_string());
    }
    run_git_cmd(&dir_path, &["add", "-A"])?;
    run_git_cmd(&dir_path, &["commit", "-m", &message])
}

#[tauri::command]
fn git_history(dir_path: String) -> Result<Vec<GitCommitInfo>, String> {
    let out = run_git_cmd(
        &dir_path,
        &[
            "log",
            "-n",
            "50",
            "--pretty=format:%H|||%h|||%an|||%ad|||%s",
            "--date=format:%Y-%m-%d %H:%M",
        ],
    )?;

    let mut commits = Vec::new();
    for line in out.lines() {
        let parts: Vec<&str> = line.split("|||").collect();
        if parts.len() >= 5 {
            commits.push(GitCommitInfo {
                hash: parts[0].to_string(),
                short_hash: parts[1].to_string(),
                author: parts[2].to_string(),
                date: parts[3].to_string(),
                message: parts[4].to_string(),
            });
        }
    }
    Ok(commits)
}

#[tauri::command]
fn git_show_file_at_commit(
    dir_path: String,
    commit_hash: String,
    file_path: String,
) -> Result<String, String> {
    let spec = format!("{}:{}", commit_hash, file_path);
    run_git_cmd(&dir_path, &["show", &spec])
}

fn collect_erd_files(
    root: &Path,
    current: &Path,
    files: &mut Vec<ErdFileInfo>,
    depth: usize,
) -> std::io::Result<()> {
    if depth > 4 {
        return Ok(());
    }

    if let Ok(entries) = fs::read_dir(current) {
        for entry in entries.flatten() {
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();

            // Skip hidden and build directories
            if name.starts_with('.')
                || name == "node_modules"
                || name == "target"
                || name == "dist"
                || name == "build"
            {
                continue;
            }

            if path.is_dir() {
                let _ = collect_erd_files(root, &path, files, depth + 1);
            } else if path.is_file() {
                let is_erd_file = name.ends_with(".erd")
                    || name.ends_with(".eraser")
                    || name.ends_with(".md")
                    || name.ends_with(".txt");

                if is_erd_file {
                    if let Ok(content) = fs::read_to_string(&path) {
                        let relative = path
                            .strip_prefix(root)
                            .unwrap_or(&path)
                            .to_string_lossy()
                            .to_string();

                        let size = entry.metadata().map(|m| m.len()).unwrap_or(0);
                        files.push(ErdFileInfo {
                            name,
                            path: path.to_string_lossy().to_string(),
                            relative_path: relative,
                            content,
                            size,
                        });
                    }
                }
            }
        }
    }
    Ok(())
}

#[tauri::command]
fn scan_project(dir_path: String) -> Result<ProjectSummary, String> {
    let root = PathBuf::from(&dir_path);
    if !root.exists() || !root.is_dir() {
        return Err(format!("Directory does not exist: {}", dir_path));
    }

    let mut files = Vec::new();
    let _ = collect_erd_files(&root, &root, &mut files, 0);

    // Sort files alphabetically by relative path
    files.sort_by(|a, b| a.relative_path.cmp(&b.relative_path));

    let git = git_status(dir_path.clone())?;

    Ok(ProjectSummary {
        root_dir: dir_path,
        files,
        git,
    })
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file {}: {}", path, e))
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    let p = Path::new(&path);
    if let Some(parent) = p.parent() {
        let _ = fs::create_dir_all(parent);
    }
    fs::write(&path, content).map_err(|e| format!("Failed to write file {}: {}", path, e))
}

#[tauri::command]
fn create_file(dir_path: String, filename: String, initial_content: Option<String>) -> Result<ErdFileInfo, String> {
    let root = Path::new(&dir_path);
    let full_path = root.join(&filename);

    if full_path.exists() {
        return Err(format!("File already exists: {}", filename));
    }

    if let Some(parent) = full_path.parent() {
        let _ = fs::create_dir_all(parent);
    }

    let content = initial_content.unwrap_or_else(|| {
        "// New ERD Diagram\nusers [icon: user, color: blue] {\n  id string pk\n  name string\n  email string\n}\n".to_string()
    });

    fs::write(&full_path, &content).map_err(|e| format!("Failed to create file {}: {}", filename, e))?;

    let size = content.len() as u64;
    Ok(ErdFileInfo {
        name: filename.clone(),
        path: full_path.to_string_lossy().to_string(),
        relative_path: filename,
        content,
        size,
    })
}

#[tauri::command]
fn delete_file(path: String) -> Result<(), String> {
    fs::remove_file(&path).map_err(|e| format!("Failed to delete file {}: {}", path, e))
}

#[tauri::command]
fn save_diagram_png(dir_path: String, filename: String, base64_png: String) -> Result<String, String> {
    let root = Path::new(&dir_path);
    let target = root.join(&filename);

    let clean_base64 = if let Some(idx) = base64_png.find("base64,") {
        &base64_png[idx + 7..]
    } else {
        &base64_png
    };

    let bytes = base64::engine::general_purpose::STANDARD
        .decode(clean_base64)
        .map_err(|e| format!("Failed to decode base64 image: {}", e))?;

    fs::write(&target, bytes).map_err(|e| format!("Failed to save PNG {}: {}", target.display(), e))?;

    Ok(target.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            select_directory,
            scan_project,
            read_file,
            write_file,
            create_file,
            delete_file,
            save_diagram_png,
            git_status,
            git_init,
            git_branches,
            git_checkout,
            git_create_branch,
            git_commit,
            git_history,
            git_show_file_at_commit
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
