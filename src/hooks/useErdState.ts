import { useState, useEffect, useRef, useCallback } from 'react';
import { ErdSchema, ErdTable, ErdError, ErdFileInfo } from '../types/erd';
import { parseErd } from '../erd/parser';
import { calculateLayout } from '../erd/layout';
import { SAMPLE_ERD_CODE } from '../erd/sampleCode';
import { useDebounce } from './useDebounce';
import * as tauri from '../utils/tauriClient';

export function useErdState(
  activeFile: ErdFileInfo | null,
  files: ErdFileInfo[],
  onLog: (msg: string, level?: 'info' | 'success' | 'warn' | 'error') => void,
  onGitRefresh: () => void
) {
  const [code, setCode] = useState<string>('');
  const [schema, setSchema] = useState<ErdSchema>({ tables: [], relations: [] });
  const [tables, setTables] = useState<ErdTable[]>([]);
  const [errors, setErrors] = useState<ErdError[]>([]);
  const positionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Debounced code for responsive layout calculation while typing
  const debouncedCode = useDebounce(code, 180);

  // Load code from active file immediately
  useEffect(() => {
    if (activeFile) {
      setCode(activeFile.content);
      const { schema: s, errors: errs } = parseErd(activeFile.content);
      setSchema(s);
      setErrors(errs);
      setTables(calculateLayout(s, positionsRef.current));
    } else if (files.length === 0) {
      setCode('');
      setSchema({ tables: [], relations: [] });
      setTables([]);
      setErrors([]);
    }
  }, [activeFile?.path, files.length]);

  // Sane debouncing for layout computation during live typing
  useEffect(() => {
    if (!debouncedCode.trim()) {
      setSchema({ tables: [], relations: [] });
      setTables([]);
      setErrors([]);
      return;
    }
    const { schema: parsedSchema, errors: parseErrors } = parseErd(debouncedCode);
    setSchema(parsedSchema);
    setErrors(parseErrors);

    const laidOut = calculateLayout(parsedSchema, positionsRef.current);
    setTables(laidOut);
  }, [debouncedCode]);

  // Sane debounced auto-save to disk (450ms)
  const saveTimeoutRef = useRef<number | null>(null);
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);

    if (activeFile) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = window.setTimeout(async () => {
        try {
          await tauri.writeFile(activeFile.path, newCode);
          onGitRefresh();
        } catch (err) {
          onLog(`Save error: ${err}`, 'error');
        }
      }, 450);
    }
  };

  const handleTablesChange = (updated: ErdTable[]) => {
    for (const t of updated) {
      if (t.x !== undefined && t.y !== undefined) {
        positionsRef.current.set(t.name.toLowerCase(), { x: t.x, y: t.y });
      }
    }
    setTables(updated);
  };

  const resetLayout = useCallback(() => {
    positionsRef.current.clear();
    const laidOut = calculateLayout(schema);
    setTables(laidOut);
    onLog('Layout re-aligned automatically', 'info');
  }, [schema, onLog]);

  return {
    code,
    setCode,
    handleCodeChange,
    schema,
    tables,
    setTables,
    handleTablesChange,
    errors,
    resetLayout,
  };
}
