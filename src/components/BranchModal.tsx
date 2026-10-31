import React, { useState } from 'react';
import { GitBranch, X, Plus, Check } from 'lucide-react';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch: string;
  branches: string[];
  onCheckout: (branch: string) => void;
  onCreateBranch: (branch: string) => void;
}

export const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  currentBranch,
  branches,
  onCheckout,
  onCreateBranch,
}) => {
  const [newBranchName, setNewBranchName] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    onCreateBranch(newBranchName.trim());
    setNewBranchName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[420px] bg-[#1a1b21] border border-[#2d2e38] rounded-xl shadow-2xl overflow-hidden text-gray-200">
        <div className="p-4 border-b border-[#2d2e38] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch size={18} className="text-blue-400" />
            <h3 className="font-semibold text-sm text-white">Switch or Create Branch</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-3 bg-[#141519] border-b border-[#2d2e38] flex gap-2">
          <input
            type="text"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            placeholder="New branch name (e.g. feature/auth)..."
            className="flex-1 px-3 py-1.5 bg-[#1f2027] border border-[#373844] focus:border-blue-500 rounded text-xs text-white outline-none font-mono"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium cursor-pointer"
          >
            <Plus size={14} />
            <span>Create</span>
          </button>
        </form>

        <div className="max-h-60 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Local Branches ({branches.length})
          </div>
          {branches.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">No branches found</div>
          ) : (
            branches.map((b) => {
              const isCurrent = b === currentBranch;
              return (
                <div
                  key={b}
                  onClick={() => onCheckout(b)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono">
                    <GitBranch size={14} className={isCurrent ? 'text-blue-400' : 'text-gray-500'} />
                    <span>{b}</span>
                  </div>
                  {isCurrent && <Check size={14} className="text-blue-400" />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
