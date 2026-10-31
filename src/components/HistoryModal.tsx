import React from 'react';
import { History, X, Eye } from 'lucide-react';
import { GitCommitInfo } from '../types/erd';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  commits: GitCommitInfo[];
  onReviewCommit: (commit: GitCommitInfo) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  commits,
  onReviewCommit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[560px] max-h-[80vh] flex flex-col bg-[#1a1b21] border border-[#2d2e38] rounded-xl shadow-2xl overflow-hidden text-gray-200">
        <div className="p-4 border-b border-[#2d2e38] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-blue-400" />
            <h3 className="font-semibold text-sm text-white">Review Git History ({commits.length})</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {commits.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">No commits found in this repository.</div>
          ) : (
            commits.map((c) => (
              <div
                key={c.hash}
                className="p-3 bg-[#15161b] hover:bg-[#1f2027] border border-[#2a2b34] rounded-lg transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-gray-100">{c.message}</div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span className="font-mono bg-[#282a35] px-1.5 py-0.5 rounded text-blue-300">
                      {c.short_hash}
                    </span>
                    <span>{c.author}</span>
                    <span>•</span>
                    <span>{c.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => onReviewCommit(c)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium cursor-pointer transition-colors shrink-0"
                  title="View code and diagram at this commit"
                >
                  <Eye size={13} />
                  <span>Review</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
