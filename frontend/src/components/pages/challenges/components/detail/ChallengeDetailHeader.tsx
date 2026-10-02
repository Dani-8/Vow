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
    Target,
    Timer,
} from 'lucide-react';
import { Challenge } from '../../../../../types';
import { getCategoryIconComponent } from '../../../../common/categoryIcons';
import { StartFocusSessionModal } from '../../../../modals/StartFocusSessionModal';
import { useFocusTimer } from '../../../../../context/FocusTimerContext';

interface ChallengeDetailHeaderProps {
    challenge: Challenge;
    accentColor: string;
    phaseTargetDays?: number;
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

export const ChallengeDetailHeader: React.FC<ChallengeDetailHeaderProps> = ({
    challenge,
    accentColor,
    phaseTargetDays,
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
    const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

    const { requestStartSession, activeSession } = useFocusTimer();

    const isThisChallengeActive =
        activeSession?.sourceType === 'challenge' &&
        activeSession.sourceId === (challenge._id || challenge.id);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showShareToast) {
            timer = setTimeout(() => setShowShareToast(false), 3000);
        }
        return () => clearTimeout(timer);
    }, [showShareToast]);

    const activeDays = phaseTargetDays || challenge.targetDays;
    const CategoryIcon = getCategoryIconComponent(challenge.category || 'Focus');

    const handleShare = () => {
        const shareText = `🔥 Day ${currentDayNumber} on my "${challenge.title}" challenge! Streak: ${streak} days, ${completedDaysCount} days completed. Keep grinding!`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            setShowShareToast(true);
        }
    };

    return (
        <div className="space-y-4">
            {/* Top Navigation Row: Back Button & Actions */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="neu-button px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-[#54597d] hover:text-[#1a1c35] flex items-center space-x-2 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" style={{ color: accentColor }} />
                    <span>Back to Challenges</span>
                </button>

                <div className="flex items-center space-x-2">
                    {/* Share Progress Button */}
                    <button
                        onClick={handleShare}
                        className="neu-button p-2.5 rounded-2xl text-[#717699] hover:text-[#1a1c35] transition-all flex items-center space-x-1.5"
                        title="Share your progress"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs font-bold hidden sm:inline">Share</span>
                    </button>

                    {/* 3-Dot More Actions Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="neu-button p-2.5 rounded-2xl text-[#717699] hover:text-[#1a1c35] transition-all"
                            title="More options"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#E0E5EC] border border-white/60 shadow-xl p-2 z-30 animate-in fade-in zoom-in-95 duration-150"
                            >
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsFocusModalOpen(true);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#1a1c35] hover:bg-white rounded-lg flex items-center space-x-2"
                                >
                                    <Timer className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Start Focus Timer</span>
                                </button>
                                <div className="my-1 border-t border-slate-300/60" />
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
                    {/* Left Side: Challenge Info & Category */}
                    <div className="flex items-start space-x-4">
                        <div
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl neu-button flex items-center justify-center shrink-0 shadow-md"
                            style={{ color: accentColor }}
                        >
                            <CategoryIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>

                        <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider neu-inset"
                                    style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
                                >
                                    {challenge.category || 'General'}
                                </span>
                                {challenge.status === 'paused' && (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-300">
                                        Sprint Paused
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1c35] tracking-tight leading-tight">
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
                                    ({activeDays} Days)
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
                                    {isUpcoming ? `In ${daysUntilStart}d` : `of ${activeDays}`}
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

                        {/* Focus & Check-in Buttons */}
                        <div className="flex items-center space-x-2 shrink-0">
                            {/* Focus Button */}
                            {!isUpcoming && (
                                <button
                                    onClick={() => setIsFocusModalOpen(true)}
                                    className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm ${isThisChallengeActive
                                            ? 'neu-button bg-emerald-50 text-emerald-700 border border-emerald-300'
                                            : 'neu-button text-[#549acb] hover:bg-white/60'
                                        }`}
                                    title="Start Focus Timer for this sprint"
                                >
                                    <Timer className={`w-4 h-4 ${isThisChallengeActive ? 'text-emerald-600 animate-spin-slow' : 'text-[#549acb]'}`} />
                                    <span className="hidden sm:inline">
                                        {isThisChallengeActive ? 'Focusing' : 'Focus'}
                                    </span>
                                </button>
                            )}

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
                                    className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all shrink-0 ${isTodayCompleted
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
