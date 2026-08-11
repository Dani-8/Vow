import React from 'react';
import { Flame, Trophy, CheckCircle, Repeat, LucideIcon } from 'lucide-react';
import { MasterStreakStats } from '../../../../types';

interface StatsMetricGridProps {
  stats: MasterStreakStats;
  overallBestStreak: number;
  totalTracked: number;
}

interface MetricItem {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  iconClass?: string;
  label: string;
  value: string;
  valueColor: string;
}

export const StatsMetricGrid: React.FC<StatsMetricGridProps> = ({
  stats,
  overallBestStreak,
  totalTracked,
}) => {
  const metrics: MetricItem[] = [
    {
      id: 'master',
      icon: Flame,
      iconColor: 'text-[#549acb]',
      iconClass: 'fill-[#549acb]',
      label: 'Master Streak',
      value: `${stats.masterStreak} Days`,
      valueColor: 'text-[#1a1c35]',
    },
    {
      id: 'best',
      icon: Trophy,
      iconColor: 'text-[#549acb]',
      label: 'Personal Best Streak',
      value: `${overallBestStreak} Days`,
      valueColor: 'text-[#549acb]',
    },
    {
      id: 'checkins',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      label: 'Total Check-In Days',
      value: `${stats.totalCheckIns} Days`,
      valueColor: 'text-emerald-700',
    },
    {
      id: 'tracked',
      icon: Repeat,
      iconColor: 'text-purple-600',
      label: 'Habits & Goals',
      value: `${totalTracked} Tracked`,
      valueColor: 'text-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="neu-card p-5 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl neu-button flex items-center justify-center ${item.iconColor} bg-[#E0E5EC] shrink-0`}>
              <Icon className={`w-6 h-6 ${item.iconClass || ''}`} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#717699] block">{item.label}</span>
              <span className={`text-2xl font-black ${item.valueColor}`}>{item.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
