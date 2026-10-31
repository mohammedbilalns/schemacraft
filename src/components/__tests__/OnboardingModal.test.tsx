import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingModal } from '../OnboardingModal';

describe('OnboardingModal Component', () => {
  it('renders inputs with initial Git credentials and allows saving', () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <OnboardingModal
        isOpen={true}
        onClose={handleClose}
        initialConfig={{ name: 'Jane Doe', email: 'jane@example.com' }}
        onSaveConfig={handleSave}
      />
    );

    expect(screen.getByText('Welcome to SchemaCraft')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue('Jane Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Architect' } });

    const submitBtn = screen.getByText('Continue to Workspace');
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledWith({
      name: 'Jane Architect',
      email: 'jane@example.com',
    });
    expect(handleClose).toHaveBeenCalled();
  });
});
