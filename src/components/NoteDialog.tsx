import React, { useState } from 'react';
import { MessageSquare, X, Plus, Trash2, Shield, User } from 'lucide-react';
import { ErdNote, GitUserConfig } from '../types/erd';

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'table' | 'field';
  tableName: string;
  fieldName?: string;
  notes: ErdNote[];
  currentUser: GitUserConfig;
  onAddNote: (content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NoteDialog: React.FC<NoteDialogProps> = ({
  isOpen,
  onClose,
  targetType,
  tableName,
  fieldName,
  notes,
  currentUser,
  onAddNote,
  onDeleteNote,
}) => {
  const [newContent, setNewContent] = useState('');

  if (!isOpen) return null;

  const title = targetType === 'field' ? `${tableName}.${fieldName}` : tableName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    onAddNote(newContent.trim());
    setNewContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-[480px] max-w-full max-h-[85vh] flex flex-col bg-[#1a1b22] border border-[#2d2f3d] rounded-2xl shadow-2xl overflow-hidden text-gray-200">
        <div className="p-4 border-b border-[#2d2f3d] flex items-center justify-between bg-[#15161c]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <MessageSquare size={17} className="text-amber-400 shrink-0" />
            <div className="overflow-hidden">
              <h3 className="font-semibold text-sm text-white truncate">Notes: {title}</h3>
              <p className="text-[11px] text-gray-400">Author: {currentUser.name || 'Anonymous'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notes.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500 italic">No notes added to this {targetType} yet.</div>
          ) : (
            notes.map((note) => {
              const isAuthor =
                (currentUser.email && note.authorEmail === currentUser.email) ||
                (currentUser.name && note.authorName === currentUser.name);

              return (
                <div
                  key={note.id}
                  className="p-3 bg-[#14151a] border border-[#282a36] rounded-xl space-y-1.5 transition-all"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-blue-400" />
                      <span className="font-semibold text-gray-200">{note.authorName}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 font-mono text-[10px]">
                        {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {isAuthor ? (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this note?')) {
                            onDeleteNote(note.id);
                          }
                        }}
                        className="p-1 hover:bg-red-950/60 text-gray-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                        title="Delete note (author only)"
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-gray-500" title="Only author can remove this note">
                        <Shield size={11} />
                        <span>Author protected</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-3 bg-[#15161c] border-t border-[#2d2f3d] space-y-2">
          <textarea
            rows={2}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={`Add a documentation note to this ${targetType}...`}
            className="w-full px-3 py-2 bg-[#101115] border border-[#303240] focus:border-blue-500 rounded-xl text-xs text-white outline-none resize-none font-sans"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={!newContent.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            >
              <Plus size={14} />
              <span>Add Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
