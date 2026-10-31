import React from 'react';
import { GitUserConfig } from '../types/erd';
import { AppModals } from './AppModals';
import * as tauri from '../utils/tauriClient';

interface ModalsContainerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notesHook: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notesUI: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  erd: any;
  activeFile: { relative_path: string; name: string } | null;
  currentUser: GitUserConfig;
  setCurrentUser: (cfg: GitUserConfig) => void;
  isBranchModalOpen: boolean;
  setIsBranchModalOpen: (open: boolean) => void;
  isCommitModalOpen: boolean;
  setIsCommitModalOpen: (open: boolean) => void;
  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  addLog: (msg: string, level?: 'info' | 'success' | 'warn' | 'error') => void;
}

export const AppModalsContainer: React.FC<ModalsContainerProps> = ({
  project,
  notesHook,
  notesUI,
  erd,
  activeFile,
  currentUser,
  setCurrentUser,
  isBranchModalOpen,
  setIsBranchModalOpen,
  isCommitModalOpen,
  setIsCommitModalOpen,
  isHistoryModalOpen,
  setIsHistoryModalOpen,
  isOnboardingOpen,
  setIsOnboardingOpen,
  addLog,
}) => {
  return (
    <AppModals
      isBranchModalOpen={isBranchModalOpen}
      onCloseBranchModal={() => setIsBranchModalOpen(false)}
      gitStatus={project.gitStatus}
      branches={project.branches}
      onCheckoutBranch={async (b) => {
        await tauri.gitCheckout(project.currentDir, b);
        await project.loadProject(project.currentDir);
        setIsBranchModalOpen(false);
        addLog(`Switched to branch "${b}"`, 'success');
      }}
      onCreateBranch={async (b) => {
        await tauri.gitCreateBranch(project.currentDir, b);
        await project.loadProject(project.currentDir);
        setIsBranchModalOpen(false);
        addLog(`Created branch "${b}"`, 'success');
      }}
      isCommitModalOpen={isCommitModalOpen}
      onCloseCommitModal={() => setIsCommitModalOpen(false)}
      onCommitChanges={async (msg) => {
        await tauri.gitCommit(project.currentDir, msg);
        await project.refreshGit();
        setIsCommitModalOpen(false);
        addLog(`Committed: "${msg}"`, 'success');
      }}
      isHistoryModalOpen={isHistoryModalOpen}
      onCloseHistoryModal={() => setIsHistoryModalOpen(false)}
      commits={project.commits}
      onReviewCommit={async (commit) => {
        if (!activeFile) return;
        try {
          const past = await tauri.gitShowFileAtCommit(project.currentDir, commit.hash, activeFile.relative_path);
          erd.setCode(past);
          setIsHistoryModalOpen(false);
          addLog(`Loaded ${activeFile.name} at commit ${commit.short_hash}`, 'info');
        } catch (err) {
          addLog(`Failed to load commit: ${err}`, 'error');
        }
      }}
      isOnboardingOpen={isOnboardingOpen}
      onCloseOnboarding={() => {
        setIsOnboardingOpen(false);
        localStorage.setItem('schemacraft_onboarded', 'true');
      }}
      currentUser={currentUser}
      onSaveUserConfig={async (cfg) => {
        setCurrentUser(cfg);
        await tauri.gitSetUserConfig(project.currentDir, cfg.name, cfg.email);
        localStorage.setItem('schemacraft_onboarded', 'true');
        addLog(`Git author set to ${cfg.name} <${cfg.email}>`, 'success');
      }}
      contextMenuTarget={notesUI.contextMenuTarget}
      onCloseContextMenu={() => notesUI.setContextMenuTarget(null)}
      onContextMenuAddNote={notesUI.openNoteDialogFromContext}
      onContextMenuViewNotes={notesUI.openNoteDialogFromContext}
      activeNoteTarget={notesUI.activeNoteTarget}
      onCloseNoteDialog={() => notesUI.setActiveNoteTarget(null)}
      targetNotes={
        notesUI.activeNoteTarget
          ? notesUI.activeNoteTarget.targetType === 'table'
            ? notesHook.getTableNotes(notesUI.activeNoteTarget.tableName)
            : notesHook.getFieldNotes(notesUI.activeNoteTarget.tableName, notesUI.activeNoteTarget.fieldName || '')
          : []
      }
      onAddNote={(content) => {
        if (notesUI.activeNoteTarget) {
          notesHook.addNote(notesUI.activeNoteTarget.targetType, notesUI.activeNoteTarget.tableName, notesUI.activeNoteTarget.fieldName, content);
        }
      }}
      onDeleteNote={(noteId) => notesHook.deleteNote(noteId)}
    />
  );
};
