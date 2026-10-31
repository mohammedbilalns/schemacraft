import { useState, useEffect, useCallback } from 'react';
import { ErdNote, GitUserConfig } from '../types/erd';
import * as tauri from '../utils/tauriClient';

export function useNotes(
  currentDir: string,
  activeDiagramName: string,
  currentUser: GitUserConfig,
  onLog: (msg: string, level?: 'info' | 'success' | 'warn' | 'error') => void,
  onGitRefresh: () => void
) {
  const [notes, setNotes] = useState<ErdNote[]>([]);

  const notesFileName = `${activeDiagramName.replace(/\.[^.]+$/, '')}.notes.json`;
  const notesFilePath = `${currentDir}/${notesFileName}`;

  // Load notes from file
  const loadNotes = useCallback(async () => {
    if (!currentDir || !activeDiagramName) return;
    try {
      const content = await tauri.readFile(notesFilePath);
      if (content && content.trim()) {
        const parsed = JSON.parse(content);
        setNotes(Array.isArray(parsed.notes) ? parsed.notes : []);
      } else {
        setNotes([]);
      }
    } catch {
      // file might not exist yet
      setNotes([]);
    }
  }, [currentDir, activeDiagramName, notesFilePath]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Save notes to file
  const persistNotes = async (updated: ErdNote[]) => {
    setNotes(updated);
    try {
      const json = JSON.stringify({ notes: updated }, null, 2);
      await tauri.writeFile(notesFilePath, json);
      onGitRefresh();
    } catch (err) {
      onLog(`Failed to save notes: ${err}`, 'error');
    }
  };

  const addNote = async (
    targetType: 'table' | 'field',
    tableName: string,
    fieldName: string | undefined,
    content: string
  ) => {
    if (!content.trim()) return;

    const newNote: ErdNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      targetType,
      tableName,
      fieldName,
      content: content.trim(),
      authorName: currentUser.name || 'Anonymous',
      authorEmail: currentUser.email || 'user@localhost',
      createdAt: new Date().toISOString(),
    };

    const updated = [...notes, newNote];
    await persistNotes(updated);
    onLog(`Note added by ${newNote.authorName} on ${tableName}${fieldName ? `.${fieldName}` : ''}`, 'success');
  };

  const deleteNote = async (noteId: string): Promise<boolean> => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return false;

    // Check author permissions: only the author can remove their note!
    const isAuthor =
      (currentUser.email && note.authorEmail === currentUser.email) ||
      (currentUser.name && note.authorName === currentUser.name);

    if (!isAuthor) {
      onLog(`Cannot delete note: only author (${note.authorName}) can delete it.`, 'warn');
      return false;
    }

    const updated = notes.filter((n) => n.id !== noteId);
    await persistNotes(updated);
    onLog(`Note removed by author ${currentUser.name}`, 'info');
    return true;
  };

  const getTableNotes = (tableName: string): ErdNote[] => {
    return notes.filter(
      (n) => n.tableName.toLowerCase() === tableName.toLowerCase() && n.targetType === 'table'
    );
  };

  const getFieldNotes = (tableName: string, fieldName: string): ErdNote[] => {
    return notes.filter(
      (n) =>
        n.tableName.toLowerCase() === tableName.toLowerCase() &&
        n.targetType === 'field' &&
        n.fieldName?.toLowerCase() === fieldName.toLowerCase()
    );
  };

  return {
    notes,
    addNote,
    deleteNote,
    getTableNotes,
    getFieldNotes,
    loadNotes,
  };
}
