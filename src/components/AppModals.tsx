import React from 'react';
import { GitStatusInfo, GitCommitInfo, GitUserConfig, ErdNote } from '../types/erd';
import { BranchModal } from './BranchModal';
import { CommitModal } from './CommitModal';
import { HistoryModal } from './HistoryModal';
import { OnboardingModal } from './OnboardingModal';
import { NoteDialog } from './NoteDialog';
import { ContextMenu, ContextMenuTarget } from './ContextMenu';

interface AppModalsProps {
  isBranchModalOpen: boolean;
  onCloseBranchModal: () => void;
  gitStatus: GitStatusInfo;
  branches: string[];
  onCheckoutBranch: (branch: string) => void;
  onCreateBranch: (branch: string) => void;

  isCommitModalOpen: boolean;
  onCloseCommitModal: () => void;
  onCommitChanges: (message: string) => void;

  isHistoryModalOpen: boolean;
  onCloseHistoryModal: () => void;
  commits: GitCommitInfo[];
  onReviewCommit: (commit: GitCommitInfo) => void;

  isOnboardingOpen: boolean;
  onCloseOnboarding: () => void;
  currentUser: GitUserConfig;
  onSaveUserConfig: (config: GitUserConfig) => void;

  contextMenuTarget: ContextMenuTarget | null;
  onCloseContextMenu: () => void;
  onContextMenuAddNote: () => void;
  onContextMenuViewNotes: () => void;

  activeNoteTarget: { targetType: 'table' | 'field'; tableName: string; fieldName?: string } | null;
  onCloseNoteDialog: () => void;
  targetNotes: ErdNote[];
  onAddNote: (content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const AppModals: React.FC<AppModalsProps> = ({
  isBranchModalOpen,
  onCloseBranchModal,
  gitStatus,
  branches,
  onCheckoutBranch,
  onCreateBranch,
  isCommitModalOpen,
  onCloseCommitModal,
  onCommitChanges,
  isHistoryModalOpen,
  onCloseHistoryModal,
  commits,
  onReviewCommit,
  isOnboardingOpen,
  onCloseOnboarding,
  currentUser,
  onSaveUserConfig,
  contextMenuTarget,
  onCloseContextMenu,
  onContextMenuAddNote,
  onContextMenuViewNotes,
  activeNoteTarget,
  onCloseNoteDialog,
  targetNotes,
  onAddNote,
  onDeleteNote,
}) => {
  return (
    <>
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={onCloseBranchModal}
        currentBranch={gitStatus.current_branch}
        branches={branches}
        onCheckout={onCheckoutBranch}
        onCreateBranch={onCreateBranch}
      />

      <CommitModal
        isOpen={isCommitModalOpen}
        onClose={onCloseCommitModal}
        status={gitStatus}
        onCommit={onCommitChanges}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={onCloseHistoryModal}
        commits={commits}
        onReviewCommit={onReviewCommit}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={onCloseOnboarding}
        initialConfig={currentUser}
        onSaveConfig={onSaveUserConfig}
      />

      <ContextMenu
        target={contextMenuTarget}
        onClose={onCloseContextMenu}
        onAddNote={onContextMenuAddNote}
        onViewNotes={onContextMenuViewNotes}
      />

      {activeNoteTarget && (
        <NoteDialog
          isOpen={true}
          onClose={onCloseNoteDialog}
          targetType={activeNoteTarget.targetType}
          tableName={activeNoteTarget.tableName}
          fieldName={activeNoteTarget.fieldName}
          notes={targetNotes}
          currentUser={currentUser}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
        />
      )}
    </>
  );
};
