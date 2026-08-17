import React, { useState, useMemo } from 'react';
import {
    ArrowLeft,
    Share2,
    Settings,
    MoreVertical,
    Calendar,
    Clock,
    CheckCircle2,
    Flame,
    TrendingUp,
    Tag,
    Edit3,
    Lightbulb,
    BookOpen,
    Code,
    Dumbbell,
    ClipboardCheck,
    Sparkles,
    ChevronRight,
    Plus,
    Trash2,
    Coffee,
    AlertCircle,
    ExternalLink,
} from 'lucide-react';
import { Challenge, ChallengeLog } from '../../../types';
import { LogChallengeDayModal } from './LogChallengeDayModal';
import { CreateChallengeModal } from './CreateChallengeModal';

interface ChallengeDetailPageProps {
    challenge: Challenge;
    onBack: () => void;
    onUpdateChallenge: (id: string, updates: Partial<Challenge>) => Promise<void>;
    onDeleteChallenge: (id: string) => Promise<void>;
    onLogDay: (
        id: string,
        logData: {
            dayNumber: number;
            date?: string;
            status?: 'completed' | 'rest' | 'missed';
            note?: string;
            timeSpent?: string;
            imageUrl?: string;
        }
    ) => Promise<void>;
    onDeleteLog: (challengeId: string, logId: string) => Promise<void>;
}

