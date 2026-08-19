import React, { useState, useMemo, useEffect } from 'react';
import {
    Target,
    Plus,
    Search,
    Filter,
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
    HelpCircle,
    Lightbulb,
    Trophy,
    CheckCircle2,
    Flame,
} from 'lucide-react';
import { Challenge } from '../../../types';
import { CreateChallengeModal } from './components/CreateChallengeModal';
import { HowChallengesWorkModal } from './components/HowChallengesWorkModal';
import { DeleteChallengeModal } from './components/DeleteChallengeModal';

interface ChallengesPageProps {
    challenges: Challenge[];
    onSelectChallenge: (challenge: Challenge) => void;
    onCreateChallenge: (challengeData: Partial<Challenge>) => Promise<void>;
    onUpdateChallenge: (id: string, updates: Partial<Challenge>) => Promise<void>;
    onDeleteChallenge: (id: string) => Promise<void>;
}

const CATEGORY_ICONS: Record<string, any> = {
    engineering: Code,
    fitness: Dumbbell,
    learning: BookOpen,
    discipline: ClipboardCheck,
    mindfulness: Sparkles,
};

const CATEGORY_THEMES: Record<
    string,
    { iconBg: string; iconColor: string; badgeColor: string; borderColor: string }
> = {
    engineering: {
        iconBg: 'bg-purple-100/70',
        iconColor: 'text-purple-600',
        badgeColor: 'text-purple-700 bg-purple-50',
        borderColor: 'border-purple-200/50',
    },
    fitness: {
        iconBg: 'bg-emerald-100/70',
        iconColor: 'text-emerald-600',
        badgeColor: 'text-emerald-700 bg-emerald-50',
        borderColor: 'border-emerald-200/50',
    },
    learning: {
        iconBg: 'bg-amber-100/70',
        iconColor: 'text-amber-600',
        badgeColor: 'text-amber-700 bg-amber-50',
        borderColor: 'border-amber-200/50',
    },
    discipline: {
        iconBg: 'bg-rose-100/70',
        iconColor: 'text-rose-600',
        badgeColor: 'text-rose-700 bg-rose-50',
        borderColor: 'border-rose-200/50',
    },
    mindfulness: {
        iconBg: 'bg-blue-100/70',
        iconColor: 'text-blue-600',
        badgeColor: 'text-blue-700 bg-blue-50',
        borderColor: 'border-blue-200/50',
    },
};

