import React from 'react';
import { Timer, Play, Pause, X, ArrowRight } from 'lucide-react';
import { useFocusTimer } from '../../context/FocusTimerContext';

interface GlobalFloatingTimerBarProps {
    activeView: string;
    onGoToHome: () => void;
}