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

                {/* Presets Grid */}
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
                                    className={`p-3 rounded-2xl text-left transition-all relative ${isSelected
                                        ? 'neu-button border-2 border-[#549acb] bg-sky-50/80 shadow-[inset_2px_2px_5px_rgba(84,154,203,0.15),4px_4px_10px_rgba(163,177,198,0.5)] ring-2 ring-[#549acb]/30'
                                        : 'neu-card bg-[#E0E5EC] hover:bg-[#D8DEE8] border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-black ${isSelected ? 'text-[#549acb]' : 'text-[#1a1c35]'}`}>
                                            {preset.label}
                                        </span>
                                        {isSelected ? (
                                            <div className="w-4 h-4 rounded-full bg-[#549acb] flex items-center justify-center text-white">
                                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                            </div>
                                        ) : (
                                            <Clock className="w-3.5 h-3.5 text-[#717699]" />
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-semibold block mt-0.5 ${isSelected ? 'text-sky-800' : 'text-[#717699]'}`}>
                                        {preset.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Custom Time Toggle (Hours + Minutes) */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => setIsCustom(!isCustom)}
                        className={`text-xs font-bold flex items-center space-x-1 ${isCustom ? 'text-[#549acb] font-black' : 'text-[#717699] hover:text-[#549acb]'}`}
                    >
                        <span>{isCustom ? '← Back to quick presets' : '+ Or enter custom hours & minutes'}</span>
                    </button>

                    {isCustom && (
                        <div className="mt-3 p-3.5 rounded-2xl neu-inset bg-[#E0E5EC]/80 border border-sky-300/50 space-y-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#549acb] block">
                                Set Custom Time
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Hours input */}
                                <div>
                                    <label className="text-[11px] font-bold text-[#515777] block mb-1">
                                        Hours
                                    </label>
                                    <div className="flex items-center space-x-1.5">
                                        <input
                                            type="number"
                                            min={0}
                                            max={12}
                                            placeholder="0"
                                            value={customHours}
                                            onChange={(e) => setCustomHours(e.target.value)}
                                            className="w-full neu-card px-3 py-2 rounded-xl text-xs font-bold text-[#1a1c35] text-center focus:outline-none focus:ring-2 focus:ring-[#549acb] border border-white/60"
                                            autoFocus
                                        />
                                        <span className="text-xs font-bold text-[#717699]">hrs</span>
                                    </div>
                                </div>

                                {/* Minutes input */}
                                <div>
                                    <label className="text-[11px] font-bold text-[#515777] block mb-1">
                                        Minutes
                                    </label>
                                    <div className="flex items-center space-x-1.5">
                                        <input
                                            type="number"
                                            min={0}
                                            max={59}
                                            placeholder="30"
                                            value={customMinutes}
                                            onChange={(e) => setCustomMinutes(e.target.value)}
                                            className="w-full neu-card px-3 py-2 rounded-xl text-xs font-bold text-[#1a1c35] text-center focus:outline-none focus:ring-2 focus:ring-[#549acb] border border-white/60"
                                        />
                                        <span className="text-xs font-bold text-[#717699]">mins</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-[#717699] text-center pt-1">
                                Total duration:{' '}
                                <strong className="text-[#1a1c35]">
                                    {(parseInt(customHours, 10) || 0) * 60 + (parseInt(customMinutes, 10) || 0)} minutes
                                </strong>
                            </p>
                        </div>
                    )}
                </div>
