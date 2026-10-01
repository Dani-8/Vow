import React, { useState, useEffect } from 'react';
import {
    X,
    CheckCircle2,
    Coffee,
    AlertCircle,
    Clock,
    Sparkles,
    Calendar,
    Timer,
} from 'lucide-react';
import { ChallengeLog } from '../../../../../types';
import { StartFocusSessionModal } from '../../../../modals/StartFocusSessionModal';
import { useFocusTimer } from '../../../../../context/FocusTimerContext';

interface LogChallengeDayModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayNumber: number;
    dateStr: string;
    existingLog?: ChallengeLog | null;
    challengeTitle?: string;
    challengeId?: string;
    onSaveLog: (logData: {
        dayNumber: number;
        date: string;
        status: 'completed' | 'rest' | 'missed';
        note: string;
        timeSpent?: string;
    }) => Promise<void>;
    onDeleteLog?: (logId: string) => Promise<void>;
}