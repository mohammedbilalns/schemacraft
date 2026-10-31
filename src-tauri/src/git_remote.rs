use crate::git::run_git_cmd;

#[tauri::command]
pub fn git_pull(dir_path: String) -> Result<String, String> {
    run_git_cmd(&dir_path, &["pull"])
}

#[tauri::command]
pub fn git_get_remotes(dir_path: String) -> Result<Vec<String>, String> {
    let out = run_git_cmd(&dir_path, &["remote"])?;
    Ok(out
        .lines()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .collect())
}

#[tauri::command]
pub fn git_add_remote(dir_path: String, name: String, url: String) -> Result<String, String> {
    let trimmed_name = name.trim();
    let trimmed_url = url.trim();
    if trimmed_name.is_empty() || trimmed_url.is_empty() {
        return Err("Remote name and URL cannot be empty".to_string());
    }
    run_git_cmd(&dir_path, &["remote", "add", trimmed_name, trimmed_url])
}

#[tauri::command]
pub fn git_push(
    dir_path: String,
    remote: Option<String>,
    branch: Option<String>,
    set_upstream: Option<bool>,
) -> Result<String, String> {
    let rem = remote.unwrap_or_else(|| "origin".to_string());
    let br = branch.unwrap_or_else(|| {
        run_git_cmd(&dir_path, &["branch", "--show-current"])
            .unwrap_or_else(|_| "main".to_string())
    });

    if set_upstream.unwrap_or(false) {
        run_git_cmd(&dir_path, &["push", "-u", &rem, &br])
    } else {
        match run_git_cmd(&dir_path, &["push"]) {
            Ok(output) => Ok(output),
            Err(err)
                if err.contains("no upstream branch")
                    || err.contains("--set-upstream")
                    || err.contains("has no upstream") =>
            {
                run_git_cmd(&dir_path, &["push", "-u", &rem, &br])
            }
            Err(e) => Err(e),
        }
    }
}
