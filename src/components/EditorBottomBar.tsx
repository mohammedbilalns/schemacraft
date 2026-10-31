import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EditorBottomBarProps {
  lineCount: number;
}

export const EditorBottomBar: React.FC<EditorBottomBarProps> = ({ lineCount }) => {
  return (
    <div className="h-10 px-3 bg-[#1e1f26] border-t border-[#2a2b32] flex items-center justify-between text-xs text-gray-400 select-none">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 hover:text-gray-200 transition-colors" title="Syntax cheatsheet">
          <HelpCircle size={13} className="text-blue-400" />
          <span className="text-[11px] font-mono">
            &lt; 1-to-many &nbsp;|&nbsp; &gt; many-to-1 &nbsp;|&nbsp; - 1-to-1
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
