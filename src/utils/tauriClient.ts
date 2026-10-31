import { invoke } from '@tauri-apps/api/core';
import { ProjectSummary, GitStatusInfo, GitCommitInfo, ErdFileInfo, GitUserConfig } from '../types/erd';

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export async function selectDirectory(): Promise<string | null> {
  if (!isTauri()) return prompt('Enter workspace directory path:', '');
  return invoke<string | null>('select_directory');
}

export async function scanProject(dirPath: string): Promise<ProjectSummary> {
  if (!isTauri()) {
    return {
      root_dir: dirPath,
      files: [],
      git: { is_repo: false, current_branch: '', is_clean: true, changed_files: [] },
    };
  }
  return invoke<ProjectSummary>('scan_project', { dirPath });
}

export async function readFile(path: string): Promise<string> {
  if (!isTauri()) return '';
  return invoke<string>('read_file', { path });
}

export async function writeFile(path: string, content: string): Promise<void> {
  if (!isTauri()) return;
  return invoke<void>('write_file', { path, content });
}

export async function createFile(
  dirPath: string,
  filename: string,
  initialContent?: string
): Promise<ErdFileInfo> {
  if (!isTauri()) {
    return {
      name: filename,
      path: `${dirPath}/${filename}`,
      relative_path: filename,
      content: initialContent || '',
      size: (initialContent || '').length,
    };
  }
  return invoke<ErdFileInfo>('create_file', { dirPath, filename, initialContent });
}

export async function deleteFile(path: string): Promise<void> {
  if (!isTauri()) return;
  return invoke<void>('delete_file', { path });
}

export async function saveDiagramPng(
  dirPath: string,
  filename: string,
  base64Png: string
): Promise<string> {
  if (!isTauri()) return '';
  return invoke<string>('save_diagram_png', { dirPath, filename, base64Png });
}

export async function gitStatus(dirPath: string): Promise<GitStatusInfo> {
  if (!isTauri()) return { is_repo: false, current_branch: '', is_clean: true, changed_files: [] };
  return invoke<GitStatusInfo>('git_status', { dirPath });
}

export async function gitInit(dirPath: string): Promise<string> {
  if (!isTauri()) return 'Git init simulated';
  return invoke<string>('git_init', { dirPath });
}

export async function gitBranches(dirPath: string): Promise<string[]> {
  if (!isTauri()) return ['main'];
  return invoke<string[]>('git_branches', { dirPath });
}

export async function gitCheckout(dirPath: string, branch: string): Promise<string> {
  if (!isTauri()) return `Checked out ${branch}`;
  return invoke<string>('git_checkout', { dirPath, branch });
}

export async function gitCreateBranch(dirPath: string, branch: string): Promise<string> {
  if (!isTauri()) return `Created branch ${branch}`;
  return invoke<string>('git_create_branch', { dirPath, branch });
}

export async function gitCommit(dirPath: string, message: string): Promise<string> {
  if (!isTauri()) return `Committed: ${message}`;
  return invoke<string>('git_commit', { dirPath, message });
}

export async function gitHistory(dirPath: string): Promise<GitCommitInfo[]> {
  if (!isTauri()) return [];
  return invoke<GitCommitInfo[]>('git_history', { dirPath });
}

export async function gitShowFileAtCommit(
  dirPath: string,
  commitHash: string,
  filePath: string
): Promise<string> {
  if (!isTauri()) return '';
  return invoke<string>('git_show_file_at_commit', { dirPath, commitHash, filePath });
}

export async function gitGetUserConfig(dirPath: string): Promise<GitUserConfig> {
  if (!isTauri()) return { name: 'Local User', email: 'user@localhost' };
  return invoke<GitUserConfig>('git_get_user_config', { dirPath });
}

export async function gitSetUserConfig(dirPath: string, name: string, email: string): Promise<void> {
  if (!isTauri()) return;
  return invoke<void>('git_set_user_config', { dirPath, name, email });
}

export async function gitPull(dirPath: string): Promise<string> {
  if (!isTauri()) return 'Already up to date.';
  return invoke<string>('git_pull', { dirPath });
}

export async function gitGetRemotes(dirPath: string): Promise<string[]> {
  if (!isTauri()) return ['origin'];
  return invoke<string[]>('git_get_remotes', { dirPath });
}

export async function gitAddRemote(dirPath: string, name: string, url: string): Promise<string> {
  if (!isTauri()) return `Added remote ${name}`;
  return invoke<string>('git_add_remote', { dirPath, name, url });
}

export async function gitPush(
  dirPath: string,
  remote?: string,
  branch?: string,
  setUpstream?: boolean
): Promise<string> {
  if (!isTauri()) return 'Pushed changes to remote.';
  return invoke<string>('git_push', { dirPath, remote, branch, setUpstream });
}
