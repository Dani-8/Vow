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