import React from 'react';
import { Task, User } from '../../types';
import { api } from '../../api';
import { TaskModal } from '../TaskModal';
import { PrivatePinModal } from '../PrivatePinModal';
import { AIAssistModal } from '../AIAssistModal';
import { AuthModal } from '../AuthModal';

interface GlobalModalsProps {
  user: User | null;
  activeView: string;
  isTaskModalOpen: boolean;
  onCloseTaskModal: () => void;
  onSubmitTask: (taskData: {
    title: string;
    description?: string;
    tags?: string[];
    startTime?: string | null;
    endTime?: string | null;
    isPrivate?: boolean;
    isHabit?: boolean;
  }) => Promise<void>;
  editingTask: Task | null;

  isPinModalOpen: boolean;
  onClosePinModal: () => void;
  onSuccessPinUnlocked: () => Promise<void>;

  isAIAssistOpen: boolean;
  onCloseAIAssist: () => void;
  selectedTaskForAI: Task | null;

  isAuthModalOpen: boolean;
  onCloseAuthModal: () => void;
  onSuccessAuth: (user: User) => Promise<void>;
}

export const GlobalModals: React.FC<GlobalModalsProps> = ({
  user,
  activeView,
  isTaskModalOpen,
  onCloseTaskModal,
  onSubmitTask,
  editingTask,
  isPinModalOpen,
  onClosePinModal,
  onSuccessPinUnlocked,
  isAIAssistOpen,
  onCloseAIAssist,
  selectedTaskForAI,
  isAuthModalOpen,
  onCloseAuthModal,
  onSuccessAuth,
}) => {
  return (
    <>
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={onCloseTaskModal}
        onSubmit={onSubmitTask}
        editingTask={editingTask}
        defaultIsPrivate={activeView === 'private'}
      />

      <PrivatePinModal
        isOpen={isPinModalOpen}
        hasPinSet={!!user?.hasPinSet}
        onClose={onClosePinModal}
        onSuccessUnlocked={onSuccessPinUnlocked}
      />

      <AIAssistModal
        isOpen={isAIAssistOpen}
        task={selectedTaskForAI}
        onClose={onCloseAIAssist}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onCloseAuthModal}
        onSuccessAuth={onSuccessAuth}
      />
    </>
  );
};
