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

    return (
        <aside
            aria-label="Active Focus Session"
            className="fixed bottom-5 right-5 sm:right-8 z-40 animate-in slide-in-from-bottom-5 duration-300"
        >
            <div className="neu-card px-4 py-2.5 rounded-2xl bg-[#E0E5EC]/95 backdrop-blur-md border border-white/70 shadow-2xl flex items-center space-x-3.5">
                {/* Clickable Target Section */}
                <button
                    type="button"
                    onClick={handleTargetClick}
                    className="flex items-center space-x-2 text-left cursor-pointer group focus:outline-none"
                    title={`Click to open ${activeSession.sourceType === 'task' ? 'Task' : 'Challenge'}: "${activeSession.sourceTitle}"`}
                >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 neu-button flex items-center justify-center text-emerald-600 relative shrink-0 group-hover:scale-105 transition-transform">
                        <Timer className="w-4 h-4 animate-spin-slow" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="max-w-[130px] sm:max-w-[190px]">
                        <div className="flex items-center space-x-1">
                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                                {activeSession.sourceType === 'task' ? 'Task Focus' : 'Challenge Focus'}
                            </span>
                            <ExternalLink className="w-2.5 h-2.5 text-[#549acb] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="text-xs font-black text-[#1a1c35] truncate leading-tight group-hover:text-[#549acb] transition-colors">
                            {activeSession.sourceTitle}
                        </h4>
                    </div>
                </button>

                {/* Big Time readout */}
                <div
                    onClick={handleTargetClick}
                    className="cursor-pointer neu-inset px-2.5 py-1 rounded-xl bg-[#E0E5EC] hover:bg-[#D5DCE5]/60 transition-colors"
                    title="Click to jump to session page"
                >
                    <span className="text-sm font-black font-mono tracking-wider text-[#29335a]">
                        {formattedTimer}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-1 border-l border-slate-300/60 pl-2">
                    <button
                        onClick={togglePlayPause}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            activeSession.isRunning
                                ? 'neu-button text-amber-600'
                                : 'neu-button-primary text-white'
                        }`}
                        title={activeSession.isRunning ? 'Pause' : 'Resume'}
                    >
                        {activeSession.isRunning ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                            <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                    </button>

                    <button
                        onClick={stopSession}
                        className="w-7 h-7 rounded-lg neu-button text-rose-500 hover:text-rose-600 flex items-center justify-center transition-all"
                        title="Cancel Session"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};
