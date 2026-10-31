import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErdCanvas } from '../ErdCanvas';
import { ErdSchema, ErdTable } from '../../types/erd';

describe('ErdCanvas Component', () => {
  const mockTable: ErdTable = {
    name: 'users',
    color: 'blue',
    x: 50,
    y: 50,
    width: 260,
    height: 140,
    fields: [
      { name: 'id', type: 'string', isPk: true, isFk: false, isNullable: false, isUnique: false, modifiers: ['pk'], rawLine: '', lineNumber: 1 },
      { name: 'email', type: 'string', isPk: false, isFk: false, isNullable: false, isUnique: false, modifiers: [], rawLine: '', lineNumber: 2 },
    ],
    lineNumber: 1,
  };

  const mockSchema: ErdSchema = {
    tables: [mockTable],
    relations: [],
  };

  it('renders canvas, controls, and table node', () => {
    render(
      <ErdCanvas
        schema={mockSchema}
        tables={[mockTable]}
        selectedTable={null}
        onSelectTable={vi.fn()}
        selectedField={null}
        onSelectField={vi.fn()}
        isEditorOpen={true}
        onToggleEditor={vi.fn()}
      />
    );

    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('Entity Relationship Diagram')).toBeInTheDocument();
  });

  it('handles table selection and field selection', () => {
    const handleSelectTable = vi.fn();
    const handleSelectField = vi.fn();

    render(
      <ErdCanvas
        schema={mockSchema}
        tables={[mockTable]}
        selectedTable={null}
        onSelectTable={handleSelectTable}
        selectedField={null}
        onSelectField={handleSelectField}
        isEditorOpen={true}
        onToggleEditor={vi.fn()}
      />
    );

    const tableName = screen.getByText('users');
    fireEvent.mouseDown(tableName);
    expect(handleSelectTable).toHaveBeenCalledWith('users');

    const fieldName = screen.getByText('email');
    fireEvent.click(fieldName);
    expect(handleSelectField).toHaveBeenCalledWith({ tableName: 'users', fieldName: 'email' });
  });

  it('displays bottom inspector when field is selected', () => {
    render(
      <ErdCanvas
        schema={mockSchema}
        tables={[mockTable]}
        selectedTable="users"
        onSelectTable={vi.fn()}
        selectedField={{ tableName: 'users', fieldName: 'id' }}
        onSelectField={vi.fn()}
        isEditorOpen={true}
        onToggleEditor={vi.fn()}
      />
    );

    expect(screen.getByText('Selected:')).toBeInTheDocument();
    expect(screen.getByText('users.id')).toBeInTheDocument();
  });
});
