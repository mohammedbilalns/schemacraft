import React from 'react';
import { FolderOpen, PlusCircle, Database, FileText } from 'lucide-react';

interface EmptyCanvasStateProps {
  currentDir: string;
  hasFiles: boolean;
  onOpenDirectory: () => void;
  onCreateFile: () => void;
}

export const EmptyCanvasState: React.FC<EmptyCanvasStateProps> = ({
  currentDir,
  hasFiles,
  onOpenDirectory,
  onCreateFile,
}) => {
  if (currentDir && hasFiles) return null;

  const folderName = currentDir ? currentDir.split(/[\\/]/).filter(Boolean).pop() : '';

  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none z-10">
      <div className="pointer-events-auto max-w-md w-full bg-[#16171d]/90 backdrop-blur-xl border border-[#2a2c38] rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
          <Database size={30} className="stroke-[1.75]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {currentDir ? 'Empty Workspace' : 'Welcome to SchemaCraft'}
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
            {currentDir
              ? `No diagram files found in ${folderName}. Create your first schema file to begin.`
              : 'Open a local folder containing your schema files or create a new project to start designing.'}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={onOpenDirectory}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-900/30 cursor-pointer transition-all active:scale-[0.99]"
          >
            <FolderOpen size={15} />
            <span>Open Existing Folder</span>
          </button>

          <button
            onClick={onCreateFile}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1e2029] hover:bg-[#262835] border border-[#343646] hover:border-blue-500/50 text-gray-200 hover:text-white rounded-xl text-xs font-medium cursor-pointer transition-all active:scale-[0.99]"
          >
            <PlusCircle size={15} className="text-blue-400" />
            <span>{currentDir ? 'Create Diagram File' : 'Create New Project'}</span>
          </button>
        </div>

        <div className="pt-2 border-t border-[#232530] flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <FileText size={12} className="text-gray-400" />
          <span>Supports .erd, .schema, .md, and .txt files</span>
        </div>
      </div>
    </div>
  );
};
