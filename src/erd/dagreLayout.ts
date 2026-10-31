import dagre from '@dagrejs/dagre';
import { ErdSchema, ErdTable } from '../types/erd';
import { HEADER_HEIGHT, ROW_HEIGHT, BASE_WIDTH, LayoutOptions } from './layoutConstants';

export function calculateLayout(
  schema: ErdSchema,
  existingPositions?: Map<string, { x: number; y: number }>,
  options: LayoutOptions = {}
): ErdTable[] {
  const rankdir = options.rankdir || 'LR';
  const g = new dagre.graphlib.Graph();

  g.setGraph({
    rankdir,
    nodesep: 80,
    ranksep: 130,
    marginx: 80,
    marginy: 80,
  });

  g.setDefaultEdgeLabel(() => ({}));
  const tables = [...schema.tables];

  for (const table of tables) {
    const key = table.name.toLowerCase();
    const width = computeTableWidth(table);
    const height = HEADER_HEIGHT + table.fields.length * ROW_HEIGHT + 14;
    g.setNode(key, { width, height, label: table.name });
  }

  for (const rel of schema.relations) {
    const src = rel.sourceTable.toLowerCase();
    const tgt = rel.targetTable.toLowerCase();
    if (g.hasNode(src) && g.hasNode(tgt)) {
      g.setEdge(src, tgt);
    }
  }

  dagre.layout(g);

  return tables.map((table) => {
    const key = table.name.toLowerCase();
    const node = g.node(key);
    const width = computeTableWidth(table);
    const height = HEADER_HEIGHT + table.fields.length * ROW_HEIGHT + 14;

    if (existingPositions && existingPositions.has(key)) {
      const pos = existingPositions.get(key)!;
      return { ...table, x: pos.x, y: pos.y, width, height };
    }

    const x = node ? node.x - width / 2 : 100;
    const y = node ? node.y - height / 2 : 100;

    return { ...table, x, y, width, height };
  });
}

function computeTableWidth(table: ErdTable): number {
  let maxLen = table.name.length;
  for (const f of table.fields) {
    const len = f.name.length + f.type.length + f.modifiers.join(' ').length;
    if (len > maxLen) maxLen = len;
  }
  return Math.min(380, Math.max(BASE_WIDTH, maxLen * 8.5 + 40));
}
