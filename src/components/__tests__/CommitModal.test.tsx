import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommitModal } from '../CommitModal';

describe('CommitModal Component', () => {
  it('renders changed files and handles committing', () => {
    const handleCommit = vi.fn();
    render(
      <CommitModal
        isOpen={true}
        onClose={vi.fn()}
        status={{ is_repo: true, current_branch: 'main', is_clean: false, changed_files: ['users.erd'] }}
        onCommit={handleCommit}
      />
    );

    expect(screen.getByText('Commit Changes to Git')).toBeInTheDocument();
    expect(screen.getByText('users.erd')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Update user relationships/);
    fireEvent.change(textarea, { target: { value: 'Add users schema' } });

    const submitBtn = screen.getByText('Commit Changes');
    fireEvent.click(submitBtn);

    expect(handleCommit).toHaveBeenCalledWith('Add users schema');
  });
});
