import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryModal } from '../HistoryModal';
import { GitCommitInfo } from '../../types/erd';

describe('HistoryModal Component', () => {
  const mockCommits: GitCommitInfo[] = [
    { hash: 'abc123456789', short_hash: 'abc1234', author: 'Bilal', date: '2025-01-01', message: 'Initial commit' },
  ];

  it('renders commit history and handles review action', () => {
    const handleReview = vi.fn();
    render(
      <HistoryModal
        isOpen={true}
        onClose={vi.fn()}
        commits={mockCommits}
        onReviewCommit={handleReview}
      />
    );

    expect(screen.getByText('Review Git History (1)')).toBeInTheDocument();
    expect(screen.getByText('Initial commit')).toBeInTheDocument();
    expect(screen.getByText('abc1234')).toBeInTheDocument();

    const reviewBtn = screen.getByText('Review');
    fireEvent.click(reviewBtn);

    expect(handleReview).toHaveBeenCalledWith(mockCommits[0]);
  });
});
