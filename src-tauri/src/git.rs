use std::process::Command;
use crate::models::{GitCommitInfo, GitStatusInfo, GitUserConfig};

pub fn run_git_cmd(dir: &str, args: &[&str]) -> Result<String, String> {
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
pub fn git_status(dir_path: String) -> Result<GitStatusInfo, String> {
    let is_repo_check = Command::new("git")
        .current_dir(&dir_path)
        .args(["rev-parse", "--is-inside-work-tree"])
        .output();

    match is_repo_check {
        Ok(out) if out.status.success() => {
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

            Ok(GitStatusInfo {
                is_repo: true,
                current_branch: if branch.is_empty() { "HEAD".to_string() } else { branch },
                is_clean: changed_files.is_empty(),
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
pub fn git_init(dir_path: String) -> Result<String, String> {
    run_git_cmd(&dir_path, &["init"])
}

#[tauri::command]
pub fn git_branches(dir_path: String) -> Result<Vec<String>, String> {
    let out = run_git_cmd(&dir_path, &["branch", "--list", "--format=%(refname:short)"])?;
    let branches: Vec<String> = out
        .lines()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .collect();
    Ok(branches)
}

#[tauri::command]
pub fn git_checkout(dir_path: String, branch: String) -> Result<String, String> {
    run_git_cmd(&dir_path, &["checkout", &branch])
}

#[tauri::command]
pub fn git_create_branch(dir_path: String, branch: String) -> Result<String, String> {
    run_git_cmd(&dir_path, &["checkout", "-b", &branch])
}

#[tauri::command]
pub fn git_commit(dir_path: String, message: String) -> Result<String, String> {
    if message.trim().is_empty() {
        return Err("Commit message cannot be empty".to_string());
    }
    run_git_cmd(&dir_path, &["add", "-A"])?;
    run_git_cmd(&dir_path, &["commit", "-m", &message])
}

#[tauri::command]
pub fn git_history(dir_path: String) -> Result<Vec<GitCommitInfo>, String> {
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
pub fn git_show_file_at_commit(
    dir_path: String,
    commit_hash: String,
    file_path: String,
) -> Result<String, String> {
    let spec = format!("{}:{}", commit_hash, file_path);
    run_git_cmd(&dir_path, &["show", &spec])
}

#[tauri::command]
pub fn git_get_user_config(dir_path: String) -> Result<GitUserConfig, String> {
    let name = run_git_cmd(&dir_path, &["config", "user.name"])
        .or_else(|_| run_git_cmd(&dir_path, &["config", "--global", "user.name"]))
        .unwrap_or_default();
    let email = run_git_cmd(&dir_path, &["config", "user.email"])
        .or_else(|_| run_git_cmd(&dir_path, &["config", "--global", "user.email"]))
        .unwrap_or_default();

    Ok(GitUserConfig { name, email })
}

#[tauri::command]
pub fn git_set_user_config(dir_path: String, name: String, email: String) -> Result<(), String> {
    let _ = run_git_cmd(&dir_path, &["config", "user.name", &name]);
    let _ = run_git_cmd(&dir_path, &["config", "user.email", &email]);
    Ok(())
}
