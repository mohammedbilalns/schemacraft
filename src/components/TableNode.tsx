import React from 'react';
import { ErdTable } from '../types/erd';
import { getColorTheme } from '../erd/colors';
import { getErdIcon } from '../erd/icons';
import { HEADER_HEIGHT, ROW_HEIGHT, BASE_WIDTH } from '../erd/layoutConstants';

interface TableNodeProps {
  table: ErdTable;
  isSelected: boolean;
  selectedField: { tableName: string; fieldName: string } | null;
  tableNotesCount?: number;
  fieldNotesMap?: Record<string, number>;
  onMouseDown: (e: React.MouseEvent) => void;
  onSelectField: (selection: { tableName: string; fieldName: string }) => void;
  onContextMenuTable?: (e: React.MouseEvent, tableName: string) => void;
  onContextMenuField?: (e: React.MouseEvent, tableName: string, fieldName: string) => void;
  onOpenNotes?: (targetType: 'table' | 'field', tableName: string, fieldName?: string) => void;
}

export const TableNode: React.FC<TableNodeProps> = ({
  table,
  isSelected,
  selectedField,
  tableNotesCount = 0,
  fieldNotesMap = {},
  onMouseDown,
  onSelectField,
  onContextMenuTable,
  onContextMenuField,
  onOpenNotes,
}) => {
  const width = table.width || BASE_WIDTH;
  const height = table.height || HEADER_HEIGHT + table.fields.length * ROW_HEIGHT + 14;
  const x = table.x || 0;
  const y = table.y || 0;
  const theme = getColorTheme(table.color);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="cursor-move select-none"
      onMouseDown={onMouseDown}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenuTable?.(e, table.name);
      }}
    >
      {isSelected && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          rx={10}
          ry={10}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      )}

      <rect x={0} y={0} width={width} height={height} rx={8} ry={8} fill="#18191e" stroke={theme.border} strokeWidth={1.5} />
      <path
        d={`M 1.5 8 A 6.5 6.5 0 0 1 8 1.5 L ${width - 8} 1.5 A 6.5 6.5 0 0 1 ${width - 1.5} 8 L ${width - 1.5} ${HEADER_HEIGHT} L 1.5 ${HEADER_HEIGHT} Z`}
        fill={theme.headerBg}
      />
      <line x1={0} y1={HEADER_HEIGHT} x2={width} y2={HEADER_HEIGHT} stroke="rgba(255, 255, 255, 0.1)" strokeWidth={1} />

      {/* Table Name */}
      <text x={14} y={HEADER_HEIGHT / 2 + 5} fill="#f3f4f6" fontSize="13" fontWeight="600" fontFamily="Inter, system-ui, sans-serif">
        {table.name}
      </text>

      {/* Table Notes Indicator Badge */}
      {tableNotesCount > 0 && (
        <g
          transform={`translate(${width - 54}, ${HEADER_HEIGHT / 2 - 8})`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onOpenNotes?.('table', table.name);
          }}
        >
          <rect width="20" height="16" rx="4" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="1" />
          <text x="10" y="11" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
            {tableNotesCount}
          </text>
        </g>
      )}

      {/* Table Icon */}
      <g transform={`translate(${width - 28}, ${HEADER_HEIGHT / 2 - 8})`}>
        {getErdIcon(table.icon, { size: 16, strokeWidth: 2, color: theme.border })}
      </g>

      {/* Column Rows */}
      {table.fields.map((field, fIdx) => {
        const rowY = HEADER_HEIGHT + fIdx * ROW_HEIGHT;
        const isFieldSelected =
          selectedField &&
          selectedField.tableName.toLowerCase() === table.name.toLowerCase() &&
          selectedField.fieldName.toLowerCase() === field.name.toLowerCase();
        const fieldNotesCount = fieldNotesMap[field.name.toLowerCase()] || 0;

        return (
          <g
            key={field.name}
            className="field-row cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectField({ tableName: table.name, fieldName: field.name });
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onContextMenuField?.(e, table.name, field.name);
            }}
          >
            {isFieldSelected && (
              <rect x={1} y={rowY} width={width - 2} height={ROW_HEIGHT} fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth={1} />
            )}

            <text
              x={14}
              y={rowY + ROW_HEIGHT / 2 + 4}
              fill={isFieldSelected ? '#ffffff' : '#e5e7eb'}
              fontSize="12"
              fontWeight={field.isPk ? '600' : '400'}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            >
              {field.name}
            </text>

            {fieldNotesCount > 0 && (
              <g
                transform={`translate(14 + ${field.name.length * 7.5 + 8}, ${rowY + 6})`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenNotes?.('field', table.name, field.name);
                }}
              >
                <circle cx="6" cy="6" r="6" fill="#f59e0b" />
                <text x="6" y="9" fill="#18191e" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {fieldNotesCount}
                </text>
              </g>
            )}

            <text
              x={width - 14}
              y={rowY + ROW_HEIGHT / 2 + 4}
              fill={theme.typeColor}
              fontSize="11.5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              textAnchor="end"
            >
              {field.type}
              {field.modifiers.length > 0 && ` ${field.modifiers.join(' ')}`}
            </text>
          </g>
        );
      })}
    </g>
  );
};
