import React from 'react';
import { Flame, Trophy, Compass, CheckCircle2, Award, Layers, Zap, ArrowUpRight } from 'lucide-react';
import { EcosystemOverview } from '../statsHelpers';

interface StatsMetricGridProps {
    overview: EcosystemOverview;
    onSelectTab?: (tab: 'overview' | 'analytics' | 'streaks') => void;
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}

export const StatsMetricGrid: React.FC<StatsMetricGridProps> = ({
    overview,
    onSelectTab,
    onNavigateToView,
}) => {
    const {
        masterStreak,
        bestMasterStreak,
        totalSprintLogsCount,
        activeChallengesCount,
        totalTrophiesEarned,
        completedMapNodes,
        totalMapNodes,
        roadmapCompletionRate,
        completedSubtasks,
        totalSubtasks,
        completedTasks,
        totalTasks,
        overallTaskCompletionRate,
    } = overview;

    const cards = [
        {
            id: 'pillar-streak',
            title: 'Master Streak',
            badge: 'Global Resilience',
            icon: Flame,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-500/10',
            primaryValue: `${masterStreak}d`,
            primaryLabel: 'Current Master Streak',
            secondaryValue: `${bestMasterStreak}d Record`,
            secondaryLabel: 'All-Time High',
            progressPercent: Math.min(100, Math.round((masterStreak / Math.max(bestMasterStreak, 1)) * 100)),
            progressColor: 'from-amber-400 to-amber-600',
            subText: masterStreak >= bestMasterStreak && masterStreak > 0
                ? '⚡ Currently matching or setting an all-time record!'
                : `Aiming to beat your personal best of ${bestMasterStreak} days.`,
            actionLabel: 'Open Streak Vault',
            onClick: () => onSelectTab?.('streaks'),
        },
        {
            id: 'pillar-challenges',
            title: 'Active Challenges',
            badge: `${activeChallengesCount} Active`,
            icon: Trophy,
            iconColor: 'text-[#549acb]',
            iconBg: 'bg-[#549acb]/10',
            primaryValue: `${totalSprintLogsCount}d`,
            primaryLabel: 'Total Days Logged',
            secondaryValue: `${totalTrophiesEarned} Badges`,
            secondaryLabel: 'Milestone Trophies',
            progressPercent: Math.min(100, (totalSprintLogsCount % 100)),
            progressColor: 'from-[#549acb] to-[#38bdf8]',
            subText: `${activeChallengesCount} challenge${activeChallengesCount === 1 ? '' : 's'} actively in progress.`,
            actionLabel: 'Explore Sprints',
            onClick: () => onNavigateToView?.('challenges'),
        },
        {
            id: 'pillar-roadmap',
            title: 'Task Map Velocity',
            badge: `${roadmapCompletionRate}% Cleared`,
            icon: Compass,
            iconColor: 'text-indigo-600',
            iconBg: 'bg-indigo-500/10',
            primaryValue: `${completedMapNodes}`,
            primaryLabel: `Nodes Conquered (${totalMapNodes} total)`,
            secondaryValue: `${overview.totalMaps} Maps`,
            secondaryLabel: 'Strategic Blueprints',
            progressPercent: roadmapCompletionRate,
            progressColor: 'from-indigo-500 to-blue-500',
            subText: `${totalMapNodes - completedMapNodes} remaining milestone node${(totalMapNodes - completedMapNodes) === 1 ? '' : 's'} to unlock.`,
            actionLabel: 'View Blueprints',
            onClick: () => onNavigateToView?.('task-map'),
        },
        {
            id: 'pillar-tasks',
            title: 'Subtask & Task Engine',
            badge: `${overallTaskCompletionRate}% Clearance`,
            icon: CheckCircle2,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-500/10',
            primaryValue: `${completedTasks + completedSubtasks}`,
            primaryLabel: 'Items Executed',
            secondaryValue: `${completedSubtasks} / ${totalSubtasks}`,
            secondaryLabel: 'Subtasks Finished',
            progressPercent: overallTaskCompletionRate,
            progressColor: 'from-emerald-500 to-teal-500',
            subText: `${completedTasks} of ${totalTasks} top-level tasks marked complete.`,
            actionLabel: 'Deep Analytics',
            onClick: () => onSelectTab?.('analytics'),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.id}
                        onClick={card.onClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                card.onClick?.();
                            }
                        }}
                        className="neu-card p-5 rounded-3xl flex flex-col justify-between space-y-4 hover:shadow-lg transition-all duration-200 border border-white/60 cursor-pointer group text-left focus:outline-none focus:ring-2 focus:ring-[#549acb]/50"
                    >
                        {/* Top row */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-11 h-11 rounded-2xl neu-button flex items-center justify-center ${card.iconColor} ${card.iconBg} shrink-0 group-hover:scale-105 transition-transform`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-1">
                                        <h3 className="text-sm font-black text-[#1a1c35] leading-tight group-hover:text-[#549acb] transition-colors">
                                            {card.title}
                                        </h3>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-[#717699] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-[10px] font-bold text-[#717699] uppercase tracking-wider">
                                        {card.primaryLabel}
                                    </span>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-[#44476A]">
                                {card.badge}
                            </span>
                        </div>
