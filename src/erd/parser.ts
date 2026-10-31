import { ErdSchema, ErdTable, ErdRelation, ErdError } from '../types/erd';
import { parseTableHeader, parseFieldLine } from './parseTable';
import { parseRelationLine } from './parseRelation';

export function parseErd(code: string): { schema: ErdSchema; errors: ErdError[] } {
  const lines = code.split('\n');
  const tables: ErdTable[] = [];
  const relations: ErdRelation[] = [];
  const errors: ErdError[] = [];

  let currentTable: ErdTable | null = null;
  let inTableBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const lineNumber = i + 1;
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
      continue;
    }

    if (trimmed === '}' || trimmed.startsWith('}')) {
      if (!inTableBlock || !currentTable) {
        errors.push({
          line: lineNumber,
          message: 'Unexpected closing brace "}"',
          severity: 'error',
        });
      } else {
        tables.push(currentTable);
        currentTable = null;
        inTableBlock = false;
      }
      continue;
    }

    if (inTableBlock && currentTable) {
      let lineWithoutComment = trimmed;
      let comment = '';
      const commentIdx = trimmed.indexOf('//');
      if (commentIdx !== -1) {
        const beforeComment = trimmed.substring(0, commentIdx);
        if ((beforeComment.match(/"/g) || []).length % 2 === 0) {
          lineWithoutComment = beforeComment.trim();
          comment = trimmed.substring(commentIdx + 2).trim();
        }
      }

      if (!lineWithoutComment) continue;

      const field = parseFieldLine(lineWithoutComment, lineNumber, rawLine, comment);
      if (field) {
        currentTable.fields.push(field);
      } else {
        errors.push({
          line: lineNumber,
          message: `Invalid field: "${trimmed}"`,
          severity: 'error',
        });
      }
      continue;
    }

    const { table, hasOpenBrace } = parseTableHeader(trimmed, lineNumber);
    if (table) {
      currentTable = table;
      if (hasOpenBrace) {
        inTableBlock = true;
      } else {
        errors.push({
          line: lineNumber,
          message: `Table "${table.name}" missing opening "{"`,
          severity: 'error',
        });
        currentTable = null;
      }
      continue;
    }

    const relation = parseRelationLine(trimmed, lineNumber, rawLine);
    if (relation) {
      relations.push(relation);
      continue;
    }

    if (trimmed.includes('<') || trimmed.includes('>') || trimmed.includes('-')) {
      errors.push({
        line: lineNumber,
        message: `Malformed relationship: "${trimmed}". Expected "Table.col < Table.col"`,
        severity: 'warning',
      });
      continue;
    }

    errors.push({
      line: lineNumber,
      message: `Unrecognized syntax: "${trimmed}"`,
      severity: 'warning',
    });
  }

  if (inTableBlock && currentTable) {
    errors.push({
      line: currentTable.lineNumber,
      message: `Table "${currentTable.name}" missing closing "}"`,
      severity: 'error',
    });
    tables.push(currentTable);
  }

  const tableMap = new Set(tables.map((t) => t.name.toLowerCase()));
  for (const rel of relations) {
    if (!tableMap.has(rel.sourceTable.toLowerCase())) {
      errors.push({
        line: rel.lineNumber,
        message: `Table "${rel.sourceTable}" in relation is not defined`,
        severity: 'warning',
      });
    }
    if (!tableMap.has(rel.targetTable.toLowerCase())) {
      errors.push({
        line: rel.lineNumber,
        message: `Table "${rel.targetTable}" in relation is not defined`,
        severity: 'warning',
      });
    }
  }

  return { schema: { tables, relations }, errors };
}

export function mergeSchemas(schemas: ErdSchema[]): ErdSchema {
  const tableMap = new Map<string, ErdTable>();
  const relations: ErdRelation[] = [];

  for (const s of schemas) {
    for (const t of s.tables) {
      tableMap.set(t.name.toLowerCase(), t);
    }
    for (const r of s.relations) {
      relations.push(r);
    }
  }

  return {
    tables: Array.from(tableMap.values()),
    relations,
  };
}
