import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGitRemote } from '../useGitRemote';
import * as tauri from '../../utils/tauriClient';

vi.mock('../../utils/tauriClient');

describe('useGitRemote hook', () => {
  it('handles pulling from remote successfully', async () => {
    vi.mocked(tauri.gitPull).mockResolvedValue('Already up to date.');
    const addLog = vi.fn();
    const onRefresh = vi.fn();

    const { result } = renderHook(() =>
      useGitRemote('/repo', true, addLog, onRefresh)
    );

    await act(async () => {
      await result.current.handlePull();
    });

    expect(tauri.gitPull).toHaveBeenCalledWith('/repo');
    expect(onRefresh).toHaveBeenCalled();
    expect(addLog).toHaveBeenCalledWith(expect.stringContaining('Git pull: Already up to date.'), 'success');
  });

  it('handles pushing to configured remote', async () => {
    vi.mocked(tauri.gitGetRemotes).mockResolvedValue(['origin']);
    vi.mocked(tauri.gitPush).mockResolvedValue('Everything up to date');
    const addLog = vi.fn();
    const onRefresh = vi.fn();

    const { result } = renderHook(() =>
      useGitRemote('/repo', true, addLog, onRefresh)
    );

    await act(async () => {
      await result.current.handlePush();
    });

    expect(tauri.gitPush).toHaveBeenCalledWith('/repo');
    expect(addLog).toHaveBeenCalledWith(expect.stringContaining('Git push: Everything up to date'), 'success');
  });

  it('opens remote modal if no remotes configured when pushing', async () => {
    vi.mocked(tauri.gitGetRemotes).mockResolvedValue([]);
    const addLog = vi.fn();

    const { result } = renderHook(() =>
      useGitRemote('/repo', true, addLog, vi.fn())
    );

    await act(async () => {
      await result.current.handlePush();
    });

    expect(result.current.isRemoteModalOpen).toBe(true);
  });
});
