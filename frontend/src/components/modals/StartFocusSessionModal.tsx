import React, { useState } from 'react';
import { Play, Timer, Sparkles, X, Clock, Check } from 'lucide-react';

interface StartFocusSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    onStart: (minutes: number) => void;
}

const PRESET_DURATIONS = [
    { label: '15m Sprint', minutes: 15, desc: 'Quick laser focus' },
    { label: '25m Pomodoro', minutes: 25, desc: 'Standard deep work block' },
    { label: '45m Power', minutes: 45, desc: 'Substantial milestone focus' },
    { label: '60m Deep', minutes: 60, desc: 'Extended deep dive' },
];

export const StartFocusSessionModal: React.FC<StartFocusSessionModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    onStart,
}) => {
    const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
    const [customHours, setCustomHours] = useState<string>('');
    const [customMinutes, setCustomMinutes] = useState<string>('');
    const [isCustom, setIsCustom] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        let finalMinutes = selectedMinutes;
        if (isCustom) {
            const hrs = Math.max(0, parseInt(customHours, 10) || 0);
            const mins = Math.max(0, parseInt(customMinutes, 10) || 0);
            const combined = hrs * 60 + mins;
            // Cap between 1 min and 12 hours (720 min)
            finalMinutes = Math.max(1, Math.min(720, combined || 25));
        }
        onStart(finalMinutes);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md neu-card p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-2xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full neu-button flex items-center justify-center text-[#717699] hover:text-[#1a1c35] transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl neu-button-primary flex items-center justify-center text-white">
                        <Timer className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-[#1a1c35]">Start Focus Timer</h2>
                        <p className="text-xs font-semibold text-[#717699]">
                            Locks in deep work & streams live on your Home dashboard
                        </p>
                    </div>
                </div>

                {/* Target info card */}
                <div className="neu-inset p-3.5 rounded-2xl mb-5 bg-[#E0E5EC]/80 border border-white/40">
                    <span className="text-[10px] font-black uppercase text-[#549acb] tracking-wider block">
                        Target Session
                    </span>
                    <h3 className="text-sm font-extrabold text-[#1a1c35] truncate mt-0.5">{title}</h3>
                    {subtitle && <p className="text-xs font-semibold text-[#717699] truncate">{subtitle}</p>}
                </div>
