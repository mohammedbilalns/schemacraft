import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogDrawer } from '../LogDrawer';
import { LogEntry } from '../../types/erd';

describe('LogDrawer Component', () => {
  const mockLogs: LogEntry[] = [
    { id: '1', timestamp: '12:00:00', level: 'info', message: 'Project initialized' },
    { id: '2', timestamp: '12:01:00', level: 'success', message: 'Diagram saved' },
  ];

  it('renders log entries and handles clear', () => {
    const handleClear = vi.fn();
    render(
      <LogDrawer
        isOpen={true}
        onClose={vi.fn()}
        logs={mockLogs}
        onClear={handleClear}
      />
    );

    expect(screen.getByText('Activity & Git Log')).toBeInTheDocument();
    expect(screen.getByText('Project initialized')).toBeInTheDocument();
    expect(screen.getByText('Diagram saved')).toBeInTheDocument();

    const clearBtn = screen.getByText('Clear');
    fireEvent.click(clearBtn);

    expect(handleClear).toHaveBeenCalled();
  });
});
