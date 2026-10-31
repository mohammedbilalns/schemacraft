import React, { useState, useEffect, useRef } from 'react';
import { ErdError } from '../types/erd';
import { EditorHeader } from './EditorHeader';
import { EditorErrors } from './EditorErrors';
import { EditorBottomBar } from './EditorBottomBar';
import { MonacoErdEditor } from './MonacoErdEditor';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  errors: ErdError[];
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  targetLine?: number | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  errors,
  isOpen,
  onClose,
  fileName = 'schema.erd',
  targetLine = null,
}) => {
  const [jumpLine, setJumpLine] = useState<number | null>(targetLine);
  const [isVimMode, setIsVimMode] = useState<boolean>(() => {
    return localStorage.getItem('schemacraft_vim_mode') === 'true';
  });
  const statusRef = useRef<HTMLDivElement>(null);
  const [editorWidth, setEditorWidth] = useState<number>(() => {
    const saved = localStorage.getItem('schemacraft_editor_width');
    return saved ? Math.max(320, Math.min(850, parseInt(saved, 10))) : 480;
  });
  const [isResizing, setIsResizing] = useState(false);

  const toggleVimMode = () => {
    setIsVimMode((prev) => {
      const next = !prev;
      localStorage.setItem('schemacraft_vim_mode', String(next));
      return next;
    });
  };

  useEffect(() => {
    setJumpLine(targetLine);
  }, [targetLine]);

  // Handle panel resizing via left drag handle
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 320;
      const maxWidth = Math.min(900, Math.floor(window.innerWidth * 0.75));
      const clamped = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setEditorWidth(clamped);
      localStorage.setItem('schemacraft_editor_width', clamped.toString());
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!isOpen) return null;

  const lines = code.split('\n');

  return (
    <div
      style={{ width: `${editorWidth}px` }}
      className="relative h-full bg-[#18191d] border-l border-[#2a2b32] flex flex-col z-30 shadow-2xl shrink-0"
    >
      {/* Resizing Handle */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
        className={`absolute top-0 bottom-0 -left-1.5 w-3 cursor-col-resize z-40 group flex items-center justify-center select-none ${
          isResizing ? 'bg-blue-500/20' : 'hover:bg-blue-500/10'
        }`}
        title="Drag to resize code panel"
      >
        <div
          className={`w-0.5 h-10 rounded-full transition-colors ${
            isResizing ? 'bg-blue-400' : 'bg-gray-600 group-hover:bg-blue-400'
          }`}
        />
      </div>

      <EditorHeader fileName={fileName} errors={errors} onClose={onClose} />
      <EditorErrors errors={errors} onJumpToLine={(line) => setJumpLine(line)} />

      <div className="flex-1 relative overflow-hidden bg-[#16171b]">
        {import.meta.env?.MODE === 'test' ? (
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-3 bg-transparent text-gray-200 font-mono text-xs outline-none resize-none"
            placeholder="Type your ERD code here..."
          />
        ) : (
          <MonacoErdEditor
            code={code}
            onChange={onChange}
            errors={errors}
            targetLine={jumpLine}
            isVimMode={isVimMode}
            statusElement={statusRef.current}
          />
        )}
      </div>

      <EditorBottomBar
        lineCount={lines.length}
        isVimMode={isVimMode}
        onToggleVim={toggleVimMode}
        statusRef={statusRef}
      />
    </div>
  );
};
