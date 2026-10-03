import React from 'react';
import { Timer, Play, Pause, X, ExternalLink } from 'lucide-react';
import { useFocusTimer } from '../../context/FocusTimerContext';

interface GlobalFloatingTimerBarProps {
    activeView: string;
    onNavigateToTarget: (sourceType: 'task' | 'challenge', sourceId: string) => void;
}

export const GlobalFloatingTimerBar: React.FC<GlobalFloatingTimerBarProps> = ({
    activeView,
    onNavigateToTarget,
}) => {
    const { activeSession, togglePlayPause, stopSession } = useFocusTimer();

    if (!activeSession) return null;

    const timerMinutes = Math.floor(activeSession.remainingSeconds / 60);
    const timerSeconds = activeSession.remainingSeconds % 60;
    const formattedTimer = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;

    const handleTargetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onNavigateToTarget(activeSession.sourceType, activeSession.sourceId);
    };