import { useState, useEffect, useRef, useCallback } from 'react';
import { ErdSchema, ErdTable, ErdError, ErdFileInfo } from '../types/erd';
import { parseErd, mergeSchemas } from '../erd/parser';
import { calculateLayout } from '../erd/layout';
import { SAMPLE_ERD_CODE } from '../erd/sampleCode';
import { useDebounce } from './useDebounce';
import * as tauri from '../utils/tauriClient';

export function useErdState(
  activeFile: ErdFileInfo | null,
  files: ErdFileInfo[],
  isCombinedMode: boolean,
  onLog: (msg: string, level?: 'info' | 'success' | 'warn' | 'error') => void,
  onGitRefresh: () => void
) {
  const [code, setCode] = useState<string>(SAMPLE_ERD_CODE);
  const [schema, setSchema] = useState<ErdSchema>({ tables: [], relations: [] });
  const [tables, setTables] = useState<ErdTable[]>([]);
  const [errors, setErrors] = useState<ErdError[]>([]);
  const positionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Debounced code for responsive layout calculation while typing
  const debouncedCode = useDebounce(code, 180);

  // Load code from active file or combined files immediately
  useEffect(() => {
    if (isCombinedMode) {
      const combinedSchemas = files.map((f) => parseErd(f.content).schema);
      const merged = mergeSchemas(combinedSchemas);
      setSchema(merged);
      const laidOut = calculateLayout(merged, positionsRef.current);
      setTables(laidOut);
      setErrors([]);
      onLog(`Combined ${files.length} diagrams (${merged.tables.length} tables)`, 'info');
    } else if (activeFile) {
      setCode(activeFile.content);
      const { schema: s, errors: errs } = parseErd(activeFile.content);
      setSchema(s);
      setErrors(errs);
      setTables(calculateLayout(s, positionsRef.current));
    } else if (files.length === 0) {
      setCode(SAMPLE_ERD_CODE);
      const { schema: s, errors: errs } = parseErd(SAMPLE_ERD_CODE);
      setSchema(s);
      setErrors(errs);
      setTables(calculateLayout(s, positionsRef.current));
    }
  }, [activeFile?.path, isCombinedMode, files.length]);

  // Sane debouncing for layout computation during live typing
  useEffect(() => {
    if (isCombinedMode) return;
    const { schema: parsedSchema, errors: parseErrors } = parseErd(debouncedCode);
    setSchema(parsedSchema);
    setErrors(parseErrors);

    const laidOut = calculateLayout(parsedSchema, positionsRef.current);
    setTables(laidOut);
  }, [debouncedCode, isCombinedMode]);

  // Sane debounced auto-save to disk (450ms)
  const saveTimeoutRef = useRef<number | null>(null);
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);

    if (activeFile && !isCombinedMode) {
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
