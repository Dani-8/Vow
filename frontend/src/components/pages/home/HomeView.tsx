import React from 'react';
import { Task, MasterStreakStats } from '../../../types';
import { useHomeData } from '../../../hooks/useHomeData';
import { DigitalClockCard } from './components/DigitalClockCard';
import { MasterStreakCard } from './components/MasterStreakCard';
import { TodaysFocusCard } from './components/TodaysFocusCard';
import { TodaysTasksCard } from './components/TodaysTasksCard';
import { QuickProgressCard } from './components/QuickProgressCard';
import { UpcomingDeadlinesCard } from './components/UpcomingDeadlinesCard';
import { QuickActionsCard } from './components/QuickActionsCard';

interface HomeViewProps {
    tasks: Task[];
    stats: MasterStreakStats | null;
    onToggleComplete: (task: Task) => void;
    onCheckInToday: () => void;
    onOpenCreateModal: () => void;
    onOpenAIAssist: (task?: Task) => void;
    onViewTaskDetail: (task: Task) => void;
}
