import React from 'react';
import { BookOpen, MoreVertical, Clock } from 'lucide-react';
import { ChallengeLog } from '../../../../../types';

interface ChallengeReflectionFeedProps {
    logs: ChallengeLog[];
    accentColor: string;
    onOpenDayModal: (dayNumber: number, dateStr: string, log?: ChallengeLog) => void;
    onLogFirst: () => void;
}

export const ChallengeReflectionFeed: React.FC<ChallengeReflectionFeedProps> = ({
    logs,
    accentColor,
    onOpenDayModal,
    onLogFirst,
}) => {
    const sortedLogs = [...logs].sort((a, b) => Number(b.dayNumber) - Number(a.dayNumber));

    return (
        <div className="neu-card p-5 sm:p-6 bg-[#E0E5EC]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60">
                <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" style={{ color: accentColor }} />
                    <h3 className="text-sm font-black text-[#1a1c35]">Daily Reflection Logs</h3>
                </div>
                <span
                    className="text-xs font-extrabold px-2 py-0.5 rounded-full neu-inset"
                    style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
                >
                    {logs.length}
                </span>
            </div>

            {/* Reflection Logs Feed Content */}
            {sortedLogs.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                    <div
                        className="w-12 h-12 mx-auto rounded-2xl neu-button flex items-center justify-center shadow-sm"
                        style={{ color: accentColor }}
                    >
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">No reflections logged yet</p>
                    <p className="text-[11px] text-[#717699]">
                        Log your daily check-in to build a timeline of accomplishments.
                    </p>
                    <button
                        onClick={onLogFirst}
                        className="neu-button-primary px-4 py-2 rounded-xl text-xs font-bold text-white mt-2"
                    >
                        Log First Reflection
                    </button>
                </div>
            ) : (
                <div className="max-h-[560px] overflow-y-auto pr-2 py-5 space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-slate-300/80">
                    {sortedLogs.map((log) => {
                        const isLogCompleted = log.status === 'completed';
                        const isLogRest = log.status === 'rest';

                        return (
                            <div key={log.id} className="relative pl-8 group">
                                {/* Timeline Dot */}
                                <div
                                    className={`absolute left-2 top-5 w-3.5 h-3.5 rounded-full ring-4 ring-[#E0E5EC] transition-all duration-400 group-hover:scale-125 ${isLogCompleted
                                        ? 'bg-emerald-500'
                                        : isLogRest
                                            ? 'bg-amber-400'
                                            : 'bg-slate-400'
                                        }`}
                                />

                                <div className="neu-card p-3.5 rounded-xl bg-[#E0E5EC] hover:bg-white/40 transition-all duration-400 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-slate-800">
                                            Day {log.dayNumber}{' '}
                                            <span className="text-[10px] font-bold text-[#717699] ml-1">
                                                • {log.date}
                                            </span>
                                        </span>

                                        <button
                                            onClick={() =>
                                                onOpenDayModal(log.dayNumber, log.date, log)
                                            }
                                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 opacity-60 hover:opacity-100"
                                            title="Edit Log"
                                        >
                                            <MoreVertical className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {log.note && (
                                        <p className="text-xs font-medium text-slate-700 leading-relaxed">
                                            {log.note}
                                        </p>
                                    )}

                                    {log.imageUrl && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-200/60 max-h-32">
                                            <img
                                                src={log.imageUrl}
                                                alt={`Day ${log.dayNumber} screenshot`}
                                                className="w-full h-full object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                    )}

                                    {log.timeSpent && log.timeSpent !== '—' && (
                                        <div
                                            className="flex items-center space-x-1 text-[10px] font-bold w-fit px-2 py-0.5 rounded neu-inset"
                                            style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
                                        >
                                            <Clock className="w-3 h-3" />
                                            <span>{log.timeSpent}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
