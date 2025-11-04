import React from 'react';
import {
    Code,
    Dumbbell,
    BookOpen,
    ClipboardCheck,
    Sparkles,
    Calendar,
    ChevronRight,
    MoreVertical,
    Edit3,
    Trash2,
    Coffee,
    Flame,
} from 'lucide-react';
import { Challenge } from '../../../../../types';

interface ChallengeCardProps {
    challenge: Challenge;
    onSelect: (challenge: Challenge) => void;
    onEdit: (challenge: Challenge) => void;
    onTogglePause: (challenge: Challenge) => void;
    onDelete: (challenge: Challenge) => void;
    isMenuOpen: boolean;
    onToggleMenu: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
    engineering: Code,
    fitness: Dumbbell,
    learning: BookOpen,
    discipline: ClipboardCheck,
    mindfulness: Sparkles,
};

const getAccentColor = (challenge?: Partial<Challenge>): string => {
    if (!challenge?.color) return '#549acb';
    if (challenge.color.startsWith('#')) return challenge.color;
    const map: Record<string, string> = {
        purple: '#8b5cf6',
        blue: '#549acb',
        indigo: '#6366f1',
        emerald: '#10b981',
        amber: '#f59e0b',
        rose: '#f43f5e',
        cyan: '#06b6d4',
        pink: '#ec4899',
        orange: '#f97316',
    };
    return map[challenge.color] || '#549acb';
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
    challenge,
    onSelect,
    onEdit,
    onTogglePause,
    onDelete,
    isMenuOpen,
    onToggleMenu,
}) => {
    const IconComponent = CATEGORY_ICONS[challenge.category] || Code;
    const cardAccent = getAccentColor(challenge);
    const challengeId = challenge.id || challenge._id || '';

    // Calculate dates & streak
    const start = new Date(challenge.startDate || new Date());
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const nowMidnight = new Date();
    nowMidnight.setHours(0, 0, 0, 0);

    const diffMs = nowMidnight.getTime() - startMidnight.getTime();
    const daysDiff = Math.floor(diffMs / 86400000);
    const isUpcoming = daysDiff < 0;
    const daysUntilStart = isUpcoming ? Math.abs(daysDiff) : 0;
    const currentDay = isUpcoming ? 0 : Math.min(challenge.targetDays, daysDiff + 1);

    const targetEnd = new Date(
        challenge.targetEndDate || start.getTime() + challenge.targetDays * 86400000
    );

    const completedDays = challenge.logs.filter((l) => l.status === 'completed').length;

    let streak = 0;
    if (!isUpcoming && currentDay >= 1) {
        const todayLog = challenge.logs.find((l) => Number(l.dayNumber) === currentDay);
        let checkDay = todayLog?.status === 'completed' ? currentDay : currentDay - 1;
        while (checkDay >= 1) {
            const log = challenge.logs.find((l) => Number(l.dayNumber) === checkDay);
            if (log?.status === 'completed') {
                streak++;
                checkDay--;
            } else if (log?.status === 'rest') {
                checkDay--;
            } else {
                break;
            }
        }
    }

    return (
        <div
            onClick={() => onSelect(challenge)}
            className="neu-card p-6 bg-[#E0E5EC] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative group flex flex-col justify-between cursor-pointer select-none"
        >
            <div>
                {/* Top Row: Category Badge & Menu */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                            style={{ color: cardAccent, backgroundColor: `${cardAccent}18` }}
                        >
                            <IconComponent className="w-6 h-6" style={{ color: cardAccent }} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <span
                                className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full neu-inset"
                                style={{ color: cardAccent, backgroundColor: `${cardAccent}18` }}
                            >
                                {challenge.category || 'Engineering'}
                            </span>
                            {isUpcoming ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full neu-inset text-indigo-700 bg-indigo-50/70">
                                    Starts in {daysUntilStart} {daysUntilStart === 1 ? 'day' : 'days'}
                                </span>
                            ) : streak > 0 ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full neu-inset text-amber-700 bg-amber-50/70 flex items-center space-x-1">
                                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <span>{streak}d Streak</span>
                                </span>
                            ) : null}
                            {challenge.sprints && challenge.sprints.length > 0 && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full neu-inset text-slate-700 bg-slate-100/80">
                                    {challenge.sprints.length} {challenge.sprints.length === 1 ? 'Phase' : 'Phases'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleMenu(challengeId);
                            }}
                            className="p-1.5 rounded-xl neu-button text-slate-400 hover:text-slate-700"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 neu-card p-1.5 bg-[#E0E5EC] z-30 shadow-xl rounded-xl">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(challenge);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg flex items-center space-x-2"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTogglePause(challenge);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg flex items-center space-x-2"
                                >
                                    <Coffee className="w-3.5 h-3.5" />
                                    <span>
                                        {challenge.status === 'paused' ? 'Resume' : 'Pause'}
                                    </span>
                                </button>
                                <div className="my-1 border-t border-slate-300/60" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(challenge);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center space-x-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tags */}
                {challenge.tags && challenge.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {challenge.tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md neu-inset text-[10px] font-bold text-[#717699] bg-white/40"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title & Description */}
                <div className="space-y-1 group-hover:text-indigo-900">
                    <h3 className="text-base sm:text-lg font-black text-[#1a1c35] tracking-tight leading-snug">
                        {challenge.title}
                    </h3>
                    <p className="text-xs font-medium text-[#717699] line-clamp-2">
                        {challenge.description || 'Ship code. Learn AI. Build in public.'}
                    </p>
                </div>

                {/* Date Span */}
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#717699] mt-3">
                    <Calendar className="w-3.5 h-3.5" style={{ color: cardAccent }} />
                    <span>
                        {start.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        })}{' '}
                        –{' '}
                        {targetEnd.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>
                </div>
            </div>

            {/* Bottom Footer Progress Strip */}
            <div className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div
                        className="w-7 h-7 rounded-lg neu-inset flex items-center justify-center font-extrabold text-[10px]"
                        style={{ color: cardAccent }}
                    >
                        {challenge.targetDays}
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                        <span>{challenge.targetDays} Days Challenge</span>
                        <span
                            className="text-[10px] font-extrabold block"
                            style={{ color: cardAccent }}
                        >
                            {isUpcoming
                                ? `Starts in ${daysUntilStart} ${daysUntilStart === 1 ? 'day' : 'days'}`
                                : `Day ${currentDay} Today (${completedDays} logged)`}
                        </span>
                    </div>
                </div>

                <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};
