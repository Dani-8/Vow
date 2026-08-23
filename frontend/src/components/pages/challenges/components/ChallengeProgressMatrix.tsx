import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ChallengeLog } from '../../../../types';

interface ChallengeProgressMatrixProps {
    accentColor: string;
    gridWeeks: {
        weekIndex: number;
        days: ({
            dayNumber: number;
            date: Date;
            dateStr: string;
            dayOfWeek: number;
            log?: ChallengeLog;
            isToday: boolean;
            isPast: boolean;
            isFuture: boolean;
        } | null)[];
    }[];
    startDateObj: Date;
    targetEndDateObj: Date;
    onOpenDayModal: (dayNumber: number, dateStr: string, log?: ChallengeLog) => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ChallengeProgressMatrix: React.FC<ChallengeProgressMatrixProps> = ({
    accentColor,
    gridWeeks,
    startDateObj,
    targetEndDateObj,
    onOpenDayModal,
}) => {
    return (
        <div className="neu-card p-6 bg-[#E0E5EC]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" style={{ color: accentColor }} />
                    <h3 className="text-sm font-black text-[#1a1c35]">Your Progress</h3>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-[#515777]">
                    <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 rounded-[3px] bg-emerald-500" />
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <div
                            className="w-3 h-3 rounded-[3px] ring-2 ring-offset-1 ring-mist-500/60"
                            style={{ backgroundColor: accentColor, borderColor: accentColor }}
                        />
                        <span>Today</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 rounded-[3px] bg-[#8A95A5]" />
                        <span>Missed</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <div className="w-3 h-3 rounded-[3px] bg-[#D1D9E6] border border-slate-300/40" />
                        <span>Upcoming</span>
                    </div>
                </div>
            </div>

            {/* Matrix Heatmap Container */}
            <div className="neu-inset p-4 rounded-2xl overflow-x-auto bg-[#E0E5EC]/80">
                <div className="min-w-fit">
                    {/* Week Header Labels */}
                    <div className="flex ml-8 mb-2 space-x-1.5">
                        {gridWeeks.map((week, idx) => (
                            <div
                                key={week.weekIndex}
                                className="w-5 text-[8px] sm:text-[9px] font-black text-[#717699] text-center uppercase tracking-tight shrink-0"
                            >
                                {idx === 0 || (idx + 1) % 2 === 0 ? `W${week.weekIndex}` : ''}
                            </div>
                        ))}
                    </div>

                    {/* 7 Day Rows (Mon - Sun) */}
                    <div className="space-y-1.5">
                        {DAYS_OF_WEEK.map((dayLabel, rowIndex) => (
                            <div key={dayLabel} className="flex items-center space-x-1.5">
                                <span className="w-6 text-[10px] font-extrabold text-[#717699] shrink-0">
                                    {dayLabel}
                                </span>

                                <div className="flex space-x-1.5">
                                    {gridWeeks.map((week) => {
                                        const dayItem = week.days[rowIndex];
                                        if (!dayItem) {
                                            return <div key={`${week.weekIndex}-${rowIndex}`} className="w-5 h-5 opacity-0" />;
                                        }

                                        const isCompleted = dayItem.log?.status === 'completed';
                                        const isRest = dayItem.log?.status === 'rest';
                                        const isMissed = !isCompleted && !isRest && (dayItem.log?.status === 'missed' || (dayItem.isPast && !dayItem.log));
                                        const isCellToday = dayItem.isToday;

                                        let bgClass = 'bg-[#D1D9E6] hover:border-slate-400';
                                        let cellStyle: React.CSSProperties | undefined = undefined;

                                        if (isCompleted) {
                                            bgClass = 'bg-emerald-500 text-white shadow-sm';
                                        } else if (isRest) {
                                            bgClass = 'bg-amber-400 text-slate-900';
                                        } else if (isMissed) {
                                            bgClass = 'bg-[#8A95A5] text-white hover:ring-1 hover:ring-slate-400';
                                        } else if (isCellToday) {
                                            bgClass = 'text-white ring-2 ring-offset-1 animate-pulse';
                                            cellStyle = {
                                                backgroundColor: accentColor,
                                                borderColor: accentColor,
                                            };
                                        }

                                        return (
                                            <button
                                                key={dayItem.dayNumber}
                                                type="button"
                                                style={cellStyle}
                                                onClick={() =>
                                                    onOpenDayModal(
                                                        dayItem.dayNumber,
                                                        dayItem.dateStr,
                                                        dayItem.log
                                                    )
                                                }
                                                title={`Day ${dayItem.dayNumber} (${dayItem.dateStr}): ${isCompleted
                                                    ? `Completed${dayItem.log?.note ? ` - ${dayItem.log.note}` : ''}`
                                                    : isRest
                                                        ? 'Rest Day'
                                                        : isMissed
                                                            ? 'Missed Day (Click to log)'
                                                            : isCellToday
                                                                ? "Today's Target Day (Click to log)"
                                                                : 'Upcoming Day'
                                                    }`}
                                                className={`w-5 h-5 rounded-md text-[8px] sm:text-[9px] font-black flex items-center justify-center transition-all cursor-pointer hover:scale-115 shrink-0 ${bgClass}`}
                                            >
                                                {isCellToday ? (
                                                    <span className="font-extrabold text-[8px] leading-none">{dayItem.dayNumber}</span>
                                                ) : isCompleted ? (
                                                    <span className="leading-none text-[9px]">✓</span>
                                                ) : isRest ? (
                                                    <span className="leading-none text-[8px]">☕</span>
                                                ) : (
                                                    ''
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Matrix Footer Span */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-[#717699]">
                <span>
                    Start:{' '}
                    <strong className="text-slate-800">
                        {startDateObj.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </strong>
                </span>
                <span>
                    Today:{' '}
                    <strong style={{ color: accentColor }}>
                        {new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </strong>
                </span>
                <span>
                    Target End:{' '}
                    <strong className="text-slate-800">
                        {targetEndDateObj.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </strong>
                </span>
            </div>
        </div>
    );
};
