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

    return (
        <aside
            aria-label="Active Focus Session"
            className="fixed bottom-5 right-5 sm:right-8 z-40 animate-in slide-in-from-bottom-5 duration-300"
        >
            <div className="neu-card px-4 py-2.5 rounded-2xl bg-[#E0E5EC]/95 backdrop-blur-md border border-white/70 shadow-2xl flex items-center space-x-3.5">
                {/* Pulsing Timer Icon */}
                <div
                    onClick={onGoToHome}
                    className="flex items-center space-x-2 cursor-pointer group"
                    title="Click to view on Home Dashboard"
                >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 neu-button flex items-center justify-center text-emerald-600 relative">
                        <Timer className="w-4 h-4 animate-spin-slow" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="max-w-[130px] sm:max-w-[190px]">
                        <div className="flex items-center space-x-1.5">
                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                                {activeSession.sourceType === 'task' ? 'Task Focus' : 'Challenge Focus'}
                            </span>
                        </div>
                        <h4 className="text-xs font-black text-[#1a1c35] truncate leading-tight group-hover:text-[#549acb] transition-colors">
                            {activeSession.sourceTitle}
                        </h4>
                    </div>
                </div>

                {/* Big Time readout */}
                <div
                    onClick={onGoToHome}
                    className="cursor-pointer neu-inset px-2.5 py-1 rounded-xl bg-[#E0E5EC]"
                    title="Click to view on Home"
                >
                    <span className="text-sm font-black font-mono tracking-wider text-[#29335a]">
                        {formattedTimer}
                    </span>
                </div>