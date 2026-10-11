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

                    {/* Outer Neumorphic Dial */}
                    <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#E0E5EC] p-5 sm:p-7 flex items-center justify-center shadow-[14px_14px_30px_rgba(163,177,198,0.7),-14px_-14px_30px_rgba(255,255,255,0.95)] border border-white/70 relative">
                        {/* Inner Inset Cavity */}
                        <div className="w-full h-full rounded-full bg-[#E0E5EC] shadow-[inset_10px_10px_20px_rgba(163,177,198,0.65),inset_-10px_-10px_20px_rgba(255,255,255,0.95)] flex flex-col items-center justify-center relative p-6">

                            {/* Running indicator badge */}
                            <div className="mb-2 flex items-center space-x-1.5 neu-badge px-3 py-1 rounded-full bg-[#E0E5EC]/90">
                                <Sparkles className="w-3 h-3 text-[#549acb]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#515777]">
                                    {activeSession.isRunning ? 'Deep Immersion' : 'Session Paused'}
                                </span>
                            </div>

                            {/* Massive Clock Font */}
                            <span className="text-5xl sm:text-7xl font-black font-mono tracking-tight text-[#1a1c35] drop-shadow-xs">
                                {formattedTimer}
                            </span>

                            {/* Subtitle / Day note */}
                            <p className="text-xs sm:text-sm font-semibold text-[#717699] text-center max-w-[200px] truncate mt-1">
                                {activeSession.sourceSubtitle || 'Maintain laser focus'}
                            </p>

                            {/* Circular-style bottom progress arc pill with smooth cross-fading color layers */}
                            <div className="w-36 sm:w-44 h-2 rounded-full neu-inset overflow-hidden mt-4 relative">
                                {/* Layer 1: Current Gradient */}
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-in-out shadow-sm"
                                    style={{
                                        width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                                        background: `linear-gradient(90deg, ${currentColors.c1}, ${currentColors.c2})`,
                                        opacity: fadeToNext ? 0 : 1,
                                    }}
                                />
                                {/* Layer 2: Next Gradient */}
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-in-out shadow-sm"
                                    style={{
                                        width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                                        background: `linear-gradient(90deg, ${nextColors.c1}, ${nextColors.c2})`,
                                        opacity: fadeToNext ? 1 : 0,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Text */}
                <div className="text-center">
                    <span className="text-xs font-bold text-[#647196]">
                        {Math.round(progressPercent)}% elapsed of {Math.round(activeSession.totalSeconds / 60)}m goal
                    </span>
                </div>
            </main>

            {/* BOTTOM BAR: Minimal Zen Controls */}
            <footer className="w-full max-w-md mx-auto flex items-center justify-center space-x-4 z-10 pt-2 pb-2">
                {/* Reset button */}
                <button
                    onClick={resetSession}
                    className="p-4 rounded-2xl neu-button text-[#717699] hover:text-[#1a1c35] transition-all hover:scale-105 active:scale-95 shadow-md"
                    title="Reset timer"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                {/* Huge Primary Play / Pause button */}
                <button
                    onClick={togglePlayPause}
                    className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center space-x-2.5 transition-all shadow-xl hover:scale-105 active:scale-95 ${
                        activeSession.isRunning
                            ? 'neu-button text-amber-600 hover:text-amber-700 bg-[#E0E5EC]'
                            : 'neu-button-primary text-white'
                    }`}
                    title={activeSession.isRunning ? 'Pause (Space)' : 'Resume (Space)'}
                >
                    {activeSession.isRunning ? (
                        <>
                            <Pause className="w-5 h-5 fill-current" />
                            <span>Pause</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 fill-current" />
                            <span>Resume</span>
                        </>
                    )}
                </button>