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

    const { startSession, activeSession } = useFocusTimer();

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
