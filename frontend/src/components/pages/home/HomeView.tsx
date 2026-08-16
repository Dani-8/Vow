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

export const HomeView: React.FC<HomeViewProps> = ({
    tasks,
    stats,
    onToggleComplete,
    onCheckInToday,
    onOpenCreateModal,
    onOpenAIAssist,
    onViewTaskDetail,
}) => {
    const {
        formattedHoursMinutes,
        formattedDate,
        formattedDayName,
        weekDays,
        todayTasks,
        completedTodayCount,
        remainingTodayCount,
        progressPercent,
        focusList,
    } = useHomeData(tasks, stats);

    return (
        <div className="space-y-6 pb-8">
            {/* TOP ROW: Digital Clock & Master Streak Current Week */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <DigitalClockCard
                    formattedHoursMinutes={formattedHoursMinutes}
                    formattedDate={formattedDate}
                    formattedDayName={formattedDayName}
                />
                <MasterStreakCard
                    stats={stats}
                    weekDays={weekDays}
                    onCheckInToday={onCheckInToday}
                />
            </div>

            {/* MIDDLE ROW: Today's Focus & Today's Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <TodaysFocusCard
                    focusList={focusList}
                    onViewTaskDetail={onViewTaskDetail}
                />
                <TodaysTasksCard
                    todayTasks={todayTasks}
                    onToggleComplete={onToggleComplete}
                    onOpenCreateModal={onOpenCreateModal}
                    onViewTaskDetail={onViewTaskDetail}
                />
            </div>

            {/* BOTTOM ROW: Quick Progress, Upcoming Deadlines, Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickProgressCard
                    completedTodayCount={completedTodayCount}
                    remainingTodayCount={remainingTodayCount}
                    progressPercent={progressPercent}
                />
                <UpcomingDeadlinesCard
                    tasks={tasks}
                    onViewTaskDetail={onViewTaskDetail}
                />
                <QuickActionsCard
                    onOpenCreateModal={onOpenCreateModal}
                    onCheckInToday={onCheckInToday}
                    onOpenAIAssist={() => onOpenAIAssist()}
                />
            </div>
        </div>
    );
};
