import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { ErdError } from '../types/erd';
import { registerErdLanguage } from './monacoErdTheme';

interface MonacoErdEditorProps {
  code: string;
  onChange: (val: string) => void;
  errors: ErdError[];
  targetLine?: number | null;
}

export const MonacoErdEditor: React.FC<MonacoErdEditorProps> = ({
  code,
  onChange,
  errors,
  targetLine,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    registerErdLanguage(monaco);
    monaco.editor.setTheme('schemacraft-dark');
  };

  // Jump to line when targetLine changes
  useEffect(() => {
    if (editorRef.current && targetLine && targetLine > 0) {
      editorRef.current.revealLineInCenter(targetLine);
      editorRef.current.setPosition({ lineNumber: targetLine, column: 1 });
      editorRef.current.focus();
    }
  }, [targetLine]);

  // Update error squiggly markers
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const markers = errors.map((err) => ({
          startLineNumber: err.line,
          startColumn: 1,
          endLineNumber: err.line,
          endColumn: 100,
          message: err.message,
          severity:
            err.severity === 'error'
              ? monacoRef.current.MarkerSeverity.Error
              : monacoRef.current.MarkerSeverity.Warning,
        }));
        monacoRef.current.editor.setModelMarkers(model, 'schemacraft', markers);
      }
    }
  }, [errors]);

  return (
    <Editor
      height="100%"
      language="erd"
      theme="schemacraft-dark"
      value={code}
      onChange={(val) => onChange(val || '')}
      onMount={handleMount}
      options={{
        fontSize: 13,
        lineHeight: 21,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'off',
        automaticLayout: true,
        tabSize: 2,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoClosingDelete: 'always',
        autoClosingOvertype: 'always',
        matchBrackets: 'always',
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        padding: { top: 12, bottom: 12 },
      }}
    />
  );
};
