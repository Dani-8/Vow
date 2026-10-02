import React from 'react';
import { AlertTriangle, X, Play, Clock, ArrowRight } from 'lucide-react';
import { ActiveFocusSession } from '../../context/FocusTimerContext';

interface ActiveTimerConflictModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeSession: ActiveFocusSession | null;
    newSessionTarget: {
        sourceType: 'task' | 'challenge';
        sourceId: string;
        sourceTitle: string;
        minutes: number;
    } | null;
    onConfirmSwitch: () => void;
}

export const ActiveTimerConflictModal: React.FC<ActiveTimerConflictModalProps> = ({
    isOpen,
    onClose,
    activeSession,
    newSessionTarget,
    onConfirmSwitch,
}) => {
    if (!isOpen || !activeSession || !newSessionTarget) return null;

    const remainingMins = Math.ceil(activeSession.remainingSeconds / 60);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md neu-card p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-2xl relative text-left">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full neu-button flex items-center justify-center text-[#717699] hover:text-[#1a1c35] transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Warning Icon & Heading */}
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 neu-card flex items-center justify-center text-amber-600 border border-amber-200/60 shadow-sm shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-[#1a1c35]">Focus Session Already Active</h2>
                        <p className="text-xs font-semibold text-[#717699]">
                            You currently have another timer running
                        </p>
                    </div>
                </div>
