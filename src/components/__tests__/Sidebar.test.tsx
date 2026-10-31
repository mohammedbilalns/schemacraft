import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { ErdFileInfo } from '../../types/erd';

describe('Sidebar Component', () => {
  const mockFiles: ErdFileInfo[] = [
    { name: 'users.erd', path: '/path/users.erd', relative_path: 'users.erd', content: '', size: 100 },
    { name: 'orders.erd', path: '/path/orders.erd', relative_path: 'orders.erd', content: '', size: 200 },
  ];

  it('renders files list and workspace folder', () => {
    render(
      <Sidebar
        currentDir="/home/user/my-project"
        files={mockFiles}
        activeFile="/path/users.erd"
        onSelectFile={vi.fn()}
        onCreateFile={vi.fn()}
        onDeleteFile={vi.fn()}
        onOpenDirectory={vi.fn()}
        isCombinedMode={false}
        onToggleCombinedMode={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    expect(screen.getByText('my-project')).toBeInTheDocument();
    expect(screen.getByText('users.erd')).toBeInTheDocument();
    expect(screen.getByText('orders.erd')).toBeInTheDocument();
    expect(screen.getByText('Combine All Diagrams')).toBeInTheDocument();
  });

  it('handles selecting a file', () => {
    const handleSelect = vi.fn();
    render(
      <Sidebar
        currentDir="/home/user/my-project"
        files={mockFiles}
        activeFile="/path/users.erd"
        onSelectFile={handleSelect}
        onCreateFile={vi.fn()}
        onDeleteFile={vi.fn()}
        onOpenDirectory={vi.fn()}
        isCombinedMode={false}
        onToggleCombinedMode={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('orders.erd'));
    expect(handleSelect).toHaveBeenCalledWith('/path/orders.erd');
  });

  it('allows creating a new diagram file', () => {
    const handleCreate = vi.fn();
    render(
      <Sidebar
        currentDir="/home/user/my-project"
        files={mockFiles}
        activeFile={null}
        onSelectFile={vi.fn()}
        onCreateFile={handleCreate}
        onDeleteFile={vi.fn()}
        onOpenDirectory={vi.fn()}
        isCombinedMode={false}
        onToggleCombinedMode={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    const plusBtn = screen.getByTitle('Create New Diagram File');
    fireEvent.click(plusBtn);

    const input = screen.getByPlaceholderText('e.g. orders.erd');
    fireEvent.change(input, { target: { value: 'billing' } });
    fireEvent.submit(input.closest('form')!);

    expect(handleCreate).toHaveBeenCalledWith('billing.erd');
  });
});
