import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu } from '../ContextMenu';

describe('ContextMenu Component', () => {
  it('renders target name and triggers Add Note and View Notes', () => {
    const handleAddNote = vi.fn();
    const handleViewNotes = vi.fn();
    const handleClose = vi.fn();

    render(
      <ContextMenu
        target={{
          x: 100,
          y: 100,
          targetType: 'field',
          tableName: 'users',
          fieldName: 'email',
          notesCount: 2,
        }}
        onClose={handleClose}
        onAddNote={handleAddNote}
        onViewNotes={handleViewNotes}
      />
    );

    expect(screen.getByText('users.email')).toBeInTheDocument();
    expect(screen.getByText('Add Note')).toBeInTheDocument();
    expect(screen.getByText('View Notes')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Add Note'));
    expect(handleAddNote).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });
});
