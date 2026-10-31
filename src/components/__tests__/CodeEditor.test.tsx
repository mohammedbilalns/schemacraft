import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeEditor } from '../CodeEditor';

describe('CodeEditor Component', () => {
  it('renders editor with code content and header', () => {
    const code = 'users {\n  id string pk\n}';
    render(
      <CodeEditor
        code={code}
        onChange={vi.fn()}
        errors={[]}
        isOpen={true}
        onClose={vi.fn()}
        fileName="users.erd"
      />
    );

    expect(screen.getByText('users.erd')).toBeInTheDocument();
    expect(screen.getByText('Valid ERD')).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText('Type your ERD code here...') as HTMLTextAreaElement;
    expect(textarea.value).toBe(code);
    expect(screen.getByText('3 lines')).toBeInTheDocument();
  });

  it('calls onChange when user types code', () => {
    const handleChange = vi.fn();
    render(
      <CodeEditor
        code=""
        onChange={handleChange}
        errors={[]}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your ERD code here...');
    fireEvent.change(textarea, { target: { value: 'orders {}' } });
    expect(handleChange).toHaveBeenCalledWith('orders {}');
  });

  it('renders error notifications when errors are present', () => {
    const errors = [
      { line: 3, message: 'Table missing closing brace', severity: 'error' as const },
    ];
    render(
      <CodeEditor
        code="users {"
        onChange={vi.fn()}
        errors={errors}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('1 Errors')).toBeInTheDocument();
    expect(screen.getByText('Line 3:')).toBeInTheDocument();
    expect(screen.getByText('Table missing closing brace')).toBeInTheDocument();
  });

  it('toggles vim mode keybindings state on button click', () => {
    render(
      <CodeEditor
        code="users {}"
        onChange={vi.fn()}
        errors={[]}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const vimButton = screen.getByRole('button', { name: 'VIM' });
    expect(vimButton).toBeInTheDocument();
    expect(vimButton).toHaveAttribute('title', 'Enable Vim keybindings');

    fireEvent.click(vimButton);
    expect(vimButton).toHaveAttribute('title', 'Vim keybindings enabled (Click to disable)');
    expect(localStorage.getItem('schemacraft_vim_mode')).toBe('true');

    fireEvent.click(vimButton);
    expect(vimButton).toHaveAttribute('title', 'Enable Vim keybindings');
    expect(localStorage.getItem('schemacraft_vim_mode')).toBe('false');
  });
});
