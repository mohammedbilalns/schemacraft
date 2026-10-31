import { describe, it, expect, vi } from 'vitest';
import { registerErdLanguage } from '../monacoErdTheme';

describe('registerErdLanguage', () => {
  it('registers language, auto-closing brackets configuration, and theme', () => {
    const mockMonaco = {
      languages: {
        getLanguages: vi.fn().mockReturnValue([]),
        register: vi.fn(),
        setLanguageConfiguration: vi.fn(),
        setMonarchTokensProvider: vi.fn(),
      },
      editor: {
        defineTheme: vi.fn(),
      },
    };

    registerErdLanguage(mockMonaco);

    expect(mockMonaco.languages.register).toHaveBeenCalledWith({ id: 'erd' });
    expect(mockMonaco.languages.setLanguageConfiguration).toHaveBeenCalledWith(
      'erd',
      expect.objectContaining({
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
        autoClosingPairs: expect.arrayContaining([
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
        ]),
      })
    );
    expect(mockMonaco.editor.defineTheme).toHaveBeenCalledWith(
      'schemacraft-dark',
      expect.any(Object)
    );
  });

  it('skips registration if already registered', () => {
    const mockMonaco = {
      languages: {
        getLanguages: vi.fn().mockReturnValue([{ id: 'erd' }]),
        register: vi.fn(),
        setLanguageConfiguration: vi.fn(),
        setMonarchTokensProvider: vi.fn(),
      },
      editor: {
        defineTheme: vi.fn(),
      },
    };

    registerErdLanguage(mockMonaco);
    expect(mockMonaco.languages.register).not.toHaveBeenCalled();
  });
});
