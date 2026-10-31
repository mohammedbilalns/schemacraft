import { ErdRelation, Cardinality } from '../types/erd';

export function parseRelationLine(
  line: string,
  lineNumber: number,
  rawLine: string
): ErdRelation | null {
  const match = line.match(
    /^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\s*(<|>|-|<>)\s*([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)/
  );

  if (!match) return null;

  const sourceTable = match[1];
  const sourceField = match[2];
  const operator = match[3] as '<' | '>' | '-' | '<>';
  const targetTable = match[4];
  const targetField = match[5];

  let sourceCardinality: Cardinality = '1';
  let targetCardinality: Cardinality = '*';

  if (operator === '<') {
    sourceCardinality = '1';
    targetCardinality = '*';
  } else if (operator === '>') {
    sourceCardinality = '*';
    targetCardinality = '1';
  } else if (operator === '-') {
    sourceCardinality = '1';
    targetCardinality = '1';
  } else if (operator === '<>') {
    sourceCardinality = '*';
    targetCardinality = '*';
  }

  return {
    sourceTable,
    sourceField,
    targetTable,
    targetField,
    operator,
    sourceCardinality,
    targetCardinality,
    rawLine,
    lineNumber,
  };
}
