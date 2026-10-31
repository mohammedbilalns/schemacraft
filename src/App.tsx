import { useState, useCallback, useEffect } from 'react';
import { LogEntry, GitUserConfig } from './types/erd';
import { GitBar } from './components/GitBar';
import { Sidebar } from './components/Sidebar';
import { ErdCanvas } from './components/ErdCanvas';
import { EmptyCanvasState } from './components/EmptyCanvasState';
import { CodeEditor } from './components/CodeEditor';
import { SAMPLE_ERD_CODE } from './erd/sampleCode';
import { LogDrawer } from './components/LogDrawer';
import { AppModalsContainer } from './components/AppModalsContainer';
import { useProject } from './hooks/useProject';
import { useErdState } from './hooks/useErdState';
import { useNotes } from './hooks/useNotes';
import { useNotesUI } from './hooks/useNotesUI';
import { exportDiagramAsPng } from './utils/exportPng';
import * as tauri from './utils/tauriClient';

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<{ tableName: string; fieldName: string } | null>(null);
  const [editorTargetLine, setEditorTargetLine] = useState<number | null>(null);

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<GitUserConfig>({ name: '', email: '' });
  const [exportSavedPath, setExportSavedPath] = useState<string | null>(null);

  const addLog = useCallback((msg: string, level: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [{ id: Math.random().toString(), timestamp: time, message: msg, level }, ...prev].slice(0, 100));
  }, []);

  const project = useProject(addLog);
  const activeFile = project.files.find((f) => f.path === project.activeFilePath) || null;
  const erd = useErdState(activeFile, project.files, addLog, project.refreshGit);
  const notesHook = useNotes(project.currentDir, activeFile?.name || 'schema.erd', currentUser, addLog, project.refreshGit);
  const notesUI = useNotesUI();

  useEffect(() => {
    tauri.gitGetUserConfig(project.currentDir).then((cfg) => {
      setCurrentUser(cfg);
      if (!localStorage.getItem('schemacraft_onboarded') || !cfg.name) setIsOnboardingOpen(true);
    });
  }, [project.currentDir]);

  const handleTableClick = (tName: string | null) => {
    setSelectedTable(tName);
    const line = tName ? erd.tables.find((t) => t.name.toLowerCase() === tName.toLowerCase())?.lineNumber : null;
    if (line) {
      setIsEditorOpen(true);
      setEditorTargetLine(line);
    }
  };

  const handleFieldClick = (sel: { tableName: string; fieldName: string } | null) => {
    setSelectedField(sel);
    if (!sel) return;
    const t = erd.tables.find((tbl) => tbl.name.toLowerCase() === sel.tableName.toLowerCase());
    const line = t?.fields.find((f) => f.name.toLowerCase() === sel.fieldName.toLowerCase())?.lineNumber || t?.lineNumber;
    if (line) {
      setIsEditorOpen(true);
      setEditorTargetLine(line);
    }
  };

  const handleExportPng = async () => {
    try {
      addLog('Exporting diagram to PNG...', 'info');
      const baseName = activeFile ? activeFile.name.replace(/\.[^.]+$/, '') : 'diagram';
      const result = await exportDiagramAsPng(erd.tables, { filename: `${baseName}.png` });
      let saved = `${project.currentDir}/${baseName}.${result.isPng ? 'png' : 'svg'}`;
      if (project.currentDir) {
        const p = await tauri.saveDiagramPng(project.currentDir, `${baseName}.${result.isPng ? 'png' : 'svg'}`, result.dataUrl).catch(() => null);
        if (p) saved = p;
      }
      setExportSavedPath(saved);
      addLog(`Diagram saved to: ${saved}`, 'success');
    } catch (err) {
      addLog(`Export failed: ${err}`, 'error');
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#121316] text-gray-200 overflow-hidden font-sans">
      <GitBar
        status={project.gitStatus}
        onOpenBranchModal={() => setIsBranchModalOpen(true)}
        onOpenCommitModal={() => setIsCommitModalOpen(true)}
        onOpenHistoryModal={async () => {
          project.setCommits(await tauri.gitHistory(project.currentDir).catch(() => []));
          setIsHistoryModalOpen(true);
        }}
        onInitGit={async () => {
          await tauri.gitInit(project.currentDir);
          await project.refreshGit();
          addLog('Initialized Git repository', 'success');
        }}
        onRefreshProject={() => project.loadProject(project.currentDir)}
        onExportPng={handleExportPng}
        onToggleLog={() => setIsLogOpen(!isLogOpen)}
        isLogOpen={isLogOpen}
        isEditorOpen={isEditorOpen}
        onToggleEditor={() => setIsEditorOpen(!isEditorOpen)}
      />

      <div className="flex-1 flex relative overflow-hidden">
        <Sidebar
          currentDir={project.currentDir}
          files={project.files}
          activeFile={project.activeFilePath}
          onSelectFile={(path) => {
            project.setActiveFilePath(path);
          }}
          onCreateFile={project.createDiagramFile}
          onDeleteFile={project.deleteDiagramFile}
          onOpenDirectory={project.selectNewDirectory}
          isOpen={isSidebarOpen}
          onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 h-full relative overflow-hidden">
          <ErdCanvas
            tables={erd.tables}
            schema={erd.schema}
            onTablesChange={erd.handleTablesChange}
            onResetLayout={erd.resetLayout}
            selectedTable={selectedTable}
            onSelectTable={handleTableClick}
            selectedField={selectedField}
            onSelectField={handleFieldClick}
            isEditorOpen={isEditorOpen}
            onToggleEditor={() => setIsEditorOpen(!isEditorOpen)}
            getTableNotesCount={(tName) => notesHook.getTableNotes(tName).length}
            getFieldNotesMap={(tName) =>
              (erd.tables.find((t) => t.name.toLowerCase() === tName.toLowerCase())?.fields || []).reduce<Record<string, number>>((acc, f) => {
                const c = notesHook.getFieldNotes(tName, f.name).length;
                if (c > 0) acc[f.name.toLowerCase()] = c;
                return acc;
              }, {})
            }
            onContextMenuTable={(e, tName) => notesUI.openTableContextMenu(e, tName, notesHook.getTableNotes(tName).length)}
            onContextMenuField={(e, tName, fName) => notesUI.openFieldContextMenu(e, tName, fName, notesHook.getFieldNotes(tName, fName).length)}
            onOpenNotes={(type, tName, fName) => notesUI.setActiveNoteTarget({ targetType: type, tableName: tName, fieldName: fName })}
          />
          {(!project.currentDir || (!activeFile && project.files.length === 0)) && (
            <EmptyCanvasState
              currentDir={project.currentDir}
              hasFiles={project.files.length > 0}
              onOpenDirectory={project.selectNewDirectory}
              onCreateFile={() => project.createDiagramFile('schema.erd', SAMPLE_ERD_CODE)}
            />
          )}
        </main>

        <CodeEditor
          code={erd.code}
          onChange={erd.handleCodeChange}
          errors={erd.errors}
          isOpen={isEditorOpen && !!activeFile}
          onClose={() => setIsEditorOpen(false)}
          fileName={activeFile?.name || 'schema.erd'}
          targetLine={editorTargetLine}
        />
      </div>

      <LogDrawer isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} logs={logs} onClear={() => setLogs([])} />

      <AppModalsContainer
        project={project}
        notesHook={notesHook}
        notesUI={notesUI}
        erd={erd}
        activeFile={activeFile}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isBranchModalOpen={isBranchModalOpen}
        setIsBranchModalOpen={setIsBranchModalOpen}
        isCommitModalOpen={isCommitModalOpen}
        setIsCommitModalOpen={setIsCommitModalOpen}
        isHistoryModalOpen={isHistoryModalOpen}
        setIsHistoryModalOpen={setIsHistoryModalOpen}
        isOnboardingOpen={isOnboardingOpen}
        setIsOnboardingOpen={setIsOnboardingOpen}
        exportSavedPath={exportSavedPath}
        onCloseExportToast={() => setExportSavedPath(null)}
        addLog={addLog}
      />
    </div>
  );
}
