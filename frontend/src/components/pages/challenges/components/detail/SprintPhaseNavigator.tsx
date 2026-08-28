import React from 'react';
import { Layers, CheckCircle2, Clock, Plus, Award } from 'lucide-react';
import { ChallengeSprint } from '../../../../../types';

interface SprintPhaseNavigatorProps {
    sprints: ChallengeSprint[];
    activeSprintId?: string;
    accentColor: string;
    onSelectSprint: (sprintId: string) => void;
    onStartNextSprintPrompt: () => void;
    onCompleteCurrentSprintPrompt?: (sprint: ChallengeSprint) => void;
}

export const SprintPhaseNavigator: React.FC<SprintPhaseNavigatorProps> = ({
    sprints,
    activeSprintId,
    accentColor,
    onSelectSprint,
    onStartNextSprintPrompt,
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
                    {currentSelectedSprint && currentSelectedSprint.status === 'active' && onCompleteCurrentSprintPrompt ? (
                        <button
                            onClick={() => onCompleteCurrentSprintPrompt(currentSelectedSprint)}
                            className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 flex items-center space-x-1.5 transition-all shadow-sm"
                        >
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Complete Phase</span>
                        </button>
                    ) : (
                        <button
                            onClick={onStartNextSprintPrompt}
                            className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1.5 transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Next Phase</span>
                        </button>
                    )}