import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Sparkles, Code2, Layers } from 'lucide-react';

interface CanvasControlsProps {
  scale: number;
  onZoom: (delta: number) => void;
  onFitToScreen: () => void;
  onResetZoom: () => void;
  onResetLayout?: () => void;
  isEditorOpen: boolean;
  onToggleEditor: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  scale,
  onZoom,
  onFitToScreen,
  onResetZoom,
  onResetLayout,
  isEditorOpen,
  onToggleEditor,
}) => {
  return (
    <>
      {/* Top Floating Center Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#1b1c21]/90 backdrop-blur-md border border-[#2a2b32] rounded-full px-3 py-1.5 shadow-xl text-xs text-gray-300">
        <div className="flex items-center gap-1.5 px-2 py-0.5 text-blue-400 font-medium">
          <Layers size={14} />
          <span>Entity Relationship Diagram</span>
        </div>
        <div className="h-3 w-px bg-gray-700" />
        <button
          onClick={onToggleEditor}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer font-medium ${
            isEditorOpen ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'hover:bg-white/10 text-gray-300'
          }`}
          title="Toggle Code Editor"
        >
          <Code2 size={13} />
          <span>Code Editor</span>
        </button>
      </div>

      {/* Top Right Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[#1b1c21]/90 backdrop-blur-md border border-[#2a2b32] rounded-lg p-1 shadow-xl text-xs text-gray-300">
        <button
          onClick={() => onZoom(0.15)}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-300 hover:text-white cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>
        <button
          onClick={() => onZoom(-0.15)}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-300 hover:text-white cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={onFitToScreen}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-300 hover:text-white cursor-pointer"
          title="Fit to Screen"
        >
          <Maximize2 size={15} />
        </button>
        <button
          onClick={onResetZoom}
          className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-300 hover:text-white cursor-pointer"
          title="Reset Zoom to 100%"
        >
          <RotateCcw size={15} />
        </button>
        {onResetLayout && (
          <button
            onClick={onResetLayout}
            className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded transition-colors text-gray-300 hover:text-white cursor-pointer"
            title="Auto-organize Tables Layout"
          >
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-[11px]">Auto Layout</span>
          </button>
        )}
        <div className="px-2 py-0.5 text-[11px] font-mono text-gray-400 border-l border-gray-700">
          {Math.round(scale * 100)}%
        </div>
      </div>
    </>
  );
};
