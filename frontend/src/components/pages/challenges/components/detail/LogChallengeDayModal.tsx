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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="neu-card w-full max-w-lg p-6 sm:p-7 bg-[#E0E5EC] relative my-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
                    title="Close log modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-between mb-5 pr-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-purple-600 bg-purple-50 shrink-0">
                            <span className="text-base font-black">#{dayNumber}</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-[#1a1c35]">
                                Log Day {dayNumber} Check-In
                            </h2>
                            <p className="text-xs font-semibold text-[#717699] flex items-center space-x-1">
                                <Calendar className="w-3.5 h-3.5 inline" />
                                <span>{dateStr}</span>
                            </p>
                        </div>
                    </div>

                    {/* Quick Focus Button in Log Modal */}
                    {challengeId && (
                        <button
                            type="button"
                            onClick={() => setIsFocusModalOpen(true)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                                isThisChallengeActive
                                    ? 'neu-button text-emerald-700 bg-emerald-50 border border-emerald-300'
                                    : 'neu-button text-[#549acb] hover:bg-white/60'
                            }`}
                            title="Start Focus Session for today's log"
                        >
                            <Timer className={`w-3.5 h-3.5 ${isThisChallengeActive ? 'text-emerald-600 animate-spin-slow' : 'text-[#549acb]'}`} />
                            <span className="hidden sm:inline">
                                {isThisChallengeActive ? 'Timer Active' : 'Start Focus'}
                            </span>
                        </button>
                    )}
                </div>

