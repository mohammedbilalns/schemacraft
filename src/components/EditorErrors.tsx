import React from 'react';
import { ErdError } from '../types/erd';

interface EditorErrorsProps {
  errors: ErdError[];
  onJumpToLine: (line: number) => void;
}

export const EditorErrors: React.FC<EditorErrorsProps> = ({
  errors,
  onJumpToLine,
}) => {
  if (errors.length === 0) return null;

  return (
    <div className="max-h-36 overflow-y-auto bg-red-950/30 border-b border-red-900/50 p-2 text-xs">
      {errors.map((err, idx) => (
        <div
          key={idx}
          onClick={() => onJumpToLine(err.line)}
          className={`flex items-start gap-2 py-1 px-2 rounded cursor-pointer transition-colors ${
            err.severity === 'error'
              ? 'hover:bg-red-900/30 text-red-300'
              : 'hover:bg-amber-900/30 text-amber-300'
          }`}
        >
          <span className="font-mono text-[11px] font-semibold underline shrink-0">
            Line {err.line}:
          </span>
          <span className="text-[11px] leading-tight">{err.message}</span>
        </div>
      ))}
    </div>
  );
};
