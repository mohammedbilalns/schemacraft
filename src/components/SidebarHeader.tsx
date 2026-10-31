import React from 'react';
import { Folder, ChevronLeft, FolderOpen } from 'lucide-react';

interface SidebarHeaderProps {
  currentDir: string;
  onOpenDirectory: () => void;
  onToggleOpen: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  currentDir,
  onOpenDirectory,
  onToggleOpen,
}) => {
  const folderName = currentDir
    ? currentDir.split(/[\\/]/).filter(Boolean).pop() || currentDir
    : 'No Folder Selected';

  return (
    <div className="p-3 border-b border-[#24262f] flex items-center justify-between">
      <div className="flex items-center gap-2 overflow-hidden">
        <Folder size={16} className="text-amber-400 shrink-0" />
        <div className="overflow-hidden">
          <h2 className="text-xs font-semibold text-gray-200 truncate" title={currentDir}>
            {folderName}
          </h2>
          <p className="text-[10px] text-gray-400 truncate" title={currentDir}>
            {currentDir || 'Offline Workspace'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onOpenDirectory}
          className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Open Directory / Change Folder"
        >
          <FolderOpen size={15} />
        </button>
        <button
          onClick={onToggleOpen}
          className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Collapse Sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
};
