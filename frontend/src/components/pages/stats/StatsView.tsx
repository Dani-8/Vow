import React from 'react';
import { MasterStreakStats, Task } from '../../../types';
import { StatsHeaderCard } from './components/StatsHeaderCard';
import { StatsMetricGrid } from './components/StatsMetricGrid';
import { StatsLeaderboard } from './components/StatsLeaderboard';

interface StatsViewProps {
  stats: MasterStreakStats | null;
  tasks: Task[];
  privateTasks: Task[];
}

export const StatsView: React.FC<StatsViewProps> = ({ stats, tasks, privateTasks }) => {
  if (!stats) return null;

  const allTasks = [...tasks, ...privateTasks];
  const overallBestStreak = allTasks.reduce((max, t) => Math.max(max, t.bestStreak || 0), 0);

  return (
    <div className="space-y-6">
      <StatsHeaderCard />
      <StatsMetricGrid
        stats={stats}
        overallBestStreak={overallBestStreak}
        totalTracked={allTasks.length}
      />
      <StatsLeaderboard tasks={allTasks} />
    </div>
  );
};
