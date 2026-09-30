import React from 'react';
import { Trophy, CheckCircle2, X, Clock, ArrowRight } from 'lucide-react';
import { ActiveFocusSession } from '../../context/FocusTimerContext';

interface FocusFinishedModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: ActiveFocusSession | null;
    onCompleteTask?: (taskId: string) => void;
    onLogChallenge?: (challengeId: string, minutes: number, dayNumber?: number, dateStr?: string) => void;
}
