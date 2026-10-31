import React, { useState } from 'react';
import { FilePlus, Layers, ChevronRight, Combine } from 'lucide-react';
import { ErdFileInfo } from '../types/erd';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFileList } from './SidebarFileList';

interface SidebarProps {
  currentDir: string;
  files: ErdFileInfo[];
  activeFile: string | null;
  onSelectFile: (path: string) => void;
  onCreateFile: (name: string) => void;
  onDeleteFile: (path: string) => void;
  onOpenDirectory: () => void;
  isCombinedMode: boolean;
  onToggleCombinedMode: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentDir,
  files,
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onOpenDirectory,
  isCombinedMode,
  onToggleCombinedMode,
  isOpen,
  onToggleOpen,
}) => {
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    let name = newFileName.trim();
    if (!name.endsWith('.erd') && !name.endsWith('.md')) name += '.erd';
    onCreateFile(name);
    setNewFileName('');
    setIsCreating(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="absolute top-4 left-4 z-20 p-2 bg-[#1b1c21]/90 backdrop-blur-md border border-[#2a2b32] hover:bg-[#252730] text-gray-300 hover:text-white rounded-lg shadow-xl cursor-pointer transition-colors"
        title="Open Files Sidebar"
      >
        <ChevronRight size={16} />
      </button>
    );
  }

  return (
    <div className="w-64 h-full bg-[#15161a] border-r border-[#24262f] flex flex-col z-30 select-none shadow-xl">
      <SidebarHeader
        currentDir={currentDir}
        onOpenDirectory={onOpenDirectory}
        onToggleOpen={onToggleOpen}
      />

      <div className="p-2 space-y-1 border-b border-[#24262f]">
        <button
          onClick={onToggleCombinedMode}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
            isCombinedMode
              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 font-medium'
              : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
          }`}
          title="Combine all ERD files in this project into one diagram"
        >
          <Combine size={14} className="text-blue-400" />
          <span>Combine All Diagrams</span>
        </button>
      </div>

      <div className="px-3 py-2 flex items-center justify-between text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
        <div className="flex items-center gap-1.5">
          <Layers size={13} />
          <span>Active Diagrams ({files.length})</span>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
          title="Create New Diagram File"
        >
          <FilePlus size={14} />
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="px-3 py-2 bg-[#1b1c22] border-y border-[#2a2b32]">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="e.g. orders.erd"
            autoFocus
            className="w-full px-2 py-1 bg-[#101114] border border-blue-500 rounded text-xs text-white outline-none font-mono"
          />
          <div className="flex justify-end gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-2 py-0.5 rounded text-[11px] text-gray-400 hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2.5 py-0.5 rounded text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      )}

      <SidebarFileList
        files={files}
        activeFile={activeFile}
        isCombinedMode={isCombinedMode}
        onSelectFile={onSelectFile}
        onDeleteFile={onDeleteFile}
        onRequestCreate={() => setIsCreating(true)}
      />

      <div className="p-3 border-t border-[#24262f] text-[11px] text-gray-500 flex items-center justify-between">
        <span className="font-mono text-gray-400">SchemaCraft</span>
        <span className="font-mono text-gray-600">v1.0.0</span>
      </div>
    </div>
  );
};
