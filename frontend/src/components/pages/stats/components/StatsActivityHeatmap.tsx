import React from 'react';
import { Trophy, Compass, ArrowRight, Flame, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { Challenge } from '../../../../types';
import { TaskMap } from '../../task-map/types';
import { getCategoryIconComponent } from '../../../common/categoryIcons';
import { getMapSlug } from '../../task-map/TaskMapPage';

interface StatsActiveEcosystemProps {
    challenges: Challenge[];
    taskMaps: TaskMap[];
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}

export const StatsActiveEcosystem: React.FC<StatsActiveEcosystemProps> = ({
    challenges,
    taskMaps,
    onNavigateToView,
}) => {
    const activeChallenges = challenges.filter((c) => (c.status || 'active') === 'active').slice(0, 3);
    const primaryMaps = taskMaps.slice(0, 3);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Active Challenges */}
            <div className="neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-[#1a1c35]">Active Challenges</h3>
                                <p className="text-xs text-[#717699] font-medium">
                                    Current challenges in progress
                                </p>
                            </div>
                        </div>

                        {onNavigateToView && (
                            <button
                                onClick={() => onNavigateToView('challenges')}
                                className="text-xs font-bold text-[#549acb] hover:text-[#44476A] flex items-center space-x-1"
                            >
                                <span>All Challenges</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {activeChallenges.length === 0 ? (
                        <div className="neu-inset p-5 rounded-2xl text-center space-y-2">
                            <p className="text-xs font-bold text-[#717699]">No active challenges right now.</p>
                            {onNavigateToView && (
                                <button
                                    onClick={() => onNavigateToView('challenges')}
                                    className="px-4 py-2 rounded-2xl neu-button text-xs font-black text-[#549acb] bg-[#E0E5EC]"
                                >
                                    + Start a 100-Day Challenge
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeChallenges.map((ch) => {
                                const Icon = getCategoryIconComponent(ch.icon || ch.category);
                                const completedLogs = (ch.logs || []).filter((l) => l.status === 'completed').length;
                                const percent = Math.min(100, Math.round((completedLogs / (ch.targetDays || 100)) * 100));

                                // Calculate streak
                                let streak = 0;
                                const sortedLogs = [...(ch.logs || [])].sort((a, b) => b.dayNumber - a.dayNumber);
                                for (const log of sortedLogs) {
                                    if (log.status === 'completed') streak++;
                                    else if (log.status === 'rest') continue;
                                    else break;
                                }

                                return (
                                    <div
                                        key={ch._id || ch.id}
                                        onClick={() => onNavigateToView?.('challenge-detail', ch.id || ch._id)}
                                        className="neu-inset p-4 rounded-2xl flex flex-col space-y-2.5 cursor-pointer hover:border-[#549acb]/40 border border-transparent transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0">
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-[#1a1c35] group-hover:text-[#549acb] transition-colors">
                                                        {ch.title}
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-[#717699]">
                                                        {ch.category} • {ch.targetDays || 100} Days Target
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <span className="px-2 py-0.5 rounded-full neu-button text-[10px] font-black text-amber-500 flex items-center space-x-1 bg-[#E0E5EC]">
                                                    <Flame className="w-3 h-3 fill-amber-500" />
                                                    <span>{streak}d Streak</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold text-[#717699]">
                                                <span>{completedLogs} days logged</span>
                                                <span>{percent}%</span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full bg-slate-300 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[#549acb] to-purple-600 transition-all duration-300"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Column 2: Active Roadmaps (Task Maps) */}
            <div className="neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-indigo-600 bg-[#E0E5EC]">
                                <Compass className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-[#1a1c35]">Strategic Task Maps</h3>
                                <p className="text-xs text-[#717699] font-medium">
                                    Visual dependency & milestone roadmaps
                                </p>
                            </div>
                        </div>

                        {onNavigateToView && (
                            <button
                                onClick={() => onNavigateToView('task-map')}
                                className="text-xs font-bold text-indigo-600 hover:text-[#44476A] flex items-center space-x-1"
                            >
                                <span>All Maps</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>