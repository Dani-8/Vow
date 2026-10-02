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

export const LogChallengeDayModal: React.FC<LogChallengeDayModalProps> = ({
    isOpen,
    onClose,
    dayNumber,
    dateStr,
    existingLog,
    challengeTitle,
    challengeId,
    onSaveLog,
    onDeleteLog,
}) => {
    const [status, setStatus] = useState<'completed' | 'rest' | 'missed'>('completed');
    const [note, setNote] = useState('');
    const [timeSpent, setTimeSpent] = useState('1h 30m');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

    const { requestStartSession, activeSession } = useFocusTimer();

    useEffect(() => {
        if (existingLog) {
            setStatus(existingLog.status || 'completed');
            setNote(existingLog.note || '');
            setTimeSpent(existingLog.timeSpent || '1h 30m');
        } else {
            setStatus('completed');
            setNote('');
            setTimeSpent('1h 00m');
        }
        setError(null);
    }, [existingLog, isOpen, dayNumber]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);
            await onSaveLog({
                dayNumber,
                date: dateStr,
                status,
                note: note.trim(),
                timeSpent: status === 'completed' ? timeSpent : '—',
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save daily log');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isThisChallengeActive =
        activeSession?.sourceType === 'challenge' &&
        activeSession.sourceId === challengeId &&
        activeSession.dayNumber === dayNumber;
