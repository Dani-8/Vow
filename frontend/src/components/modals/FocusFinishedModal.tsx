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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md neu-card p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-2xl relative text-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full neu-button flex items-center justify-center text-[#717699] hover:text-[#1a1c35] transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Trophy & Badge */}
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 neu-card flex items-center justify-center text-amber-500 mb-4 border border-amber-200/60 shadow-md">
                    <Trophy className="w-8 h-8" />
                </div>

                <span className="text-[11px] font-black uppercase text-[#549acb] tracking-wider block">
                    Session Completed
                </span>

                <h2 className="text-xl font-black text-[#1a1c35] mt-1 mb-2">Great Work! Focus Finished</h2>

                <p className="text-xs font-semibold text-[#717699] mb-4">
                    You logged <span className="font-extrabold text-[#1a1c35]">{durationMins} minutes</span> of uninterrupted deep focus.
                </p>

                {/* Target Session Box */}
                <div className="neu-inset p-4 rounded-2xl mb-6 bg-[#E0E5EC]/90 text-left border border-white/60">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-[#717699] mb-1">
                        <Clock className="w-3 h-3 text-[#549acb]" />
                        <span>{session.sourceType === 'task' ? 'Completed Task Session' : 'Challenge Daily Sprint'}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-[#1a1c35] truncate">{session.sourceTitle}</h3>
                    {session.sourceSubtitle && (
                        <p className="text-xs font-semibold text-[#717699] truncate mt-0.5">{session.sourceSubtitle}</p>
                    )}
                </div>

                {/* Action CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35]"
                    >
                        Dismiss
                    </button>

                    <button
                        type="button"
                        onClick={handleAction}
                        className="w-full sm:w-auto neu-button-primary px-6 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 text-white shadow-md hover:scale-105 transition-all"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                            {session.sourceType === 'task' ? 'Mark Task as Completed' : 'Save to Challenge Log'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
