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
