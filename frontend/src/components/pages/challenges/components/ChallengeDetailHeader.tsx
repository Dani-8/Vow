import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Share2,
    MoreVertical,
    Calendar,
    Clock,
    Flame,
    Edit3,
    Trash2,
    Coffee,
    Code,
    Dumbbell,
    BookOpen,
    ClipboardCheck,
    Sparkles,
} from 'lucide-react';
import { Challenge } from '../../../../types';

interface ChallengeDetailHeaderProps {
    challenge: Challenge;
    accentColor: string;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onTogglePause: () => void;
    onCheckIn: () => void;
    isUpcoming: boolean;
    daysUntilStart: number;
    currentDayNumber: number;
    completedDaysCount: number;
    streak: number;
    remainingDays: number;
    successRate: number;
    startDateObj: Date;
    targetEndDateObj: Date;
    isTodayCompleted: boolean;
}

const CATEGORY_ICONS: Record<string, any> = {
    engineering: Code,
    fitness: Dumbbell,
    learning: BookOpen,
    discipline: ClipboardCheck,
    mindfulness: Sparkles,
};

export const ChallengeDetailHeader: React.FC<ChallengeDetailHeaderProps> = ({
    challenge,
    accentColor,
    onBack,
    onEdit,
    onDelete,
    onTogglePause,
    onCheckIn,
    isUpcoming,
    daysUntilStart,
    currentDayNumber,
    completedDaysCount,
    streak,
    remainingDays,
    successRate,
    startDateObj,
    targetEndDateObj,
    isTodayCompleted,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);

    useEffect(() => {
        const handleClickOutside = () => setIsMenuOpen(false);
        if (isMenuOpen) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    const handleShare = () => {
        const text = `I'm on Day ${currentDayNumber} of ${challenge.targetDays} on "${challenge.title}" in Vow! #VowChallenge`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setShowShareToast(true);
            setTimeout(() => setShowShareToast(false), 3000);
        }
    };

    const CategoryIcon = CATEGORY_ICONS[challenge.category] || Code;

    return (
        <div className="space-y-4">
            {/* Navigation & Action Buttons */}
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

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen((prev) => !prev);
                            }}
                            className="neu-button p-2 rounded-xl text-[#717699] hover:text-[#1a1c35]"
                            title="More Options"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 mt-2 w-44 neu-card p-1.5 bg-[#E0E5EC] z-30 shadow-xl rounded-xl"
                            >
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onEdit();
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg flex items-center space-x-2"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Challenge</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onTogglePause();
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg flex items-center space-x-2"
                                >
                                    <Coffee className="w-3.5 h-3.5" />
                                    <span>{challenge.status === 'paused' ? 'Resume Sprint' : 'Pause Sprint'}</span>
                                </button>
                                <div className="my-1 border-t border-slate-300/60" />
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onDelete();
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

            {/* Main Header Banner Card */}
            <div className="neu-card p-6 sm:p-8 bg-[#E0E5EC]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start space-x-4">
                        <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl neu-button flex items-center justify-center shadow-sm shrink-0"
                            style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
                        >
                            <CategoryIcon className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: accentColor }} />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center space-x-2">
                                <span
                                    className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full neu-inset"
                                    style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
                                >
                                    {challenge.category || 'Engineering'}
                                </span>
                                {isUpcoming ? (
                                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full neu-inset text-indigo-700 bg-indigo-50">
                                        Upcoming • Starts in {daysUntilStart} {daysUntilStart === 1 ? 'day' : 'days'}
                                    </span>
                                ) : challenge.status === 'paused' ? (
                                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full neu-inset text-amber-700 bg-amber-50">
                                        Paused
                                    </span>
                                ) : null}
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-[#1a1c35] tracking-tight">
                                {challenge.title}
                            </h1>
                            <p className="text-xs font-semibold text-[#717699] max-w-xl">
                                {challenge.description || 'Ship code. Learn AI. Build in public.'}
                            </p>
                            <div className="flex items-center space-x-2 pt-1 text-[11px] font-bold text-[#515777]">
                                <Calendar className="w-3.5 h-3.5" style={{ color: accentColor }} />
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

                    {/* Stats Metric Strip + Action Button */}
                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-end xl:items-center gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 text-center">
                            <div className="neu-inset px-3 py-2 rounded-xl">
                                <span className="text-[9px] font-extrabold text-[#717699] uppercase block">Day</span>
                                <span className="text-lg font-black text-[#1a1c35]">
                                    {isUpcoming ? '—' : `#${currentDayNumber}`}
                                </span>
                                <span className="text-[9px] text-[#717699] block font-semibold">
                                    {isUpcoming ? `In ${daysUntilStart}d` : `of ${challenge.targetDays}`}
                                </span>
                            </div>

                            <div className="neu-inset px-3 py-2 rounded-xl">
                                <span className="text-[9px] font-extrabold text-[#717699] uppercase block">Completed</span>
                                <span className="text-lg font-black text-emerald-600">{completedDaysCount}</span>
                                <span className="text-[9px] text-emerald-700 block font-semibold">Days</span>
                            </div>

                            <div className="neu-inset px-3 py-2 rounded-xl bg-amber-50/30">
                                <span className="text-[9px] font-extrabold text-amber-700 uppercase flex items-center justify-center space-x-0.5">
                                    <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                    <span>Streak</span>
                                </span>
                                <span className="text-lg font-black text-amber-600">{streak}</span>
                                <span className="text-[9px] text-amber-700 block font-semibold">Days</span>
                            </div>

                            <div className="neu-inset px-3 py-2 rounded-xl">
                                <span className="text-[9px] font-extrabold text-[#717699] uppercase block">Remaining</span>
                                <span className="text-lg font-black text-slate-700">{remainingDays}</span>
                                <span className="text-[9px] text-[#717699] block font-semibold">Days</span>
                            </div>

                            <div className="neu-inset px-3 py-2 rounded-xl col-span-2 sm:col-span-1">
                                <span className="text-[9px] font-extrabold text-[#717699] uppercase block">Success Rate</span>
                                <span className="text-lg font-black text-[#1a1c35]">{successRate}%</span>
                                <span className="text-[9px] font-bold text-emerald-600 flex items-center justify-center">
                                    {isUpcoming ? 'Ready' : 'On Track ↗'}
                                </span>
                            </div>
                        </div>

                        {isUpcoming ? (
                            <button
                                onClick={onCheckIn}
                                className="px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 neu-button text-indigo-700 bg-indigo-50/60 hover:bg-indigo-50 shadow-sm transition-all shrink-0"
                            >
                                <Clock className="w-4 h-4 text-indigo-600" />
                                <span>Starts in {daysUntilStart} {daysUntilStart === 1 ? 'Day' : 'Days'}</span>
                            </button>
                        ) : (
                            <button
                                onClick={onCheckIn}
                                className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all shrink-0 ${
                                    isTodayCompleted
                                        ? 'neu-button bg-emerald-50 text-emerald-700 border border-emerald-300'
                                        : 'neu-button-primary text-white hover:scale-105'
                                }`}
                            >
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {isTodayCompleted
                                        ? `Day ${currentDayNumber} Logged ✓`
                                        : `Log Day ${currentDayNumber} Check-In`}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
