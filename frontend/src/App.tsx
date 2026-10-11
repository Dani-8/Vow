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
