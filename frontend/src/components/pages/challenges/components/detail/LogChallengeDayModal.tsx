import React, { useState, useEffect } from 'react';
import {
    X,
    CheckCircle2,
    Coffee,
    AlertCircle,
    Clock,
    Sparkles,
    Camera,
    Calendar,
} from 'lucide-react';
import { ChallengeLog } from '../../../../types';

interface LogChallengeDayModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayNumber: number;
    dateStr: string;
    existingLog?: ChallengeLog | null;
    onSaveLog: (logData: {
        dayNumber: number;
        date: string;
        status: 'completed' | 'rest' | 'missed';
        note: string;
        timeSpent?: string;
        imageUrl?: string;
    }) => Promise<void>;
    onDeleteLog?: (logId: string) => Promise<void>;
}

export const LogChallengeDayModal: React.FC<LogChallengeDayModalProps> = ({
    isOpen,
    onClose,
    dayNumber,
    dateStr,
    existingLog,
    onSaveLog,
    onDeleteLog,
}) => {
    const [status, setStatus] = useState<'completed' | 'rest' | 'missed'>('completed');
    const [note, setNote] = useState('');
    const [timeSpent, setTimeSpent] = useState('1h 30m');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (existingLog) {
            setStatus(existingLog.status || 'completed');
            setNote(existingLog.note || '');
            setTimeSpent(existingLog.timeSpent || '1h 30m');
            setImageUrl(existingLog.imageUrl || '');
        } else {
            setStatus('completed');
            setNote('');
            setTimeSpent('1h 00m');
            setImageUrl('');
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
                imageUrl: imageUrl.trim(),
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save daily log');
        } finally {
            setIsSubmitting(false);
        }
    };

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

                <div className="flex items-center space-x-3 mb-5">
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

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Day Status */}
                    <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                            Day Status
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setStatus('completed')}
                                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${status === 'completed'
                                    ? 'neu-inset text-emerald-700 bg-emerald-50/70 border border-emerald-300'
                                    : 'neu-button text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Completed</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatus('rest')}
                                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${status === 'rest'
                                    ? 'neu-inset text-amber-700 bg-amber-50/70 border border-amber-300'
                                    : 'neu-button text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Rest Day</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatus('missed')}
                                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${status === 'missed'
                                    ? 'neu-inset text-rose-700 bg-rose-50/70 border border-rose-300'
                                    : 'neu-button text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                <span>Missed</span>
                            </button>
                        </div>
                    </div>

                    {/* Reflection Note */}
                    <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                            Micro-Reflection / Work Log
                        </label>
                        <textarea
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. Built RAG pipeline with Gemini API and vector DB."
                            className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-medium resize-none"
                        />
                    </div>

                    {/* Time spent */}
                    {status === 'completed' && (
                        <div>
                            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                                Time Spent
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={timeSpent}
                                    onChange={(e) => setTimeSpent(e.target.value)}
                                    placeholder="e.g. 1h 45m"
                                    className="w-full px-4 py-2 rounded-xl neu-input text-xs font-bold"
                                />
                                <div className="flex space-x-1">
                                    {['30m', '1h', '1h 30m', '2h', '3h'].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setTimeSpent(t)}
                                            className="px-2 py-1 rounded-lg text-[10px] font-bold neu-button text-slate-600 hover:text-indigo-600"
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Image URL / Screenshot */}
                    <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                            Image / Screenshot Proof (Optional URL)
                        </label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/... or screenshot URL"
                            className="w-full px-4 py-2 rounded-xl neu-input text-xs font-medium"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                        {existingLog && onDeleteLog ? (
                            <button
                                type="button"
                                onClick={async () => {
                                    if (window.confirm('Delete this day log?')) {
                                        await onDeleteLog(existingLog.id);
                                        onClose();
                                    }
                                }}
                                className="px-3 py-2 rounded-xl neu-button text-xs font-bold text-rose-600 hover:bg-rose-50"
                            >
                                Delete Log
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl neu-button text-xs font-bold text-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2 rounded-xl neu-button-primary text-xs font-bold text-white shadow-md disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Check-In'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
