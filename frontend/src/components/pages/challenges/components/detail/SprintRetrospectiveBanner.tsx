import React from 'react';
import { Award, Star, BookOpen, ArrowRight } from 'lucide-react';
import { ChallengeSprint } from '../../../../../types';

interface SprintRetrospectiveBannerProps {
    sprint: ChallengeSprint;
    accentColor: string;
    onStartNextSprintPrompt: () => void;
    onEditRetrospectivePrompt?: () => void;
}

export const SprintRetrospectiveBanner: React.FC<SprintRetrospectiveBannerProps> = ({
    sprint,
    accentColor,
    onStartNextSprintPrompt,
    onEditRetrospectivePrompt,
}) => {
    const retro = sprint.retrospective;

    return (
        <div className="neu-card p-5 sm:p-6 bg-[#E0E5EC] border-l-4 border-emerald-500 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center bg-emerald-50 text-emerald-600 shadow-sm shrink-0">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full neu-inset text-emerald-700 bg-emerald-50">
                                Phase {sprint.phaseNumber} Completed
                            </span>
                            {retro?.score && (
                                <div className="flex items-center space-x-0.5 text-amber-500">
                                    {Array.from({ length: retro.score }).map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                                    ))}
                                </div>
                            )}
                        </div>
                        <h4 className="text-sm font-black text-[#1a1c35] mt-0.5">
                            {sprint.title}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {onEditRetrospectivePrompt && (
                        <button
                            onClick={onEditRetrospectivePrompt}
                            className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-slate-600 hover:text-slate-900"
                        ></button>