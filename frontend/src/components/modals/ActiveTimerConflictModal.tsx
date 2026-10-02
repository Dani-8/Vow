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

                {/* Active Session Info Box */}
                <div className="neu-inset p-3.5 rounded-2xl mb-3 bg-[#E0E5EC]/90 border border-amber-300/40">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                            Currently Running
                        </span>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-lg">
                            ~{remainingMins} min left
                        </span>
                    </div>
                    <h3 className="text-xs font-black text-[#1a1c35] truncate mt-1">
                        {activeSession.sourceTitle}
                    </h3>
                </div>

                {/* Arrow Divider */}
                <div className="flex justify-center my-1 text-[#717699]">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#E0E5EC] px-2">
                        Switching To
                    </span>
                </div>

                {/* New Target Session Box */}
                <div className="neu-inset p-3.5 rounded-2xl mb-6 bg-[#E0E5EC]/90 border border-sky-300/40">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#549acb] tracking-wider">
                            New Target
                        </span>
                        <span className="text-[11px] font-bold text-sky-800 bg-sky-200/60 px-2 py-0.5 rounded-lg">
                            {newSessionTarget.minutes} min
                        </span>
                    </div>
                    <h3 className="text-xs font-black text-[#1a1c35] truncate mt-1">
                        {newSessionTarget.sourceTitle}
                    </h3>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-200/60">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35]"
                    >
                        Keep Current Timer
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onConfirmSwitch();
                            onClose();
                        }}
                        className="w-full sm:w-auto neu-button-primary px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 text-white shadow-md hover:scale-105 transition-all bg-gradient-to-r from-amber-600 to-rose-600"
                    >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Old & Start New</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
