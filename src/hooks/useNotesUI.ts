import { useState } from 'react';
import { ContextMenuTarget } from '../components/ContextMenu';

export interface ActiveNoteTarget {
  targetType: 'table' | 'field';
  tableName: string;
  fieldName?: string;
}

export function useNotesUI() {
  const [contextMenuTarget, setContextMenuTarget] = useState<ContextMenuTarget | null>(null);
  const [activeNoteTarget, setActiveNoteTarget] = useState<ActiveNoteTarget | null>(null);

  const openTableContextMenu = (e: React.MouseEvent, tableName: string, count: number) => {
    setContextMenuTarget({
      x: e.clientX,
      y: e.clientY,
      targetType: 'table',
      tableName,
      notesCount: count,
    });
  };

  const openFieldContextMenu = (e: React.MouseEvent, tableName: string, fieldName: string, count: number) => {
    setContextMenuTarget({
      x: e.clientX,
      y: e.clientY,
      targetType: 'field',
      tableName,
      fieldName,
      notesCount: count,
    });
  };

  const openNoteDialogFromContext = () => {
    if (contextMenuTarget) {
      setActiveNoteTarget({
        targetType: contextMenuTarget.targetType,
        tableName: contextMenuTarget.tableName,
        fieldName: contextMenuTarget.fieldName,
      });
    }
  };

  return {
    contextMenuTarget,
    setContextMenuTarget,
    activeNoteTarget,
    setActiveNoteTarget,
    openTableContextMenu,
    openFieldContextMenu,
    openNoteDialogFromContext,
  };
}
