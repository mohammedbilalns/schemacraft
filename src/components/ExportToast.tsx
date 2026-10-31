import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, X, FileImage } from 'lucide-react';

interface ExportToastProps {
  filePath: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportToast: React.FC<ExportToastProps> = ({
  filePath,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !filePath) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(filePath).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#181920]/95 backdrop-blur-md border border-emerald-500/40 rounded-xl shadow-2xl text-xs text-gray-200 max-w-lg">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 size={18} />
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <FileImage size={13} className="text-emerald-400" />
            <span>Diagram Export Saved</span>
          </div>
          <div
            className="text-[11px] font-mono text-gray-300 truncate mt-0.5"
            title={filePath}
          >
            {filePath}
          </div>
        </div>

        <div className="flex items-center gap-1 border-l border-gray-700/60 pl-2">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Copy file path"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Dismiss message"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
