import { ErdTable, ErdField } from '../types/erd';

export function parseAttributes(attrString: string): { icon?: string; color?: string } {
  const result: { icon?: string; color?: string } = {};
  if (!attrString) return result;

  const parts = attrString.split(/[,;]+/);
  for (const part of parts) {
    const colonIdx = part.indexOf(':');
    if (colonIdx !== -1) {
      const key = part.slice(0, colonIdx).trim().toLowerCase();
      const val = part.slice(colonIdx + 1).trim();
      if (key === 'icon') result.icon = val;
      else if (key === 'color') result.color = val;
    }
  }
  return result;
}

export function parseTableHeader(
  line: string,
  lineNumber: number
): { table: ErdTable | null; hasOpenBrace: boolean } {
  const match = line.match(/^([a-zA-Z0-9_-]+)\s*(?:\[([^\]]*)\])?\s*\{?$/);
  if (!match) return { table: null, hasOpenBrace: false };

  const tableName = match[1];
  const attrString = match[2] || '';
  const hasOpenBrace = line.includes('{');
  const { icon, color } = parseAttributes(attrString);

  return {
    table: {
      name: tableName,
      icon,
      color: color || 'blue',
      fields: [],
      lineNumber,
    },
    hasOpenBrace,
  };
}

export function parseFieldLine(
  line: string,
  lineNumber: number,
  rawLine: string,
  comment?: string
): ErdField | null {
  const tokens = line.trim().split(/\s+/);
  if (tokens.length === 0 || !tokens[0]) return null;

  const name = tokens[0];
  const rest = tokens.slice(1);

  let isPk = false;
  let isFk = false;
  let isNullable = false;
  let isUnique = false;
  const modifiers: string[] = [];
  const typeTokens: string[] = [];

  for (let i = 0; i < rest.length; i++) {
    const t = rest[i].toLowerCase();
    if (t === 'pk') {
      isPk = true;
      modifiers.push('pk');
    } else if (t === 'fk') {
      isFk = true;
      modifiers.push('fk');
    } else if (t === '??' || t === '?') {
      isNullable = true;
      modifiers.push('??');
    } else if (t === 'unique') {
      isUnique = true;
      modifiers.push('unique');
    } else {
      typeTokens.push(rest[i]);
    }
  }

  const type = typeTokens.join(' ') || 'string';

  return {
    name,
    type,
    isPk,
    isFk,
    isNullable,
    isUnique,
    modifiers,
    comment,
    rawLine,
    lineNumber,
  };
}
