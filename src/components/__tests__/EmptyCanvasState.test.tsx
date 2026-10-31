import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyCanvasState } from '../EmptyCanvasState';

describe('EmptyCanvasState Component', () => {
  it('renders welcome card when no directory is open', () => {
    render(
      <EmptyCanvasState
        currentDir=""
        hasFiles={false}
        onOpenDirectory={vi.fn()}
        onCreateFile={vi.fn()}
      />
    );

    expect(screen.getByText('Welcome to SchemaCraft')).toBeInTheDocument();
    expect(screen.getByText('Open Existing Folder')).toBeInTheDocument();
    expect(screen.getByText('Create New Project')).toBeInTheDocument();
  });

  it('renders empty workspace card when directory has no files', () => {
    render(
      <EmptyCanvasState
        currentDir="/home/user/empty-folder"
        hasFiles={false}
        onOpenDirectory={vi.fn()}
        onCreateFile={vi.fn()}
      />
    );

    expect(screen.getByText('Empty Workspace')).toBeInTheDocument();
    expect(screen.getByText(/empty-folder/)).toBeInTheDocument();
    expect(screen.getByText('Create Diagram File')).toBeInTheDocument();
  });

  it('renders nothing when directory has files', () => {
    const { container } = render(
      <EmptyCanvasState
        currentDir="/home/user/project"
        hasFiles={true}
        onOpenDirectory={vi.fn()}
        onCreateFile={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('triggers onOpenDirectory and onCreateFile callbacks', () => {
    const onOpen = vi.fn();
    const onCreate = vi.fn();

    render(
      <EmptyCanvasState
        currentDir=""
        hasFiles={false}
        onOpenDirectory={onOpen}
        onCreateFile={onCreate}
      />
    );

    fireEvent.click(screen.getByText('Open Existing Folder'));
    expect(onOpen).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Create New Project'));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });
});
