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
