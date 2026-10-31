import React from 'react';
import { FileCode, Trash2, FilePlus } from 'lucide-react';
import { ErdFileInfo } from '../types/erd';

interface SidebarFileListProps {
  files: ErdFileInfo[];
  activeFile: string | null;
  isCombinedMode: boolean;
  onSelectFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
  onRequestCreate: () => void;
}

export const SidebarFileList: React.FC<SidebarFileListProps> = ({
  files,
  activeFile,
  isCombinedMode,
  onSelectFile,
  onDeleteFile,
  onRequestCreate,
}) => {
  if (files.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-gray-500 space-y-2">
        <p>No .erd or .md files in this directory.</p>
        <button
          onClick={onRequestCreate}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded text-xs cursor-pointer"
        >
          <FilePlus size={13} />
          <span>Create first diagram</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
      {files.map((file) => {
        const isActive = !isCombinedMode && activeFile === file.path;
        return (
          <div
            key={file.path}
            onClick={() => onSelectFile(file.path)}
            className={`group flex items-center justify-between px-2.5 py-1.5 rounded text-xs cursor-pointer transition-colors ${
              isActive
                ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30 font-medium'
                : 'hover:bg-white/5 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FileCode size={14} className={isActive ? 'text-blue-400' : 'text-gray-400'} />
              <span className="truncate" title={file.relative_path}>
                {file.name}
              </span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete diagram "${file.name}"?`)) {
                    onDeleteFile(file.path);
                  }
                }}
                className="p-1 hover:bg-red-900/50 hover:text-red-300 rounded text-gray-500 transition-colors"
                title="Delete diagram"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
