import React from 'react';
import { Timer, Play, Pause, X, ArrowRight } from 'lucide-react';
import { useFocusTimer } from '../../context/FocusTimerContext';

interface GlobalFloatingTimerBarProps {
    activeView: string;
    onGoToHome: () => void;
}

export const GlobalFloatingTimerBar: React.FC<GlobalFloatingTimerBarProps> = ({
    activeView,
    onGoToHome,
}) => {
    const { activeSession, togglePlayPause, stopSession } = useFocusTimer();

    if (!activeSession) return null;

    const timerMinutes = Math.floor(activeSession.remainingSeconds / 60);
    const timerSeconds = activeSession.remainingSeconds % 60;
    const formattedTimer = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;
