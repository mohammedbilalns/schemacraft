import React, { useState } from 'react';
import { GitCommit, X } from 'lucide-react';
import { GitStatusInfo } from '../types/erd';

interface CommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: GitStatusInfo;
  onCommit: (message: string) => void;
}

export const CommitModal: React.FC<CommitModalProps> = ({
  isOpen,
  onClose,
  status,
  onCommit,
}) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onCommit(message.trim());
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[480px] bg-[#1a1b21] border border-[#2d2e38] rounded-xl shadow-2xl overflow-hidden text-gray-200">
        <div className="p-4 border-b border-[#2d2e38] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit size={18} className="text-blue-400" />
            <h3 className="font-semibold text-sm text-white">Commit Changes to Git</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Changed & Untracked Files ({status.changed_files.length})
            </label>
            <div className="max-h-32 overflow-y-auto bg-[#141519] border border-[#2d2e38] rounded-lg p-2 font-mono text-[11px] space-y-1">
              {status.changed_files.length === 0 ? (
                <div className="text-gray-500 italic">No changed files detected</div>
              ) : (
                status.changed_files.map((f, i) => (
                  <div key={i} className="text-amber-300">
                    {f}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Commit Message
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Update user relationships and add order schema..."
              className="w-full px-3 py-2 bg-[#141519] border border-[#373844] focus:border-blue-500 rounded-lg text-xs text-white outline-none resize-none font-sans"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#2d2e38]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim() || status.changed_files.length === 0}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Commit Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
