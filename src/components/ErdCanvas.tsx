import React, { useRef, useState, useEffect } from 'react';
import { ErdSchema, ErdTable } from '../types/erd';
import { CanvasControls } from './CanvasControls';
import { CanvasInspector } from './CanvasInspector';
import { TableNode } from './TableNode';
import { RelationEdge } from './RelationEdge';
import { useCanvasViewport } from './useCanvasViewport';

interface ErdCanvasProps {
  schema: ErdSchema;
  tables: ErdTable[];
  onTablesChange?: (tables: ErdTable[]) => void;
  onResetLayout?: () => void;
  selectedTable: string | null;
  onSelectTable: (name: string | null) => void;
  selectedField: { tableName: string; fieldName: string } | null;
  onSelectField: (selection: { tableName: string; fieldName: string } | null) => void;
  isEditorOpen: boolean;
  onToggleEditor: () => void;
  canvasRef?: React.RefObject<SVGSVGElement | null>;
  getTableNotesCount?: (tableName: string) => number;
  getFieldNotesMap?: (tableName: string) => Record<string, number>;
  onContextMenuTable?: (e: React.MouseEvent, tableName: string) => void;
  onContextMenuField?: (e: React.MouseEvent, tableName: string, fieldName: string) => void;
  onOpenNotes?: (targetType: 'table' | 'field', tableName: string, fieldName?: string) => void;
}

export const ErdCanvas: React.FC<ErdCanvasProps> = ({
  tables,
  schema,
  onTablesChange,
  onResetLayout,
  selectedTable,
  onSelectTable,
  selectedField,
  onSelectField,
  isEditorOpen,
  onToggleEditor,
  canvasRef: externalCanvasRef,
  getTableNotesCount,
  getFieldNotesMap,
  onContextMenuTable,
  onContextMenuField,
  onOpenNotes,
}) => {
  const internalRef = useRef<SVGSVGElement | null>(null);
  const svgRef = externalCanvasRef || internalRef;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    transform,
    setTransform,
    isPanning,
    startPan,
    updatePan,
    endPan,
    handleZoom,
    fitToScreen,
  } = useCanvasViewport(containerRef, tables);

  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const hasAutoFittedRef = useRef(false);

  useEffect(() => {
    if (tables.length > 0 && !hasAutoFittedRef.current) {
      hasAutoFittedRef.current = true;
      fitToScreen();
    }
  }, [tables.length, fitToScreen]);

  const handleTableMouseDown = (e: React.MouseEvent, tableName: string) => {
    e.stopPropagation();
    onSelectTable(tableName);
    const table = tables.find((t) => t.name.toLowerCase() === tableName.toLowerCase());
    if (!table) return;
    const canvasX = (e.clientX - transform.x) / transform.scale;
    const canvasY = (e.clientY - transform.y) / transform.scale;
    setDraggingTable(tableName);
    setDragOffset({ x: canvasX - (table.x || 0), y: canvasY - (table.y || 0) });
  };

  const tableMap = new Map<string, ErdTable>();
  for (const t of tables) tableMap.set(t.name.toLowerCase(), t);

  const activeField = selectedField
    ? (() => {
        const t = tableMap.get(selectedField.tableName.toLowerCase());
        const f = t?.fields.find((fld) => fld.name.toLowerCase() === selectedField.fieldName.toLowerCase());
        return t && f ? { table: t, field: f } : null;
      })()
    : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#121316] select-none overflow-hidden cursor-default focus:outline-none"
      tabIndex={0}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'canvas-bg') {
          startPan(e.clientX, e.clientY);
          onSelectTable(null);
          onSelectField(null);
        }
      }}
      onMouseMove={(e) => {
        if (isPanning) updatePan(e.clientX, e.clientY);
        else if (draggingTable && onTablesChange) {
          const newX = (e.clientX - transform.x) / transform.scale - dragOffset.x;
          const newY = (e.clientY - transform.y) / transform.scale - dragOffset.y;
          onTablesChange(
            tables.map((t) => (t.name.toLowerCase() === draggingTable.toLowerCase() ? { ...t, x: Math.round(newX), y: Math.round(newY) } : t))
          );
        }
      }}
      onMouseUp={() => {
        endPan();
        setDraggingTable(null);
      }}
    >
      <CanvasControls
        scale={transform.scale}
        onZoom={handleZoom}
        onFitToScreen={fitToScreen}
        onResetZoom={() => setTransform((prev) => ({ ...prev, scale: 1 }))}
        onResetLayout={onResetLayout}
        isEditorOpen={isEditorOpen}
        onToggleEditor={onToggleEditor}
      />

      <svg ref={svgRef} id="erd-canvas-svg" className="w-full h-full block">
        <defs>
          <pattern id="grid-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.08)" />
          </pattern>
        </defs>
        <rect id="canvas-bg" x="0" y="0" width="100%" height="100%" fill="#121316" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-dots)" pointerEvents="none" />

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          <g className="relationships-layer">
            {schema.relations.map((rel, idx) => {
              const src = tableMap.get(rel.sourceTable.toLowerCase());
              const tgt = tableMap.get(rel.targetTable.toLowerCase());
              if (!src || !tgt) return null;
              const isHigh =
                selectedTable &&
                (selectedTable.toLowerCase() === rel.sourceTable.toLowerCase() ||
                  selectedTable.toLowerCase() === rel.targetTable.toLowerCase());
              return <RelationEdge key={idx} relation={rel} srcTable={src} tgtTable={tgt} isHighlighted={!!isHigh} />;
            })}
          </g>

          <g className="tables-layer">
            {tables.map((t) => (
              <TableNode
                key={t.name}
                table={t}
                isSelected={selectedTable?.toLowerCase() === t.name.toLowerCase()}
                selectedField={selectedField}
                tableNotesCount={getTableNotesCount?.(t.name) || 0}
                fieldNotesMap={getFieldNotesMap?.(t.name) || {}}
                onMouseDown={(e) => handleTableMouseDown(e, t.name)}
                onSelectField={(sel) => onSelectField(sel)}
                onContextMenuTable={onContextMenuTable}
                onContextMenuField={onContextMenuField}
                onOpenNotes={onOpenNotes}
              />
            ))}
          </g>
        </g>
      </svg>

      {activeField && (
        <CanvasInspector
          table={activeField.table}
          field={activeField.field}
          onDismiss={() => onSelectField(null)}
        />
      )}
    </div>
  );
};
