import { useState, useEffect, useCallback } from 'react';
import { ErdFileInfo, GitStatusInfo, GitCommitInfo } from '../types/erd';
import * as tauri from '../utils/tauriClient';

export function useProject(onLog: (msg: string, level?: 'info' | 'success' | 'warn' | 'error') => void) {
  const [currentDir, setCurrentDir] = useState<string>(() => {
    return localStorage.getItem('schemacraft_project_dir') || '/home/bilalnsmuhammed/draw-db/examples';
  });
  const [files, setFiles] = useState<ErdFileInfo[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);

  const [gitStatus, setGitStatus] = useState<GitStatusInfo>({
    is_repo: false,
    current_branch: '',
    is_clean: true,
    changed_files: [],
  });
  const [branches, setBranches] = useState<string[]>([]);
  const [commits, setCommits] = useState<GitCommitInfo[]>([]);

  const loadProject = useCallback(async (dir: string) => {
    try {
      const summary = await tauri.scanProject(dir);
      setCurrentDir(dir);
      localStorage.setItem('schemacraft_project_dir', dir);
      setFiles(summary.files);
      setGitStatus(summary.git);

      if (summary.files.length > 0 && !activeFilePath) {
        setActiveFilePath(summary.files[0].path);
      }
      onLog(`Loaded workspace: ${dir} (${summary.files.length} diagrams)`, 'info');

      if (summary.git.is_repo) {
        const b = await tauri.gitBranches(dir).catch(() => []);
        setBranches(b);
      }
    } catch (err) {
      onLog(`Failed to scan workspace: ${err}`, 'error');
    }
  }, [activeFilePath, onLog]);

  useEffect(() => {
    if (currentDir) loadProject(currentDir);
  }, []);

  const refreshGit = useCallback(async () => {
    if (!currentDir) return;
    try {
      const status = await tauri.gitStatus(currentDir);
      setGitStatus(status);
      if (status.is_repo) {
        const b = await tauri.gitBranches(currentDir).catch(() => []);
        setBranches(b);
      }
    } catch {
      // ignore
    }
  }, [currentDir]);

  const selectNewDirectory = async () => {
    try {
      const selected = await tauri.selectDirectory();
      if (selected) {
        await loadProject(selected);
      }
    } catch (err) {
      onLog(`Directory picker error: ${err}`, 'error');
    }
  };

  const createDiagramFile = async (name: string, content?: string) => {
    try {
      const newFile = await tauri.createFile(currentDir, name, content);
      setFiles((prev) => [...prev, newFile]);
      setActiveFilePath(newFile.path);
      onLog(`Created diagram: ${name}`, 'success');
      await refreshGit();
    } catch (err) {
      onLog(`Error creating file: ${err}`, 'error');
    }
  };

  const deleteDiagramFile = async (path: string) => {
    try {
      await tauri.deleteFile(path);
      setFiles((prev) => prev.filter((f) => f.path !== path));
      if (activeFilePath === path) {
        const remaining = files.filter((f) => f.path !== path);
        setActiveFilePath(remaining.length > 0 ? remaining[0].path : null);
      }
      onLog(`Deleted file: ${path}`, 'info');
      await refreshGit();
    } catch (err) {
      onLog(`Error deleting file: ${err}`, 'error');
    }
  };

  return {
    currentDir,
    files,
    setFiles,
    activeFilePath,
    setActiveFilePath,
    gitStatus,
    branches,
    commits,
    setCommits,
    loadProject,
    refreshGit,
    selectNewDirectory,
    createDiagramFile,
    deleteDiagramFile,
  };
}
