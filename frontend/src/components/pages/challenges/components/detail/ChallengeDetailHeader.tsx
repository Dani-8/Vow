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
