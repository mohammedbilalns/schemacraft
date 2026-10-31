// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerErdLanguage(monaco: any) {
  if (!monaco?.languages) return;

  const languages = monaco.languages.getLanguages();
  if (languages.some((l: { id: string }) => l.id === 'erd')) return;

  monaco.languages.register({ id: 'erd' });

  monaco.languages.setMonarchTokensProvider('erd', {
    defaultToken: '',
    tokenPostfix: '.erd',
    tokenizer: {
      root: [
        [/\/\/.*$/, 'comment'],
        [/#.*$/, 'comment'],
        [/[{}]/, 'delimiter.bracket'],
        [/^([a-zA-Z0-9_-]+)(\s*)(\[)/, ['type.identifier', '', { token: 'delimiter.square', next: '@attributes' }]],
        [/^([a-zA-Z0-9_-]+)(\s*)(\{)/, ['type.identifier', '', 'delimiter.bracket']],
        [/([a-zA-Z0-9_-]+)(\.)([a-zA-Z0-9_-]+)/, ['type.identifier', 'delimiter', 'variable']],
        [/(<|>|-|<>)/, 'operator'],
        [/\b(pk|fk|unique)\b/i, 'keyword'],
        [/\?\?|\?/, 'keyword'],
        [/\b(string|number|boolean|timestamp|date|json|uuid|int|float)\b/i, 'type'],
        [/[a-zA-Z0-9_]+/, 'variable'],
      ],
      attributes: [
        [/\]/, 'delimiter.square', '@pop'],
        [/icon|color/, 'attribute.name'],
        [/:/, 'delimiter'],
        [/[a-zA-Z0-9_-]+/, 'attribute.value'],
        [/,/, 'delimiter'],
      ],
    },
  });

  monaco.editor.defineTheme('schemacraft-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'type.identifier', foreground: '38bdf8', fontStyle: 'bold' },
      { token: 'attribute.name', foreground: '34d399' },
      { token: 'attribute.value', foreground: 'fde047' },
      { token: 'variable', foreground: 'f3f4f6' },
      { token: 'type', foreground: 'fb923c' },
      { token: 'keyword', foreground: '34d399', fontStyle: 'bold' },
      { token: 'operator', foreground: 'f472b6', fontStyle: 'bold' },
      { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
      { token: 'delimiter.bracket', foreground: 'facc15', fontStyle: 'bold' },
    ],
    colors: {
      'editor.background': '#16171b',
      'editor.foreground': '#f3f4f6',
      'editorCursor.foreground': '#38bdf8',
      'editor.lineHighlightBackground': '#1e2028',
      'editorLineNumber.foreground': '#4b5563',
      'editorLineNumber.activeForeground': '#9ca3af',
    },
  });
}
