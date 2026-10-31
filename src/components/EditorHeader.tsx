import React from 'react';
import { FileCode, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { ErdError } from '../types/erd';

interface EditorHeaderProps {
  fileName: string;
  errors: ErdError[];
  onClose: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  fileName,
  errors,
  onClose,
}) => {
  const errorCount = errors.filter((e) => e.severity === 'error').length;
  const warningCount = errors.filter((e) => e.severity === 'warning').length;

  return (
    <div className="h-12 px-4 bg-[#1e1f26] border-b border-[#2a2b32] flex items-center justify-between select-none">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
        <FileCode size={16} className="text-blue-400" />
        <span className="text-gray-100">{fileName}</span>
        <span className="text-xs text-gray-400 hidden sm:inline">• Visualize data models</span>
      </div>

      <div className="flex items-center gap-2">
        {errorCount > 0 ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-red-950/80 text-red-300 border border-red-800">
            <AlertCircle size={12} />
            <span>{errorCount} Errors</span>
          </div>
        ) : warningCount > 0 ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-amber-950/80 text-amber-300 border border-amber-800">
            <AlertCircle size={12} />
            <span>{warningCount} Warnings</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <CheckCircle2 size={12} />
            <span>Valid ERD</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Close Editor"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
