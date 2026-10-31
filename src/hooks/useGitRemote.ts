import { useState } from 'react';
import * as tauri from '../utils/tauriClient';

export function useGitRemote(
  currentDir: string,
  isRepo: boolean,
  addLog: (msg: string, level?: 'info' | 'success' | 'warn' | 'error') => void,
  onRefreshProject: () => Promise<void> | void
) {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isRemoteModalOpen, setIsRemoteModalOpen] = useState(false);

  const handlePull = async () => {
    if (!currentDir || !isRepo) return;
    try {
      setIsPulling(true);
      addLog('Pulling latest changes from remote...', 'info');
      const res = await tauri.gitPull(currentDir);
      await onRefreshProject();
      addLog(`Git pull: ${res || 'Already up to date.'}`, 'success');
    } catch (err) {
      addLog(`Git pull failed: ${err}`, 'error');
    } finally {
      setIsPulling(false);
    }
  };

  const handlePush = async () => {
    if (!currentDir || !isRepo) return;
    try {
      const remotes = await tauri.gitGetRemotes(currentDir).catch(() => []);
      if (remotes.length === 0) {
        setIsRemoteModalOpen(true);
        return;
      }
      setIsPushing(true);
      addLog('Pushing commits to remote repository...', 'info');
      const res = await tauri.gitPush(currentDir);
      addLog(`Git push: ${res || 'Successfully pushed.'}`, 'success');
    } catch (err) {
      const errMsg = String(err);
      if (errMsg.includes('remote') || errMsg.includes('destination') || errMsg.includes('repository')) {
        setIsRemoteModalOpen(true);
      }
      addLog(`Git push failed: ${err}`, 'error');
    } finally {
      setIsPushing(false);
    }
  };

  const handleAddRemoteAndPush = async (name: string, url: string) => {
    if (!currentDir) return;
    setIsPushing(true);
    try {
      addLog(`Adding remote "${name}" (${url})...`, 'info');
      await tauri.gitAddRemote(currentDir, name, url);
      addLog(`Remote "${name}" added. Pushing...`, 'info');
      const res = await tauri.gitPush(currentDir, name, undefined, true);
      addLog(`Git push: ${res || 'Successfully pushed.'}`, 'success');
      setIsRemoteModalOpen(false);
    } catch (err) {
      addLog(`Failed to add remote and push: ${err}`, 'error');
      throw err;
    } finally {
      setIsPushing(false);
    }
  };

  return {
    isPulling,
    isPushing,
    isRemoteModalOpen,
    setIsRemoteModalOpen,
    handlePull,
    handlePush,
    handleAddRemoteAndPush,
  };
}
