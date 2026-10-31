import React, { useState } from 'react';
import { Globe, X, ArrowUpRight, GitFork } from 'lucide-react';

interface RemoteRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRemoteAndPush: (name: string, url: string) => Promise<void>;
  isLoading?: boolean;
}

export const RemoteRepoModal: React.FC<RemoteRepoModalProps> = ({
  isOpen,
  onClose,
  onAddRemoteAndPush,
  isLoading = false,
}) => {
  const [remoteName, setRemoteName] = useState('origin');
  const [remoteUrl, setRemoteUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remoteUrl.trim()) {
      setError('Please enter a remote repository URL.');
      return;
    }
    setError('');
    try {
      await onAddRemoteAndPush(remoteName.trim() || 'origin', remoteUrl.trim());
      onClose();
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-[460px] max-w-full bg-[#18191f] border border-[#2e303d] rounded-2xl shadow-2xl overflow-hidden text-gray-200">
        <div className="p-5 border-b border-[#2e303d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Configure Remote Repository</h2>
              <p className="text-[11px] text-gray-400">Add a remote repository to push your schema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl text-xs text-blue-200 leading-relaxed flex items-start gap-2.5">
            <GitFork size={15} className="text-blue-400 shrink-0 mt-0.5" />
            <span>
              Your repository does not have a remote configured yet. Connect it to a GitHub, GitLab, or Git server to push.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Remote Name</label>
            <input
              type="text"
              value={remoteName}
              onChange={(e) => setRemoteName(e.target.value)}
              placeholder="origin"
              className="w-full px-3 py-2 bg-[#121317] border border-[#343644] focus:border-blue-500 rounded-lg text-xs text-white outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Remote Git URL</label>
            <input
              type="text"
              value={remoteUrl}
              onChange={(e) => {
                setRemoteUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="https://github.com/username/repository.git"
              autoFocus
              className="w-full px-3 py-2 bg-[#121317] border border-[#343644] focus:border-blue-500 rounded-lg text-xs text-white outline-none font-mono"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3 py-2 hover:bg-white/10 rounded-xl text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg cursor-pointer transition-all disabled:opacity-50"
            >
              <ArrowUpRight size={14} />
              <span>{isLoading ? 'Adding & Pushing...' : 'Add Remote & Push'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