export const ChallengesPage: React.FC<ChallengesPageProps> = ({
    challenges,
    onSelectChallenge,
    onCreateChallenge,
    onUpdateChallenge,
    onDeleteChallenge,
}) => {
    const [activeFilter, setActiveFilter] = useState<'active' | 'completed' | 'paused'>('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
    const [cardMenuOpenId, setCardMenuOpenId] = useState<string | null>(null);
    const [challengeToDelete, setChallengeToDelete] = useState<Challenge | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Close card menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setCardMenuOpenId(null);
        if (cardMenuOpenId) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [cardMenuOpenId]);

    // Counts by status
    const counts = useMemo(() => {
        return {
            active: challenges.filter((c) => (c.status || 'active') === 'active').length,
            completed: challenges.filter((c) => c.status === 'completed').length,
            paused: challenges.filter((c) => c.status === 'paused').length,
        };
    }, [challenges]);

    // Filtered and searched challenges
    const filteredChallenges = useMemo(() => {
        return challenges.filter((c) => {
            const matchStatus = (c.status || 'active') === activeFilter;
            const matchSearch =
                searchQuery.trim() === '' ||
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.tags && c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
            return matchStatus && matchSearch;
        });
    }, [challenges, activeFilter, searchQuery]);

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-16">
            {/* Top Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-purple-600 bg-purple-50/70 shadow-sm shrink-0">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-[#1a1c35] tracking-tight">
                            Challenges
                        </h1>
                        <p className="text-xs font-semibold text-[#717699]">
                            Give yourself a 21, 60, 100, or custom day challenge and track your progress daily.
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsGuideModalOpen(true)}
                        className="neu-button px-3.5 py-2.5 rounded-xl font-bold text-xs text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1.5"
                        title="How Challenges Work"
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Guide</span>
                    </button>

                    <button
                        onClick={() => {
                            setEditingChallenge(null);
                            setIsCreateModalOpen(true);
                        }}
                        className="neu-button-primary px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center space-x-2 shadow-md hover:scale-105 transition-transform"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Start a Challenge</span>
                    </button>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Status Tabs */}
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <button
                        onClick={() => setActiveFilter('active')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${activeFilter === 'active'
                            ? 'neu-inset text-indigo-700 bg-indigo-50/70 font-black'
                            : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        <span>Active</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full neu-inset text-indigo-700">
                            {counts.active}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveFilter('completed')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${activeFilter === 'completed'
                            ? 'neu-inset text-emerald-700 bg-emerald-50/70 font-black'
                            : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        <span>Completed</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full neu-inset text-emerald-700">
                            {counts.completed}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveFilter('paused')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${activeFilter === 'paused'
                            ? 'neu-inset text-amber-700 bg-amber-50/70 font-black'
                            : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        <span>Paused</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full neu-inset text-amber-700">
                            {counts.paused}
                        </span>
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 text-[#717699] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search challenges or tags..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl neu-input text-xs font-medium"
                    />
                </div>
            </div>

            {/* Main Content: Empty State (Picture 1) vs Cards Grid (Picture 2) */}
            {filteredChallenges.length === 0 ? (
                <div className="space-y-6">
                    {/* Empty State Card matching Picture 1 */}
                    <div className="neu-card p-10 sm:p-14 bg-[#E0E5EC] flex flex-col items-center justify-center text-center space-y-5">
                        {/* Target Illustration with Rings */}
                        <div className="relative w-28 h-28 rounded-full neu-inset flex items-center justify-center p-3">
                            <div className="w-20 h-20 rounded-full neu-button flex items-center justify-center text-purple-600 bg-purple-50 shadow-inner">
                                <Target className="w-10 h-10 text-purple-600" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs shadow-md">
                                ✨
                            </div>
                        </div>

                        <div className="space-y-2 max-w-md">
                            <h3 className="text-lg sm:text-xl font-black text-[#1a1c35]">
                                {searchQuery ? 'No Matching Challenges' : 'No Active Challenges Yet'}
                            </h3>
                            <p className="text-xs font-semibold text-[#717699] leading-relaxed">
                                Give yourself a 21, 60, 100, or custom day challenge. Build unbreakable habits, track
                                your progress on a GitHub-style heatmap, and log your daily journey.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setEditingChallenge(null);
                                    setIsCreateModalOpen(true);
                                }}
                                className="neu-button-primary px-6 py-3 rounded-2xl font-bold text-xs text-white flex items-center space-x-2 shadow-md hover:scale-105 transition-transform"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Start Your First Challenge</span>
                            </button>

                            <button
                                onClick={() => setIsGuideModalOpen(true)}
                                className="neu-button px-4 py-3 rounded-2xl font-bold text-xs text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1.5"
                            >
                                <HelpCircle className="w-4 h-4" />
                                <span>Learn how Challenges work</span>
                            </button>
                        </div>
                    </div>

                    {/* Tip Banner matching Picture 1 */}
                    <div className="neu-card p-4 bg-[#E0E5EC] flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-xl neu-button flex items-center justify-center text-amber-500 bg-amber-50 shrink-0">
                            <Lightbulb className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900">
                                Tip: Start with a 21-day challenge to build momentum before tackling a 100-day sprint.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Challenges Grid matching Picture 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {filteredChallenges.map((challenge) => {
                            const theme = CATEGORY_THEMES[challenge.category] || CATEGORY_THEMES.engineering;
                            const IconComponent = CATEGORY_ICONS[challenge.category] || Code;

                            // Calculate current day number & upcoming status
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

                            // Calculate consecutive streak
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
                                    key={challenge.id || challenge._id}
                                    className="neu-card p-6 bg-[#E0E5EC] hover:shadow-lg transition-all duration-200 relative group flex flex-col justify-between"
                                >
                                    {/* Top Row: Category Badge & Menu */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className={`w-12 h-12 rounded-2xl neu-button flex items-center justify-center ${theme.iconBg} ${theme.iconColor} shrink-0`}
                                                >
                                                    <IconComponent className="w-6 h-6" />
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full neu-inset ${theme.badgeColor}`}
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
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCardMenuOpenId(
                                                            cardMenuOpenId === (challenge.id || challenge._id)
                                                                ? null
                                                                : challenge.id || challenge._id
                                                        );
                                                    }}
                                                    className="p-1.5 rounded-xl neu-button text-slate-400 hover:text-slate-700"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {cardMenuOpenId === (challenge.id || challenge._id) && (
                                                    <div className="absolute right-0 mt-2 w-40 neu-card p-1.5 bg-[#E0E5EC] z-30 shadow-xl rounded-xl">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCardMenuOpenId(null);
                                                                setEditingChallenge(challenge);
                                                                setIsCreateModalOpen(true);
                                                            }}
                                                            className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg flex items-center space-x-2"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                setCardMenuOpenId(null);
                                                                const newStatus =
                                                                    challenge.status === 'paused' ? 'active' : 'paused';
                                                                await onUpdateChallenge(challenge.id || challenge._id, {
                                                                    status: newStatus,
                                                                });
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
                                                                setCardMenuOpenId(null);
                                                                setChallengeToDelete(challenge);
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
                                        <div
                                            onClick={() => onSelectChallenge(challenge)}
                                            className="cursor-pointer space-y-1 group-hover:text-indigo-900"
                                        >
                                            <h3 className="text-base sm:text-lg font-black text-[#1a1c35] tracking-tight leading-snug">
                                                {challenge.title}
                                            </h3>
                                            <p className="text-xs font-medium text-[#717699] line-clamp-2">
                                                {challenge.description || 'Ship code. Learn AI. Build in public.'}
                                            </p>
                                        </div>

                                        {/* Date Span */}
                                        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#717699] mt-3">
                                            <Calendar className="w-3.5 h-3.5 text-purple-500" />
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
                                    <div
                                        onClick={() => onSelectChallenge(challenge)}
                                        className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className="w-7 h-7 rounded-lg neu-inset flex items-center justify-center text-purple-600 font-extrabold text-[10px]">
                                                {challenge.targetDays}
                                            </div>
                                            <div className="text-xs font-bold text-slate-800">
                                                <span>{challenge.targetDays} Days Challenge</span>
                                                <span className="text-[10px] text-purple-700 font-extrabold block">
                                                    {isUpcoming
                                                        ? `Starts in ${daysUntilStart} ${daysUntilStart === 1 ? 'day' : 'days'}`
                                                        : `Day ${currentDay} Today (${completedDays} logged)`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-slate-500 group-hover:text-purple-600 group-hover:scale-110 transition-transform">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Motivational Trophy Banner matching Picture 2 */}
                    <div className="neu-card p-5 bg-[#E0E5EC] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5 text-center sm:text-left">
                            <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-amber-500 bg-amber-50/80 shadow-sm shrink-0">
                                <Trophy className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                                    Every day you show up is a vote for the person you&apos;re becoming.
                                </h4>
                                <p className="text-[11px] font-semibold text-[#717699]">
                                    Micro-wins compound into monumental transformations.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsGuideModalOpen(true)}
                            className="neu-button px-4 py-2 rounded-xl text-xs font-bold text-purple-700 hover:text-purple-900 shrink-0 flex items-center space-x-1.5"
                        >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>How Challenges work</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Create / Edit Challenge Modal */}
            {isCreateModalOpen && (
                <CreateChallengeModal
                    isOpen={isCreateModalOpen}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        setEditingChallenge(null);
                    }}
                    editingChallenge={editingChallenge}
                    onSubmit={async (challengeData) => {
                        if (editingChallenge) {
                            await onUpdateChallenge(
                                editingChallenge.id || editingChallenge._id,
                                challengeData
                            );
                        } else {
                            await onCreateChallenge(challengeData);
                        }
                    }}
                />
            )}

            {/* Guide Modal */}
            <HowChallengesWorkModal
                isOpen={isGuideModalOpen}
                onClose={() => setIsGuideModalOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            {challengeToDelete && (
                <DeleteChallengeModal
                    isOpen={!!challengeToDelete}
                    onClose={() => setChallengeToDelete(null)}
                    challengeTitle={challengeToDelete.title}
                    isDeleting={isDeleting}
                    onConfirm={async () => {
                        try {
                            setIsDeleting(true);
                            await onDeleteChallenge(challengeToDelete.id || challengeToDelete._id);
                            setChallengeToDelete(null);
                        } finally {
                            setIsDeleting(false);
                        }
                    }}
                />
            )}
        </div>
    );
};
