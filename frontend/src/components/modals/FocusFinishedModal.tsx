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

export const FocusFinishedModal: React.FC<FocusFinishedModalProps> = ({
    isOpen,
    onClose,
    session,
    onCompleteTask,
    onLogChallenge,
}) => {
    if (!isOpen || !session) return null;

    const durationMins = Math.round(session.totalSeconds / 60);

    const handleAction = () => {
        if (session.sourceType === 'task' && onCompleteTask) {
            onCompleteTask(session.sourceId);
        } else if (session.sourceType === 'challenge' && onLogChallenge) {
            onLogChallenge(session.sourceId, durationMins, session.dayNumber, session.dateStr);
        }
        onClose();
    };