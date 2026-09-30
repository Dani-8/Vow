import React from 'react';
import { useTaskData } from './hooks/useTaskData';
import { useModalState } from './hooks/useModalState';
import { useChallenges } from './hooks/useChallenges';

import { LandingPage } from './components/pages/landing/LandingPage';
import { AuthPage } from './components/pages/auth/AuthPage';
import { MainLayout } from './components/layout/MainLayout';
import { AppRouter } from './components/pages/router/AppRouter';
import { GlobalModals } from './components/modals/GlobalModals';
import { GlobalFloatingTimerBar } from './components/common/GlobalFloatingTimerBar';
import { FocusFinishedModal } from './components/modals/FocusFinishedModal';
import { useFocusTimer } from './context/FocusTimerContext';

export default function App() {
  const taskData = useTaskData();
  const modalState = useModalState();
  const challengeState = useChallenges(taskData.user);
  const { isFinishedModalOpen, closeFinishedModal, justFinishedSession } = useFocusTimer();

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
            modalState.editingTask?._id
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

      <GlobalFloatingTimerBar
        activeView={activeView}
        onGoToHome={() => navigateToView('home')}
      />

      <FocusFinishedModal
        isOpen={isFinishedModalOpen}
        onClose={closeFinishedModal}
        session={justFinishedSession}
        onCompleteTask={(taskId) => {
          const allTasks = [...taskData.tasks, ...privateTasks];
          const found = allTasks.find((t) => t._id === taskId);
          if (found && found.status !== 'completed') {
            taskData.handleToggleComplete(found, (t, status) => {
              if (
                modalState.selectedTaskForDetail &&
                modalState.selectedTaskForDetail._id === t._id
              ) {
                modalState.setSelectedTaskForDetail({ ...t, status: status as any });
              }
            });
          }
        }}
        onLogChallenge={async (challengeId, minutes, dayNumber, dateStr) => {
          const currentCh = challengeState.challenges.find((c) => c._id === challengeId || c.id === challengeId);
          if (currentCh) {
            const calculatedDay = dayNumber || (currentCh.logs ? currentCh.logs.length + 1 : 1);
            await challengeState.logDay(currentCh._id, {
              dayNumber: calculatedDay,
              date: dateStr || new Date().toISOString().split('T')[0],
              status: 'completed',
              note: `Completed ${minutes}m deep focus session.`,
              timeSpent: `${minutes}m`,
            });
          }
        }}
      />
    </MainLayout>
  );
}