const CATEGORY_ICONS: Record<string, any> = {
    engineering: Code,
    fitness: Dumbbell,
    learning: BookOpen,
    discipline: ClipboardCheck,
    mindfulness: Sparkles,
};

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ChallengeDetailPage: React.FC<ChallengeDetailPageProps> = ({
    challenge,
    onBack,
    onUpdateChallenge,
    onDeleteChallenge,
    onLogDay,
    onDeleteLog,
}) => {
    const [selectedDayForModal, setSelectedDayForModal] = useState<{
        dayNumber: number;
        dateStr: string;
        existingLog?: ChallengeLog | null;
    } | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);
    const [activeTabLogs, setActiveTabLogs] = useState<'all' | 'completed' | 'notes'>('all');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Calculate current elapsed days since startDate
    const { currentDayNumber, startDateObj, targetEndDateObj, completedDaysCount, successRate, remainingDays } =
        useMemo(() => {
            const start = new Date(challenge.startDate || new Date());
            const now = new Date();
            const diffTime = Math.max(0, now.getTime() - start.getTime());
            const elapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            const currentDay = Math.min(challenge.targetDays, Math.max(1, elapsed));

            const targetEnd = new Date(challenge.targetEndDate || start.getTime() + challenge.targetDays * 86400000);

            const completed = challenge.logs.filter((l) => l.status === 'completed').length;
            const rate = Math.round((completed / challenge.targetDays) * 100);
            const remaining = Math.max(0, challenge.targetDays - completed);

            return {
                currentDayNumber: currentDay,
                startDateObj: start,
                targetEndDateObj: targetEnd,
                completedDaysCount: completed,
                successRate: rate,
                remainingDays: remaining,
            };
        }, [challenge]);

    // Build the 7-row calendar grid for the total challenge duration
    const gridWeeks = useMemo(() => {
        const totalDays = challenge.targetDays;
        const weeks: {
            weekIndex: number;
            days: {
                dayNumber: number;
                date: Date;
                dateStr: string;
                dayOfWeek: number; // 0=Mon, 6=Sun
                log?: ChallengeLog;
                isToday: boolean;
                isPast: boolean;
                isFuture: boolean;
            }[];
        }[] = [];

        // Figure out starting day of week (Monday as index 0)
        const startDayOfWeek = (startDateObj.getDay() + 6) % 7;

        let currentWeekDays: any[] = [];
        let weekIndex = 1;

        // Pad first week if start day is not Monday
        for (let p = 0; p < startDayOfWeek; p++) {
            currentWeekDays.push(null);
        }

        for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
            const dayDate = new Date(startDateObj.getTime() + (dayNum - 1) * 86400000);
            const dateStr = dayDate.toISOString().split('T')[0];
            const log = challenge.logs.find((l) => Number(l.dayNumber) === dayNum);

            const isToday = dayNum === currentDayNumber;
            const isPast = dayNum < currentDayNumber;
            const isFuture = dayNum > currentDayNumber;

            currentWeekDays.push({
                dayNumber: dayNum,
                date: dayDate,
                dateStr,
                dayOfWeek: (dayDate.getDay() + 6) % 7,
                log,
                isToday,
                isPast,
                isFuture,
            });

            if (currentWeekDays.length === 7) {
                weeks.push({
                    weekIndex,
                    days: currentWeekDays,
                });
                currentWeekDays = [];
                weekIndex++;
            }
        }

        if (currentWeekDays.length > 0) {
            while (currentWeekDays.length < 7) {
                currentWeekDays.push(null);
            }
            weeks.push({
                weekIndex,
                days: currentWeekDays,
            });
        }

        return weeks;
    }, [challenge, startDateObj, currentDayNumber]);

    const CategoryIcon = CATEGORY_ICONS[challenge.category] || Code;

    // Filtered reflection logs
    const displayLogs = useMemo(() => {
        let list = [...challenge.logs];
        if (activeTabLogs === 'completed') {
            list = list.filter((l) => l.status === 'completed');
        } else if (activeTabLogs === 'notes') {
            list = list.filter((l) => l.note && l.note.trim().length > 0);
        }
        return list.sort((a, b) => Number(b.dayNumber) - Number(a.dayNumber));
    }, [challenge.logs, activeTabLogs]);

    // Today's log if present
    const todayLog = challenge.logs.find((l) => Number(l.dayNumber) === currentDayNumber);

    const handleOpenDayModal = (dayNumber: number, dateStr: string, log?: ChallengeLog) => {
        setSelectedDayForModal({
            dayNumber,
            dateStr,
            existingLog: log || null,
        });
    };

    const handleShare = () => {
        const text = `I'm on Day ${currentDayNumber} of ${challenge.targetDays} on "${challenge.title}" in Vow! #VowChallenge`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setShowShareToast(true);
            setTimeout(() => setShowShareToast(false), 3000);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-12">
            {/* Top Header Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                    onClick={onBack}
                    className="neu-button px-4 py-2 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35] flex items-center space-x-2 w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Challenges</span>
                </button>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                        onClick={handleShare}
                        className="neu-button px-3.5 py-2 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1.5"
                        title="Share Challenge Progress"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                    </button>

                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="neu-button p-2 rounded-xl text-[#717699] hover:text-[#1a1c35]"
                        title="Edit Challenge"
                    >
                        <Settings className="w-4 h-4" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="neu-button p-2 rounded-xl text-[#717699] hover:text-[#1a1c35]"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-44 neu-card p-1.5 bg-[#E0E5EC] z-30 shadow-xl rounded-xl">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsEditModalOpen(true);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg flex items-center space-x-2"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Challenge</span>
                                </button>
                                <button
                                    onClick={async () => {
                                        setIsMenuOpen(false);
                                        const newStatus = challenge.status === 'paused' ? 'active' : 'paused';
                                        await onUpdateChallenge(challenge.id || challenge._id, { status: newStatus });
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg flex items-center space-x-2"
                                >
                                    <Coffee className="w-3.5 h-3.5" />
                                    <span>{challenge.status === 'paused' ? 'Resume Sprint' : 'Pause Sprint'}</span>
                                </button>
                                <div className="my-1 border-t border-slate-300/60" />
                                <button
                                    onClick={async () => {
                                        setIsMenuOpen(false);
                                        if (window.confirm(`Delete challenge "${challenge.title}"?`)) {
                                            await onDeleteChallenge(challenge.id || challenge._id);
                                            onBack();
                                        }
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center space-x-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Challenge</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showShareToast && (
                <div className="p-3 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold text-center animate-in fade-in slide-in-from-top-2">
                    Progress summary copied to clipboard!
                </div>
            )}

            {/* Main Challenge Header Card */}
            <div className="neu-card p-6 sm:p-8 bg-[#E0E5EC]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl neu-button flex items-center justify-center text-purple-600 bg-purple-50/70 shadow-sm shrink-0">
                            <CategoryIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full neu-inset text-purple-700 bg-purple-50/50">
                                    {challenge.category || 'Engineering'}
                                </span>
                                {challenge.status === 'paused' && (
                                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full neu-inset text-amber-700 bg-amber-50">
                                        Paused
                                    </span>
                                )}
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-[#1a1c35] tracking-tight">
                                {challenge.title}
                            </h1>
                            <p className="text-xs font-semibold text-[#717699] max-w-xl">
                                {challenge.description || 'Ship code. Learn AI. Build in public.'}
                            </p>
                            <div className="flex items-center space-x-2 pt-1 text-[11px] font-bold text-[#515777]">
                                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                                <span>
                                    {startDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                                    {targetEndDateObj.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}{' '}
                                    ({challenge.targetDays} Days)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metric Stats & Check-In Action Button */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center gap-4">
                        <div className="grid grid-cols-4 gap-3 text-center">
                            <div className="neu-inset px-3 py-2 rounded-xl">
                                <span className="text-[9px] font-extrabold text-[#717699] uppercase block">Day</span>
                                <span className="text-lg font-black text-[#1a1c35]">{currentDayNumber}</span>
                                <span className="text-[9px] text-[#717699] block">of {challenge.targetDays}</span>
                            </div>

                            <div className="neu-inset px-3 py-2 rounded-xl">
                                <span className="text-[9px] font-extrabold text-[#717699] uppercase block">Completed</span>
                                <span className="text-lg font-black text-emerald-600">{completedDaysCount}</span>
                                <span className="text-[9px] text-emerald-700 block">Days</span>
                            </div>

                            <div className="neu-inset px-3 py-2 rounded-xl">
                                <span className="text-[9px] font-extrabold text-[#717699] uppercase block">Remaining</span>
                                <span className="text-lg font-black text-slate-700">{remainingDays}</span>
                                <span className="text-[9px] text-[#717699] block">Days</span>
                            </div>

                            <div className="neu-inset px-3 py-2 rounded-xl">
                                <span className="text-[9px] font-extrabold text-[#717699] uppercase block">Success Rate</span>
                                <span className="text-lg font-black text-[#1a1c35]">{successRate}%</span>
                                <span className="text-[9px] font-bold text-emerald-600 flex items-center justify-center">
                                    On Track ↗
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                handleOpenDayModal(
                                    currentDayNumber,
                                    new Date().toISOString().split('T')[0],
                                    todayLog
                                )
                            }
                            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all shrink-0 ${todayLog?.status === 'completed'
                                    ? 'neu-button bg-emerald-50 text-emerald-700 border border-emerald-300'
                                    : 'neu-button-primary text-white hover:scale-105'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span>
                                {todayLog?.status === 'completed'
                                    ? `Day ${currentDayNumber} Logged ✓`
                                    : `Log Day ${currentDayNumber} Check-In`}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Progress Matrix / Heatmap */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Contribution Heatmap Card */}
                    <div className="neu-card p-6 bg-[#E0E5EC]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-purple-600" />
                                <h3 className="text-sm font-black text-[#1a1c35]">Your Progress</h3>
                            </div>

                            {/* Legend matching Image 3 */}
                            <div className="flex items-center space-x-3 text-[11px] font-bold text-[#515777]">
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                                    <span>Completed</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-3 h-3 rounded-sm bg-purple-600 ring-2 ring-purple-400" />
                                    <span>Today</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-3 h-3 rounded-sm bg-[#8A95A5]" />
                                    <span>Missed</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-3 h-3 rounded-sm bg-[#D1D9E6] border border-slate-300/40" />
                                    <span>Upcoming</span>
                                </div>
                            </div>
                        </div>

                        {/* Matrix Heatmap Container */}
                        <div className="neu-inset p-4 rounded-2xl overflow-x-auto bg-[#E0E5EC]/80">
                            <div className="min-w-fit">
                                {/* Week Header Labels */}
                                <div className="flex ml-8 mb-2 space-x-1.5">
                                    {gridWeeks.map((week, idx) => (
                                        <div
                                            key={week.weekIndex}
                                            className="w-6 sm:w-7 text-[8px] sm:text-[9px] font-black text-[#717699] text-center uppercase tracking-tight shrink-0"
                                        >
                                            {idx === 0 || idx % 2 === 0 ? `W${week.weekIndex}` : ''}
                                        </div>
                                    ))}
                                </div>

                                {/* 7 Day Rows (Mon - Sun) */}
                                <div className="space-y-1.5">
                                    {DAYS_OF_WEEK.map((dayLabel, rowIndex) => (
                                        <div key={dayLabel} className="flex items-center space-x-1.5">
                                            <span className="w-6 text-[10px] font-extrabold text-[#717699] shrink-0">
                                                {dayLabel}
                                            </span>

                                            <div className="flex space-x-1.5">
                                                {gridWeeks.map((week) => {
                                                    const dayItem = week.days[rowIndex];
                                                    if (!dayItem) {
                                                        return <div key={`${week.weekIndex}-${rowIndex}`} className="w-6 h-6 sm:w-7 sm:h-7 opacity-0" />;
                                                    }

                                                    const isCompleted = dayItem.log?.status === 'completed';
                                                    const isRest = dayItem.log?.status === 'rest';
                                                    const isMissed = dayItem.log?.status === 'missed';
                                                    const isToday = dayItem.isToday;
                                                    const isUpcoming = dayItem.isFuture && !dayItem.log;

                                                    let bgClass = 'bg-[#D1D9E6] hover:border-purple-400';
                                                    if (isCompleted) {
                                                        bgClass = 'bg-emerald-500 text-white shadow-sm';
                                                    } else if (isRest) {
                                                        bgClass = 'bg-amber-400 text-slate-900';
                                                    } else if (isMissed) {
                                                        bgClass = 'bg-[#8A95A5] text-white';
                                                    } else if (isToday) {
                                                        bgClass = 'bg-purple-600 text-white ring-2 ring-purple-400 ring-offset-2 animate-pulse';
                                                    }

                                                    return (
                                                        <button
                                                            key={dayItem.dayNumber}
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenDayModal(
                                                                    dayItem.dayNumber,
                                                                    dayItem.dateStr,
                                                                    dayItem.log
                                                                )
                                                            }
                                                            title={`Day ${dayItem.dayNumber} (${dayItem.dateStr}): ${isCompleted
                                                                    ? `Completed${dayItem.log?.note ? ` - ${dayItem.log.note}` : ''}`
                                                                    : isRest
                                                                        ? 'Rest Day'
                                                                        : isMissed
                                                                            ? 'Missed'
                                                                            : isToday
                                                                                ? "Today's Target Day"
                                                                                : 'Upcoming Day'
                                                                }`}
                                                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[9px] sm:text-[10px] font-black flex items-center justify-center transition-all cursor-pointer hover:scale-110 shrink-0 ${bgClass}`}
                                                        >
                                                            {isToday ? (
                                                                <span className="font-extrabold">{dayItem.dayNumber}</span>
                                                            ) : isCompleted ? (
                                                                '✓'
                                                            ) : isRest ? (
                                                                '☕'
                                                            ) : (
                                                                ''
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Matrix Footer Span */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-[#717699]">
                            <span>
                                Start:{' '}
                                <strong className="text-slate-800">
                                    {startDateObj.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </strong>
                            </span>
                            <span>
                                Today:{' '}
                                <strong className="text-purple-700">
                                    {new Date().toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </strong>
                            </span>
                            <span>
                                Target End:{' '}
                                <strong className="text-slate-800">
                                    {targetEndDateObj.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </strong>
                            </span>
                        </div>
                    </div>

                    {/* Bottom Sub-cards: Challenge Rules & Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Challenge Rules */}
                        <div className="neu-card p-5 bg-[#E0E5EC] space-y-2.5">
                            <div className="flex items-center space-x-2 text-purple-700">
                                <ClipboardCheck className="w-4 h-4" />
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                    Challenge Rules
                                </h4>
                            </div>
                            <p className="text-[11px] font-bold text-[#717699]">
                                What counts as a completed day
                            </p>
                            <div className="neu-inset p-3.5 rounded-xl bg-[#E0E5EC]/90 text-xs font-medium text-slate-700 leading-relaxed">
                                {challenge.rule ||
                                    'Code for at least 1 hour and learn something new in AI or Software Engineering.'}
                            </div>
                        </div>

                        {/* Challenge Tags */}
                        <div className="neu-card p-5 bg-[#E0E5EC] space-y-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-indigo-700">
                                    <Tag className="w-4 h-4" />
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                        Challenge Tags
                                    </h4>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                                >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit</span>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {challenge.tags && challenge.tags.length > 0 ? (
                                    challenge.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 rounded-lg neu-inset text-[11px] font-bold text-slate-700 bg-white/40"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium italic">No tags</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Motivational Tip Banner */}
                    <div className="neu-card p-4 bg-[#E0E5EC] flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl neu-button flex items-center justify-center text-amber-500 bg-amber-50 shrink-0">
                                <Lightbulb className="w-4 h-4" />
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-slate-900">Consistency compounds.</h5>
                                <p className="text-[11px] text-[#717699] font-medium">
                                    Small daily actions lead to massive results over time.
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1 cursor-pointer hover:underline">
                            <span>Keep showing up</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>

                {/* Right Column: Daily Reflection Logs Feed */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="neu-card p-5 sm:p-6 bg-[#E0E5EC]">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="w-4 h-4 text-purple-600" />
                                <h3 className="text-sm font-black text-[#1a1c35]">Daily Reflection Logs</h3>
                            </div>
                            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full neu-inset text-purple-700 bg-purple-50">
                                {challenge.logs.length}
                            </span>
                        </div>

                        {/* Reflection Logs Feed */}
                        {displayLogs.length === 0 ? (
                            <div className="text-center py-10 space-y-3">
                                <div className="w-12 h-12 mx-auto rounded-2xl neu-button flex items-center justify-center text-purple-500">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-slate-700">No reflections logged yet</p>
                                <p className="text-[11px] text-[#717699]">
                                    Log your daily check-in to build a timeline of accomplishments.
                                </p>
                                <button
                                    onClick={() =>
                                        handleOpenDayModal(
                                            currentDayNumber,
                                            new Date().toISOString().split('T')[0],
                                            todayLog
                                        )
                                    }
                                    className="neu-button-primary px-4 py-2 rounded-xl text-xs font-bold text-white mt-2"
                                >
                                    Log First Reflection
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-slate-300/80">
                                {displayLogs.map((log) => {
                                    const isLogCompleted = log.status === 'completed';
                                    const isLogRest = log.status === 'rest';

                                    return (
                                        <div key={log.id} className="relative pl-8 group">
                                            {/* Timeline Dot */}
                                            <div
                                                className={`absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-[#E0E5EC] transition-transform group-hover:scale-125 ${isLogCompleted
                                                        ? 'bg-emerald-500'
                                                        : isLogRest
                                                            ? 'bg-amber-400'
                                                            : 'bg-slate-400'
                                                    }`}
                                            />

                                            <div className="neu-card p-3.5 rounded-xl bg-[#E0E5EC] hover:bg-white/40 transition-colors space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black text-slate-800">
                                                        Day {log.dayNumber}{' '}
                                                        <span className="text-[10px] font-bold text-[#717699] ml-1">
                                                            • {log.date}
                                                        </span>
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            handleOpenDayModal(log.dayNumber, log.date, log)
                                                        }
                                                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 opacity-60 hover:opacity-100"
                                                        title="Edit Log"
                                                    >
                                                        <MoreVertical className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {log.note && (
                                                    <p className="text-xs font-medium text-slate-700 leading-relaxed">
                                                        {log.note}
                                                    </p>
                                                )}

                                                {log.imageUrl && (
                                                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-200/60 max-h-32">
                                                        <img
                                                            src={log.imageUrl}
                                                            alt={`Day ${log.dayNumber} screenshot`}
                                                            className="w-full h-full object-cover"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    </div>
                                                )}

                                                {log.timeSpent && log.timeSpent !== '—' && (
                                                    <div className="flex items-center space-x-1 text-[10px] font-bold text-purple-700 w-fit px-2 py-0.5 rounded neu-inset bg-purple-50/50">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{log.timeSpent}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Log Modal */}
            {selectedDayForModal && (
                <LogChallengeDayModal
                    isOpen={true}
                    onClose={() => setSelectedDayForModal(null)}
                    dayNumber={selectedDayForModal.dayNumber}
                    dateStr={selectedDayForModal.dateStr}
                    existingLog={selectedDayForModal.existingLog}
                    onSaveLog={async (logData) => {
                        await onLogDay(challenge.id || challenge._id, logData);
                    }}
                    onDeleteLog={
                        selectedDayForModal.existingLog
                            ? async (logId) => {
                                await onDeleteLog(challenge.id || challenge._id, logId);
                            }
                            : undefined
                    }
                />
            )}

            {/* Edit Challenge Modal */}
            {isEditModalOpen && (
                <CreateChallengeModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    editingChallenge={challenge}
                    onSubmit={async (updates) => {
                        await onUpdateChallenge(challenge.id || challenge._id, updates);
                        setIsEditModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};
