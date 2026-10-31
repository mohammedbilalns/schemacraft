import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BranchModal } from '../BranchModal';

describe('BranchModal Component', () => {
  it('renders branch list and allows checkout', () => {
    const handleCheckout = vi.fn();
    render(
      <BranchModal
        isOpen={true}
        onClose={vi.fn()}
        currentBranch="main"
        branches={['main', 'feature/auth']}
        onCheckout={handleCheckout}
        onCreateBranch={vi.fn()}
      />
    );

    expect(screen.getByText('Switch or Create Branch')).toBeInTheDocument();
    expect(screen.getByText('feature/auth')).toBeInTheDocument();

    fireEvent.click(screen.getByText('feature/auth'));
    expect(handleCheckout).toHaveBeenCalledWith('feature/auth');
  });

  it('allows creating a new branch', () => {
    const handleCreate = vi.fn();
    render(
      <BranchModal
        isOpen={true}
        onClose={vi.fn()}
        currentBranch="main"
        branches={['main']}
        onCheckout={vi.fn()}
        onCreateBranch={handleCreate}
      />
    );

    const input = screen.getByPlaceholderText(/New branch name/);
    fireEvent.change(input, { target: { value: 'feature/payment' } });
    fireEvent.submit(input.closest('form')!);

    expect(handleCreate).toHaveBeenCalledWith('feature/payment');
  });
});
