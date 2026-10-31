import React from 'react';
import {
  GitBranch,
  GitCommit,
  History,
  Download,
  ScrollText,
  CheckCircle,
  AlertCircle,
  FolderSync,
  Code2,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { GitStatusInfo } from '../types/erd';

interface GitBarProps {
  status: GitStatusInfo;
  onOpenBranchModal: () => void;
  onOpenCommitModal: () => void;
  onOpenHistoryModal: () => void;
  onInitGit: () => void;
  onRefreshProject: () => void;
  onPull?: () => void;
  onPush?: () => void;
  isPulling?: boolean;
  isPushing?: boolean;
  onExportPng: () => void;
  onToggleLog: () => void;
  isLogOpen: boolean;
  isEditorOpen: boolean;
  onToggleEditor: () => void;
}

export const GitBar: React.FC<GitBarProps> = ({
  status,
  onOpenBranchModal,
  onOpenCommitModal,
  onOpenHistoryModal,
  onInitGit,
  onRefreshProject,
  onPull,
  onPush,
  isPulling = false,
  isPushing = false,
  onExportPng,
  onToggleLog,
  isLogOpen,
  isEditorOpen,
  onToggleEditor,
}) => {
  return (
    <header className="h-12 bg-[#17181d] border-b border-[#24262f] px-4 flex items-center justify-between z-40 select-none shadow-sm">
      {/* Brand & Workspace */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="SchemaCraft Logo" className="w-6 h-6 rounded-md shadow-md object-cover" />
          <span className="font-bold text-sm text-gray-100 tracking-tight">SchemaCraft</span>
        </div>

        <button
          onClick={onRefreshProject}
          className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Refresh project files from disk"
        >
          <FolderSync size={15} />
        </button>
      </div>

      {/* Git Controls */}
      <div className="flex items-center gap-2">
        {status.is_repo ? (
          <>
            <button
              onClick={onOpenBranchModal}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1f2027] hover:bg-[#282a33] border border-[#343542] text-gray-200 rounded text-xs font-mono transition-colors cursor-pointer"
              title="Click to switch or create branch"
            >
              <GitBranch size={13} className="text-blue-400" />
              <span>{status.current_branch || 'main'}</span>
            </button>

            {status.is_clean ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60">
                <CheckCircle size={12} />
                <span>Clean</span>
              </div>
            ) : (
              <button
                onClick={onOpenCommitModal}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-amber-300 bg-amber-950/40 border border-amber-900/60 hover:bg-amber-900/30 transition-colors cursor-pointer"
                title="Files changed - click to commit"
              >
                <AlertCircle size={12} />
                <span>{status.changed_files.length} changes</span>
              </button>
            )}

            <button
              onClick={onOpenCommitModal}
              disabled={status.is_clean}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed text-blue-300 border border-blue-500/30 rounded text-xs font-medium transition-colors cursor-pointer"
            >
              <GitCommit size={13} />
              <span>Commit</span>
            </button>

            <button
              onClick={onPull}
              disabled={isPulling}
              className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 text-gray-300 hover:text-white rounded text-xs transition-colors cursor-pointer disabled:opacity-40"
              title="Pull latest changes from remote repository"
            >
              <ArrowDown size={13} className={isPulling ? 'animate-bounce text-blue-400' : ''} />
              <span>{isPulling ? 'Pulling...' : 'Pull'}</span>
            </button>

            <button
              onClick={onPush}
              disabled={isPushing}
              className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 text-gray-300 hover:text-white rounded text-xs transition-colors cursor-pointer disabled:opacity-40"
              title="Push changes to remote repository"
            >
              <ArrowUp size={13} className={isPushing ? 'animate-bounce text-blue-400' : ''} />
              <span>{isPushing ? 'Pushing...' : 'Push'}</span>
            </button>

            <button
              onClick={onOpenHistoryModal}
              className="flex items-center gap-1 px-2.5 py-1 hover:bg-white/10 text-gray-300 hover:text-white rounded text-xs transition-colors cursor-pointer"
              title="View past commits & reviews"
            >
              <History size={13} />
              <span>History</span>
            </button>
          </>
        ) : (
          <button
            onClick={onInitGit}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium cursor-pointer transition-colors shadow-sm"
          >
            <GitBranch size={13} />
            <span>Init Git Repo</span>
          </button>
        )}
      </div>

      {/* Right Actions: Code Toggle, Export + Log */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleEditor}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors border ${
            isEditorOpen
              ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
              : 'bg-[#1f2027] hover:bg-[#282a33] text-gray-300 border-[#343542]'
          }`}
          title="Toggle Code Editor"
        >
          <Code2 size={13} className={isEditorOpen ? 'text-blue-400' : 'text-gray-400'} />
          <span>Code</span>
        </button>

        <button
          onClick={onExportPng}
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded text-xs font-semibold cursor-pointer shadow-md transition-all"
          title="Export current diagram to high-res PNG"
        >
          <Download size={13} />
          <span>Export PNG</span>
        </button>

        <button
          onClick={onToggleLog}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            isLogOpen ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Activity Log"
        >
          <ScrollText size={16} />
        </button>
      </div>
    </header>
  );
};
