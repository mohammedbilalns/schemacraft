import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GitBar } from '../GitBar';

describe('GitBar Component', () => {
  it('renders brand name and clean Git status', () => {
    const handleBranch = vi.fn();
    const handleToggleCode = vi.fn();

    render(
      <GitBar
        status={{ is_repo: true, current_branch: 'main', is_clean: true, changed_files: [] }}
        onOpenBranchModal={handleBranch}
        onOpenCommitModal={vi.fn()}
        onOpenHistoryModal={vi.fn()}
        onInitGit={vi.fn()}
        onRefreshProject={vi.fn()}
        onExportPng={vi.fn()}
        onToggleLog={vi.fn()}
        isLogOpen={false}
        isEditorOpen={true}
        onToggleEditor={handleToggleCode}
      />
    );

    expect(screen.getByText('SchemaCraft')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
    expect(screen.getByText('Clean')).toBeInTheDocument();
    expect(screen.queryByText('Local-First')).not.toBeInTheDocument();

    const codeBtn = screen.getByTitle('Toggle Code Editor');
    expect(codeBtn).toBeInTheDocument();
    fireEvent.click(codeBtn);
    expect(handleToggleCode).toHaveBeenCalled();

    fireEvent.click(screen.getByText('main'));
    expect(handleBranch).toHaveBeenCalled();
  });

  it('renders modified files count when changes exist', () => {
    const handleCommit = vi.fn();
    render(
      <GitBar
        status={{ is_repo: true, current_branch: 'dev', is_clean: false, changed_files: ['users.erd'] }}
        onOpenBranchModal={vi.fn()}
        onOpenCommitModal={handleCommit}
        onOpenHistoryModal={vi.fn()}
        onInitGit={vi.fn()}
        onRefreshProject={vi.fn()}
        onExportPng={vi.fn()}
        onToggleLog={vi.fn()}
        isLogOpen={false}
        isEditorOpen={false}
        onToggleEditor={vi.fn()}
      />
    );

    expect(screen.getByText('1 changes')).toBeInTheDocument();
    fireEvent.click(screen.getByText('1 changes'));
    expect(handleCommit).toHaveBeenCalled();
  });

  it('renders "Init Git Repo" when directory is not a repository', () => {
    const handleInit = vi.fn();
    render(
      <GitBar
        status={{ is_repo: false, current_branch: '', is_clean: true, changed_files: [] }}
        onOpenBranchModal={vi.fn()}
        onOpenCommitModal={vi.fn()}
        onOpenHistoryModal={vi.fn()}
        onInitGit={handleInit}
        onRefreshProject={vi.fn()}
        onExportPng={vi.fn()}
        onToggleLog={vi.fn()}
        isLogOpen={false}
        isEditorOpen={true}
        onToggleEditor={vi.fn()}
      />
    );

    const initBtn = screen.getByText('Init Git Repo');
    expect(initBtn).toBeInTheDocument();
    fireEvent.click(initBtn);
    expect(handleInit).toHaveBeenCalled();
  });
});
