import React from 'react';
import { ScrollText, X, Trash2, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { LogEntry } from '../types/erd';

interface LogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClear: () => void;
}

export const LogDrawer: React.FC<LogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 bg-[#15161b] border-t border-[#2a2b34] z-40 flex flex-col shadow-2xl select-none">
      <div className="h-9 px-4 bg-[#1b1c23] border-b border-[#2a2b34] flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <ScrollText size={14} className="text-blue-400" />
          <span className="font-semibold text-gray-200">Activity & Git Log</span>
          <span className="text-[11px] text-gray-500">({logs.length} entries)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Clear Log"
          >
            <Trash2 size={12} />
            <span>Clear</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Close Log"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] space-y-1">
        {logs.length === 0 ? (
          <div className="p-4 text-center text-gray-500 italic">No activity logged yet</div>
        ) : (
          logs.map((log) => {
            const Icon =
              log.level === 'success'
                ? CheckCircle2
                : log.level === 'warn'
                ? AlertTriangle
                : log.level === 'error'
                ? AlertOctagon
                : Info;

            const colorClass =
              log.level === 'success'
                ? 'text-emerald-400'
                : log.level === 'warn'
                ? 'text-amber-400'
                : log.level === 'error'
                ? 'text-red-400'
                : 'text-blue-400';

            return (
              <div key={log.id} className="flex items-center gap-2 text-gray-300 hover:bg-white/5 px-2 py-0.5 rounded">
                <span className="text-gray-500 shrink-0">{log.timestamp}</span>
                <Icon size={12} className={`${colorClass} shrink-0`} />
                <span className="truncate">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
