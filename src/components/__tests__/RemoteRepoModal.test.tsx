import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RemoteRepoModal } from '../RemoteRepoModal';

describe('RemoteRepoModal Component', () => {
  it('renders modal when open', () => {
    render(
      <RemoteRepoModal
        isOpen={true}
        onClose={vi.fn()}
        onAddRemoteAndPush={vi.fn()}
      />
    );

    expect(screen.getByText('Configure Remote Repository')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/github\.com/)).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <RemoteRepoModal
        isOpen={false}
        onClose={vi.fn()}
        onAddRemoteAndPush={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('validates empty URL', () => {
    render(
      <RemoteRepoModal
        isOpen={true}
        onClose={vi.fn()}
        onAddRemoteAndPush={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Add Remote & Push'));
    expect(screen.getByText('Please enter a remote repository URL.')).toBeInTheDocument();
  });

  it('calls onAddRemoteAndPush with name and url', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(
      <RemoteRepoModal
        isOpen={true}
        onClose={vi.fn()}
        onAddRemoteAndPush={onAdd}
      />
    );

    const input = screen.getByPlaceholderText(/github\.com/);
    fireEvent.change(input, { target: { value: 'https://github.com/user/my-repo.git' } });
    fireEvent.click(screen.getByText('Add Remote & Push'));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith('origin', 'https://github.com/user/my-repo.git');
    });
  });
});
