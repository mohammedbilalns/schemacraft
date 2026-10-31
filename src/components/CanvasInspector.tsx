import React from 'react';
import { ErdTable, ErdField } from '../types/erd';
import { getColorTheme } from '../erd/colors';

interface CanvasInspectorProps {
  table: ErdTable;
  field: ErdField;
  onDismiss: () => void;
}

export const CanvasInspector: React.FC<CanvasInspectorProps> = ({
  table,
  field,
  onDismiss,
}) => {
  const theme = getColorTheme(table.color);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#1b1c21]/95 backdrop-blur-md border border-[#2a2b32] rounded-lg px-4 py-2 shadow-2xl text-xs text-gray-200">
      <span className="text-gray-400">Selected:</span>
      <span className="font-mono bg-[#282a33] px-2 py-0.5 rounded text-white font-medium border border-gray-700">
        {table.name}.{field.name}
      </span>
      <span
        className="font-mono px-2 py-0.5 rounded font-semibold"
        style={{
          color: theme.typeColor,
          backgroundColor: theme.badgeBg,
        }}
      >
        {field.type}
      </span>
      {field.modifiers.map((m) => (
        <span
          key={m}
          className="font-mono bg-blue-950/60 text-blue-300 border border-blue-800/60 px-1.5 py-0.5 rounded uppercase text-[10px]"
        >
          {m}
        </span>
      ))}
      {field.comment && (
        <span className="text-gray-400 italic text-[11px]">
          // {field.comment}
        </span>
      )}
      <button
        onClick={onDismiss}
        className="ml-2 text-gray-400 hover:text-white cursor-pointer"
        title="Dismiss inspector"
      >
        ✕
      </button>
    </div>
  );
};
