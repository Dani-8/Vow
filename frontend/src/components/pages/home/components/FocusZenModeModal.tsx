import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Minimize2, Sparkles } from 'lucide-react';
import { useFocusTimer } from '../../../../context/FocusTimerContext';
import { AmbientZenBackground, ZEN_PALETTE } from './AmbientZenBackground';

interface FocusZenModeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FocusZenModeModal: React.FC<FocusZenModeModalProps> = ({ isOpen, onClose }) => {
    const {
        activeSession,
        togglePlayPause,
        resetSession,
        completeSessionEarly,
    } = useFocusTimer();

    // Two cross-fading color layers so the glow blends buttery smooth
    const [currentColors, setCurrentColors] = useState<{ c1: string; c2: string }>({
        c1: '#549acb',
        c2: '#df7fac',
    });
    const [nextColors, setNextColors] = useState<{ c1: string; c2: string }>({
        c1: '#ec9372',
        c2: '#10b981',
    });
    const [fadeToNext, setFadeToNext] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        // Interval to trigger crossfade every 5 seconds
        const timer = setInterval(() => {
            // Pick two distinct fresh colors from palette
            const c1 = ZEN_PALETTE[Math.floor(Math.random() * ZEN_PALETTE.length)];
            let c2 = ZEN_PALETTE[Math.floor(Math.random() * ZEN_PALETTE.length)];
            if (c2 === c1) {
                c2 = ZEN_PALETTE[(ZEN_PALETTE.indexOf(c1) + 2) % ZEN_PALETTE.length];
            }

            setFadeToNext((prev) => {
                if (!prev) {
                    // Start fading to next
                    setNextColors({ c1, c2 });
                    return true;
                } else {
                    // Next is fully visible, now update current and fade back
                    setCurrentColors({ c1, c2 });
                    return false;
                }
            });
        }, 3200);

        return () => clearInterval(timer);
    }, [isOpen]);

    // Keyboard shortcuts: Esc to close, Space to toggle play/pause
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            } else if (e.code === 'Space') {
                e.preventDefault();
                togglePlayPause();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, togglePlayPause]);

    if (!isOpen || !activeSession) return null;

    const timerMinutes = Math.floor(activeSession.remainingSeconds / 60);
    const timerSeconds = activeSession.remainingSeconds % 60;
    const formattedTimer = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;

    const progressPercent = activeSession.totalSeconds > 0
        ? ((activeSession.totalSeconds - activeSession.remainingSeconds) / activeSession.totalSeconds) * 100
        : 0;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Zen Focus Mode"
            className="fixed inset-0 z-[100] flex flex-col justify-between p-4 sm:p-8 md:p-10 overflow-hidden bg-[#E0E5EC] select-none animate-in fade-in duration-300"
        >
            {/* AMBIENT GLOWING AURORA LIGHT ORBS (Free random movement, spaced zones, random timing) */}
            <AmbientZenBackground />

            {/* TOP BAR: Pushed totally to left and right corners */}
            <header className="w-full flex items-center justify-between z-10 px-2 sm:px-4">
                {/* Left: Zen Focus info pill */}
                <div className="flex items-center space-x-3 neu-inset px-4 py-2.5 rounded-2xl bg-[#E0E5EC]/85 backdrop-blur-md border border-white/60 shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#549acb] block">
                            Zen Focus • {activeSession.sourceType === 'task' ? 'Task Block' : 'Challenge Sprint'}
                        </span>
                        <h2 className="text-xs sm:text-sm font-black text-[#1a1c35] truncate max-w-[190px] sm:max-w-md lg:max-w-xl">
                            {activeSession.sourceTitle}
                        </h2>
                    </div>
                </div>

                {/* Right: Shortcut indicators & Exit Zen button completely aligned to right */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="hidden md:flex items-center space-x-1.5 neu-inset px-3.5 py-2 rounded-2xl text-[10px] font-bold text-[#717699] bg-[#E0E5EC]/85 backdrop-blur-md border border-white/60">
                        <span>Press</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-white/80 text-[#1a1c35] font-mono font-bold shadow-xs">Space</kbd>
                        <span>to pause •</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-white/80 text-[#1a1c35] font-mono font-bold shadow-xs">Esc</kbd>
                        <span>to exit</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="neu-button px-4 py-2.5 rounded-2xl text-xs font-black text-[#515777] hover:text-[#1a1c35] flex items-center space-x-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
                        title="Exit Zen Mode (Esc)"
                    >
                        <Minimize2 className="w-4 h-4 text-[#549acb]" />
                        <span className="hidden xs:inline">Exit Zen</span>
                    </button>
                </div>
            </header>

            {/* CENTER: Breathing Neumorphic Clock Face */}
            <main className="flex flex-col items-center justify-center my-auto z-10 space-y-6">
                {/* Breathing Ambient Halo around Clock Face */}
                <div className="relative flex items-center justify-center">

                    {/* LAYER 1: Current Aura Glow (Crossfades smoothly via opacity) */}
                    <div
                        className="absolute -inset-8 sm:-inset-14 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ease-in-out"
                        style={{
                            background: activeSession.isRunning
                                ? `radial-gradient(circle, ${currentColors.c1}45 0%, ${currentColors.c2}30 65%, transparent 100%)`
                                : 'radial-gradient(circle, rgba(163,177,198,0.2) 0%, transparent 100%)',
                            opacity: fadeToNext ? 0 : 1,
                            transform: activeSession.isRunning ? 'scale(1.06)' : 'scale(1)',
                        }}
                    />

                    {/* LAYER 2: Next Aura Glow (Fades in seamlessly over Layer 1) */}
                    <div
                        className="absolute -inset-8 sm:-inset-14 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ease-in-out"
                        style={{
                            background: activeSession.isRunning
                                ? `radial-gradient(circle, ${nextColors.c1}45 0%, ${nextColors.c2}30 65%, transparent 100%)`
                                : 'radial-gradient(circle, rgba(163,177,198,0.2) 0%, transparent 100%)',
                            opacity: fadeToNext ? 1 : 0,
                            transform: activeSession.isRunning ? 'scale(1.06)' : 'scale(1)',
                        }}
                    />
