export type Cardinality = '1' | '*' | '0..1';

export interface ErdField {
  name: string;
  type: string;
  isPk: boolean;
  isFk: boolean;
  isNullable: boolean;
  isUnique: boolean;
  modifiers: string[];
  comment?: string;
  rawLine: string;
  lineNumber: number;
}

export interface ErdTable {
  name: string;
  icon?: string;
  color: string;
  fields: ErdField[];
  lineNumber: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface ErdRelation {
  sourceTable: string;
  sourceField: string;
  targetTable: string;
  targetField: string;
  operator: '<' | '>' | '-' | '<>';
  sourceCardinality: Cardinality;
  targetCardinality: Cardinality;
  rawLine: string;
  lineNumber: number;
}

export interface ErdSchema {
  tables: ErdTable[];
  relations: ErdRelation[];
}

export interface ErdError {
  line: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ErdFileInfo {
  name: string;
  path: string;
  relative_path: string;
  content: string;
  size: number;
}

export interface GitCommitInfo {
  hash: string;
  short_hash: string;
  author: string;
  date: string;
  message: string;
}

export interface GitStatusInfo {
  is_repo: boolean;
  current_branch: string;
  is_clean: boolean;
  changed_files: string[];
}

export interface GitUserConfig {
  name: string;
  email: string;
}

export interface ErdNote {
  id: string;
  targetType: 'table' | 'field';
  tableName: string;
  fieldName?: string;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
}

export interface ProjectSummary {
  root_dir: string;
  files: ErdFileInfo[];
  git: GitStatusInfo;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}
