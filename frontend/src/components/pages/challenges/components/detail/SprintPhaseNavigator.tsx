import React from 'react';
import { Layers, CheckCircle2, Clock, Award } from 'lucide-react';
import { ChallengeSprint } from '../../../../../types';

interface SprintPhaseNavigatorProps {
    sprints: ChallengeSprint[];
    activeSprintId?: string;
    accentColor: string;
    onSelectSprint: (sprintId: string) => void;
    onCompleteCurrentSprintPrompt?: (sprint: ChallengeSprint) => void;
}

export const SprintPhaseNavigator: React.FC<SprintPhaseNavigatorProps> = ({
    sprints,
    activeSprintId,
    accentColor,
    onSelectSprint,
    onCompleteCurrentSprintPrompt,
}) => {
    if (!sprints || sprints.length === 0) return null;

    const currentSelectedSprint = sprints.find((s) => s.id === activeSprintId) || sprints[0];

    return (
        <div className="neu-card p-4 sm:p-5 bg-[#E0E5EC] space-y-3.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4" style={{ color: accentColor }} />
                    <h3 className="text-sm font-black text-[#1a1c35]">Challenge Phases &amp; Sprints</h3>
                </div>
                <div className="flex items-center space-x-2">
                    {currentSelectedSprint && currentSelectedSprint.status === 'active' && onCompleteCurrentSprintPrompt && (
                        <button
                            onClick={() => onCompleteCurrentSprintPrompt(currentSelectedSprint)}
                            className="px-3.5 py-1.5 rounded-xl neu-button text-xs font-bold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 flex items-center space-x-1.5 transition-all shadow-sm"
                        >
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Finish Sprint</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Sprints Horizontal Scroll Pill Bar */}
            <div className="flex items-center space-x-2.5 overflow-x-auto pb-1.5 pt-1">
                {sprints.map((sprint, idx) => {
                    const isSelected = sprint.id === activeSprintId || (!activeSprintId && idx === 0);
                    const isCompleted = sprint.status === 'completed';
                    const completedDays = (sprint.logs || []).filter((l) => l.status === 'completed').length;
                    const progressPercent = Math.min(100, Math.round((completedDays / sprint.targetDays) * 100));

                    return (
                        <button
                            key={sprint.id}
                            onClick={() => onSelectSprint(sprint.id)}
                            className={`px-3.5 py-2.5 rounded-xl text-left transition-all shrink-0 flex items-center space-x-3 min-w-[200px] ${isSelected
                                ? 'neu-inset bg-white/70 shadow-sm border border-slate-300/80'
                                : 'neu-button bg-[#E0E5EC] hover:bg-white/40'
                                }`}
                        >
                            <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${isCompleted
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : isSelected
                                        ? 'text-white'
                                        : 'bg-slate-200 text-slate-700'
                                    }`}
                                style={
                                    isSelected && !isCompleted
                                        ? { backgroundColor: accentColor }
                                        : undefined
                                }
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                    <span>P{sprint.phaseNumber || idx + 1}</span>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black text-[#1a1c35] truncate">
                                        {sprint.title}
                                    </h4>
                                </div>
                                <div className="flex items-center justify-between mt-1 text-[10px] font-bold text-[#717699]">
                                    <span>
                                        {completedDays}/{sprint.targetDays} Days
                                    </span>
                                    <span>{progressPercent}%</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
