import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NoteDialog } from '../NoteDialog';
import { ErdNote } from '../../types/erd';

describe('NoteDialog Component', () => {
  const mockNotes: ErdNote[] = [
    {
      id: 'note-1',
      targetType: 'field',
      tableName: 'users',
      fieldName: 'email',
      content: 'Unique constraint required',
      authorName: 'Author',
      authorEmail: 'author@example.com',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'note-2',
      targetType: 'field',
      tableName: 'users',
      fieldName: 'email',
      content: 'Masked in public APIs',
      authorName: 'Alex',
      authorEmail: 'alex@example.com',
      createdAt: '2025-01-01T01:00:00.000Z',
    },
  ];

  it('renders notes, lets author delete their own note, and protects other notes', () => {
    const handleDelete = vi.fn();
    render(
      <NoteDialog
        isOpen={true}
        onClose={vi.fn()}
        targetType="field"
        tableName="users"
        fieldName="email"
        notes={mockNotes}
        currentUser={{ name: 'Author', email: 'author@example.com' }}
        onAddNote={vi.fn()}
        onDeleteNote={handleDelete}
      />
    );

    expect(screen.getByText('Notes: users.email')).toBeInTheDocument();
    expect(screen.getByText('Unique constraint required')).toBeInTheDocument();
    expect(screen.getByText('Masked in public APIs')).toBeInTheDocument();

    // Author has delete button on note-1
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const deleteBtn = screen.getByTitle('Delete note (author only)');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this note?');
    expect(handleDelete).toHaveBeenCalledWith('note-1');

    // Canceling confirm does not trigger delete
    confirmSpy.mockReturnValue(false);
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledTimes(1);
    confirmSpy.mockRestore();

    // Alex note is author protected
    expect(screen.getByText('Author protected')).toBeInTheDocument();
  });

  it('submits a new note', () => {
    const handleAdd = vi.fn();
    render(
      <NoteDialog
        isOpen={true}
        onClose={vi.fn()}
        targetType="table"
        tableName="orders"
        notes={[]}
        currentUser={{ name: 'Author', email: 'author@example.com' }}
        onAddNote={handleAdd}
        onDeleteNote={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText(/Add a documentation note/);
    fireEvent.change(textarea, { target: { value: 'Partition table by month' } });

    const addBtn = screen.getByText('Add Note');
    fireEvent.click(addBtn);

    expect(handleAdd).toHaveBeenCalledWith('Partition table by month');
  });
});
