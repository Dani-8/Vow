import React, { useState } from 'react';
import { Play, Timer, Sparkles, X, Clock } from 'lucide-react';

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
    const [customMinutes, setCustomMinutes] = useState<string>('');
    const [isCustom, setIsCustom] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        const finalMinutes = isCustom ? Math.max(1, Math.min(180, parseInt(customMinutes, 10) || 25)) : selectedMinutes;
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

                {/* Presets */}
                <div className="space-y-2 mb-4">
                    <label className="text-xs font-bold text-[#515777] block">Choose Duration</label>
                    <div className="grid grid-cols-2 gap-2.5">
                        {PRESET_DURATIONS.map((preset) => {
                            const isSelected = !isCustom && selectedMinutes === preset.minutes;
                            return (
                                <button
                                    key={preset.minutes}
                                    type="button"
                                    onClick={() => {
                                        setIsCustom(false);
                                        setSelectedMinutes(preset.minutes);
                                    }}
                                    className={`p-3 rounded-2xl text-left transition-all ${isSelected
                                        ? 'neu-button border-2 border-[#549acb] bg-sky-50/60 shadow-md'
                                        : 'neu-card bg-[#E0E5EC] hover:bg-[#D8DEE8]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-[#1a1c35]">{preset.label}</span>
                                        <Clock className="w-3.5 h-3.5 text-[#549acb]" />
                                    </div>
                                    <span className="text-[10px] font-semibold text-[#717699] block mt-0.5">
                                        {preset.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Custom Minutes Toggle */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => setIsCustom(!isCustom)}
                        className="text-xs font-bold text-[#549acb] hover:underline flex items-center space-x-1"
                    >
                        <span>{isCustom ? '← Back to presets' : '+ Or set custom minutes'}</span>
                    </button>

                    {isCustom && (
                        <div className="mt-2 flex items-center space-x-2">
                            <input
                                type="number"
                                min={1}
                                max={180}
                                placeholder="Minutes (e.g. 35)"
                                value={customMinutes}
                                onChange={(e) => setCustomMinutes(e.target.value)}
                                className="flex-1 neu-inset px-4 py-2.5 rounded-xl text-xs font-bold text-[#1a1c35] placeholder:text-[#94a3b8] focus:outline-none focus:ring-1 focus:ring-[#549acb]"
                            />
                            <span className="text-xs font-bold text-[#717699]">mins</span>
                        </div>
                    )}
                </div>
