import React from 'react';
import { useTaskData } from './hooks/useTaskData';
import { useModalState } from './hooks/useModalState';
import { useChallenges } from './hooks/useChallenges';

import { LandingPage } from './components/pages/landing/LandingPage';
import { AuthPage } from './components/pages/auth/AuthPage';
import { MainLayout } from './components/layout/MainLayout';
import { AppRouter } from './components/pages/router/AppRouter';
import { GlobalModals } from './components/modals/GlobalModals';

export default function App() {
  const taskData = useTaskData();
  const modalState = useModalState();
  const challengeState = useChallenges(taskData.user);

  const {
    user,
    setUser,
    activeView,
    navigateToView,
    handleBypassAuth,
    refreshData,
    privateTasks,
    setPrivateTasks,
    setIsPrivateUnlocked,
  } = taskData;

  // Standalone Landing View
  if (activeView === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => {
          if (!user) {
            navigateToView('auth');
          } else {
            navigateToView('home');
          }
        }}
        onOpenAuth={() => navigateToView('auth')}
        onBypassAuth={handleBypassAuth}
      />
    );
  }

  // Standalone Auth View
  if (activeView === 'auth') {
    return (
      <AuthPage
        onSuccess={async (loggedUser) => {
          setUser(loggedUser);
          await refreshData();
          navigateToView('home');
        }}
        onBypass={handleBypassAuth}
        onBackToHome={() => navigateToView('landing')}
      />
    );
  }

  return (
    <MainLayout
      user={user}
      stats={taskData.stats}
      activeView={activeView}
      sidebarCollapsed={taskData.sidebarCollapsed}
      onToggleSidebarCollapse={() =>
        taskData.setSidebarCollapsed(!taskData.sidebarCollapsed)
      }
      isPrivateUnlocked={taskData.isPrivateUnlocked}
      onNavigate={(view) => {
        if (view === 'private' && !taskData.isPrivateUnlocked) {
          modalState.setIsPinModalOpen(true);
          navigateToView('private');
        } else {
          navigateToView(view);
        }
      }}
      onOpenCreateModal={modalState.openCreateTaskModal}
      onOpenAuthModal={() => navigateToView('auth')}
      onOpenPinModal={() => {
        modalState.setIsPinModalOpen(true);
        navigateToView('private');
      }}
      onLogout={taskData.handleLogout}
      onBypassAuth={handleBypassAuth}
    >
      <AppRouter
        activeView={activeView}
        location={taskData.location}
        user={user}
        tasks={taskData.tasks}
        privateTasks={privateTasks}
        filteredTasks={taskData.filteredTasks}
        stats={taskData.stats}
        isPrivateUnlocked={taskData.isPrivateUnlocked}
        selectedTaskForDetail={modalState.selectedTaskForDetail}
        setSelectedTaskForDetail={modalState.setSelectedTaskForDetail}
        searchQuery={taskData.searchQuery}
        setSearchQuery={taskData.setSearchQuery}
        filter={taskData.filter}
        setFilter={taskData.setFilter}
        navigate={taskData.navigate}
        navigateToView={navigateToView}
        setIsPrivateUnlocked={setIsPrivateUnlocked}
        onCheckInToday={taskData.handleDirectCheckIn}
        onToggleComplete={(task) =>
          taskData.handleToggleComplete(task, (t, status) => {
            if (
              modalState.selectedTaskForDetail &&
              modalState.selectedTaskForDetail._id === t._id
            ) {
              modalState.setSelectedTaskForDetail({ ...t, status: status as any });
            }
          })
        }
        onTogglePrivate={(task) =>
          taskData.handleTogglePrivate(task, () =>
            modalState.setIsPinModalOpen(true)
          )
        }
        onEditTask={modalState.openEditTaskModal}
        onDeleteTask={taskData.handleDeleteTask}
        onOpenAIAssist={modalState.openAIAssistModal}
        onOpenCreateModal={modalState.openCreateTaskModal}
        onOpenPinModal={() => {
          modalState.setIsPinModalOpen(true);
          navigateToView('private');
        }}
        challenges={challengeState.challenges}
        selectedChallenge={challengeState.selectedChallenge}
        setSelectedChallenge={challengeState.setSelectedChallenge}
        onCreateChallenge={challengeState.createChallenge}
        onUpdateChallenge={challengeState.updateChallenge}
        onDeleteChallenge={challengeState.deleteChallenge}
        onLogChallengeDay={challengeState.logDay}
        onDeleteChallengeLog={challengeState.deleteLog}
        onStartNextSprint={challengeState.startNextSprint}
        onCompleteSprint={challengeState.completeSprint}
        onUpdateSprintRule={challengeState.updateSprintRule}
      />

      <GlobalModals
        user={user}
        activeView={activeView}
        isTaskModalOpen={modalState.isTaskModalOpen}
        onCloseTaskModal={() => modalState.setIsTaskModalOpen(false)}
        onSubmitTask={async (data) => {
          await taskData.handleCreateOrUpdateTask(
            data,
          );
          modalState.setIsTaskModalOpen(false);
        }}
        editingTask={modalState.editingTask}
        isPinModalOpen={modalState.isPinModalOpen}
        onClosePinModal={() => modalState.setIsPinModalOpen(false)}
        onSuccessPinUnlocked={async () => {
          setIsPrivateUnlocked(true);
          navigateToView('private');
          try {
            const privRes = await (await import('./api')).api.getPrivateTasks();
            setPrivateTasks(privRes.tasks);
          } catch (err) {
            console.error('Failed to load private tasks:', err);
          }
        }}
        isAIAssistOpen={modalState.isAIAssistOpen}
        onCloseAIAssist={() => modalState.setIsAIAssistOpen(false)}
        selectedTaskForAI={modalState.selectedTaskForAI}
        isAuthModalOpen={modalState.isAuthModalOpen}
        onCloseAuthModal={() => modalState.setIsAuthModalOpen(false)}
        onSuccessAuth={async (loggedUser) => {
          setUser(loggedUser);
          await refreshData();
          navigateToView('visible');
        }}
      />
    </MainLayout>
  );
}
