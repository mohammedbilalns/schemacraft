import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportToast } from '../ExportToast';

describe('ExportToast Component', () => {
  it('renders file path when open and allows closing', () => {
    const handleClose = vi.fn();
    render(
      <ExportToast
        filePath="/path/to/diagram.png"
        isOpen={true}
        onClose={handleClose}
      />
    );

    expect(screen.getByText('Diagram Export Saved')).toBeInTheDocument();
    expect(screen.getByText('/path/to/diagram.png')).toBeInTheDocument();

    const closeBtn = screen.getByTitle('Dismiss message');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ExportToast
        filePath="/path/to/diagram.png"
        isOpen={false}
        onClose={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
