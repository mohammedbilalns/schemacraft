use serde::{Deserialize, Serialize};

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
pub struct GitUserConfig {
    pub name: String,
    pub email: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ProjectSummary {
    pub root_dir: String,
    pub files: Vec<ErdFileInfo>,
    pub git: GitStatusInfo,
}
