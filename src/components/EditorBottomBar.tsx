import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EditorBottomBarProps {
  lineCount: number;
  isVimMode: boolean;
  onToggleVim: () => void;
  statusRef?: React.RefObject<HTMLDivElement | null>;
}

export const EditorBottomBar: React.FC<EditorBottomBarProps> = ({
  lineCount,
  isVimMode,
  onToggleVim,
  statusRef,
}) => {
  return (
    <div className="h-10 px-3 bg-[#1e1f26] border-t border-[#2a2b32] flex items-center justify-between text-xs text-gray-400 select-none">
      <div className="flex items-center gap-2 overflow-hidden">
        <button
          onClick={onToggleVim}
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer border ${
            isVimMode
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-white/5 hover:bg-white/10 text-gray-400 border-transparent hover:text-gray-200'
          }`}
          title={isVimMode ? 'Vim keybindings enabled (Click to disable)' : 'Enable Vim keybindings'}
        >
          VIM
        </button>

        {isVimMode && statusRef && (
          <div
            ref={statusRef}
            className="text-[11px] font-mono text-emerald-400 font-semibold truncate max-w-[150px]"
          />
        )}

        <div className="hidden sm:flex items-center gap-1 hover:text-gray-200 transition-colors" title="Syntax cheatsheet">
          <HelpCircle size={13} className="text-blue-400" />
          <span className="text-[11px] font-mono">
            &lt; 1:N &nbsp;|&nbsp; &gt; N:1 &nbsp;|&nbsp; - 1:1
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-gray-400">
          {lineCount} lines
        </span>
      </div>
    </div>
  );
};
