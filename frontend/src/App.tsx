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
import { ActiveTimerConflictModal } from './components/modals/ActiveTimerConflictModal';
import { FocusZenModeModal } from './components/pages/home/components/FocusZenModeModal';
import { useFocusTimer } from './context/FocusTimerContext';
import { getTaskSlug } from './components/pages/router/AppRouter';

export default function App() {
  const taskData = useTaskData();
  const modalState = useModalState();
  const challengeState = useChallenges(taskData.user);
  const {
    isFinishedModalOpen,
    closeFinishedModal,
    justFinishedSession,
    activeSession,
    isConflictModalOpen,
    conflictPendingSession,
    closeConflictModal,
    confirmConflictSwitch,
    isZenModeOpen,
    closeZenMode,
  } = useFocusTimer();

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
    ></MainLayout>