import React, { useEffect, useRef } from 'react';
import { MessageSquarePlus, MessageSquare, X } from 'lucide-react';

export interface ContextMenuTarget {
  x: number;
  y: number;
  targetType: 'table' | 'field';
  tableName: string;
  fieldName?: string;
  notesCount: number;
}

interface ContextMenuProps {
  target: ContextMenuTarget | null;
  onClose: () => void;
  onAddNote: () => void;
  onViewNotes: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  target,
  onClose,
  onAddNote,
  onViewNotes,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  if (!target) return null;

  const title =
    target.targetType === 'field'
      ? `${target.tableName}.${target.fieldName}`
      : target.tableName;

  return (
    <div
      ref={menuRef}
      style={{ left: target.x, top: target.y }}
      className="fixed z-50 w-52 bg-[#1b1c23] border border-[#2e303d] rounded-xl shadow-2xl overflow-hidden py-1 text-xs text-gray-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="px-3 py-1.5 border-b border-[#2a2b38] flex items-center justify-between text-[11px] font-mono text-gray-400">
        <span className="truncate max-w-[140px] font-semibold text-gray-300">{title}</span>
        <button onClick={onClose} className="hover:text-white cursor-pointer">
          <X size={12} />
        </button>
      </div>

      <div className="p-1 space-y-0.5">
        <button
          onClick={() => {
            onAddNote();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-blue-600/20 text-gray-200 hover:text-blue-300 transition-colors cursor-pointer text-left"
        >
          <MessageSquarePlus size={14} className="text-blue-400" />
          <span>Add Note</span>
        </button>

        {target.notesCount > 0 && (
          <button
            onClick={() => {
              onViewNotes();
              onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-gray-200 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-amber-400" />
              <span>View Notes</span>
            </div>
            <span className="bg-[#282a36] px-1.5 py-0.2 rounded-full text-[10px] font-mono text-amber-300">
              {target.notesCount}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
