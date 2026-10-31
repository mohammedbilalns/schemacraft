use std::fs;
use std::path::{Path, PathBuf};
use base64::Engine;
use crate::models::{ErdFileInfo, ProjectSummary};
use crate::git::git_status;

#[tauri::command]
pub fn select_directory() -> Result<Option<String>, String> {
    let folder = rfd::FileDialog::new().pick_folder();
    Ok(folder.map(|p| p.to_string_lossy().to_string()))
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
                    || name.ends_with(".schema")
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
pub fn scan_project(dir_path: String) -> Result<ProjectSummary, String> {
    let root = PathBuf::from(&dir_path);
    if !root.exists() || !root.is_dir() {
        return Err(format!("Directory does not exist: {}", dir_path));
    }

    let mut files = Vec::new();
    let _ = collect_erd_files(&root, &root, &mut files, 0);
    files.sort_by(|a, b| a.relative_path.cmp(&b.relative_path));

    let git = git_status(dir_path.clone())?;

    Ok(ProjectSummary {
        root_dir: dir_path,
        files,
        git,
    })
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file {}: {}", path, e))
}

#[tauri::command]
pub fn write_file(path: String, content: String) -> Result<(), String> {
    let p = Path::new(&path);
    if let Some(parent) = p.parent() {
        let _ = fs::create_dir_all(parent);
    }
    fs::write(&path, content).map_err(|e| format!("Failed to write file {}: {}", path, e))
}

#[tauri::command]
pub fn create_file(
    dir_path: String,
    filename: String,
    initial_content: Option<String>,
) -> Result<ErdFileInfo, String> {
    let root = Path::new(&dir_path);
    let full_path = root.join(&filename);

    if full_path.exists() {
        return Err(format!("File already exists: {}", filename));
    }

    if let Some(parent) = full_path.parent() {
        let _ = fs::create_dir_all(parent);
    }

    let content = initial_content.unwrap_or_else(|| {
        "// New ERD Schema\nusers [icon: user, color: blue] {\n  id string pk\n  name string\n}\n".to_string()
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
pub fn delete_file(path: String) -> Result<(), String> {
    fs::remove_file(&path).map_err(|e| format!("Failed to delete file {}: {}", path, e))
}

#[tauri::command]
pub fn save_diagram_png(dir_path: String, filename: String, base64_png: String) -> Result<String, String> {
    let root = Path::new(&dir_path);
    let target = root.join(&filename);

    let clean_base64 = if let Some(idx) = base64_png.find("base64,") {
        &base64_png[idx + 7..]
    } else {
        &base64_png
    };

    let bytes = base64::engine::general_purpose::STANDARD
        .decode(clean_base64)
        .map_err(|e| format!("Failed to decode base64: {}", e))?;

    fs::write(&target, bytes).map_err(|e| format!("Failed to save PNG: {}", e))?;

    Ok(target.to_string_lossy().to_string())
}
