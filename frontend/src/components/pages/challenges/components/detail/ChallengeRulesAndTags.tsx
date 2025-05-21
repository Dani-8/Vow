import React, { useState } from 'react';
import { ClipboardCheck, Tag, Edit3, Lightbulb, ChevronRight, Layers, Check, X } from 'lucide-react';
import { Challenge, ChallengeSprint } from '../../../../../types';

interface ChallengeRulesAndTagsProps {
    challenge: Challenge;
    activeSprint?: ChallengeSprint | null;
    accentColor: string;
    onEdit: () => void;
    onUpdateSprintRule?: (newRule: string) => Promise<void>;
}

export const ChallengeRulesAndTags: React.FC<ChallengeRulesAndTagsProps> = ({
    challenge,
    activeSprint,
    accentColor,
    onEdit,
    onUpdateSprintRule,
}) => {
    const [isEditingRule, setIsEditingRule] = useState(false);
    const [ruleInput, setRuleInput] = useState(activeSprint?.rule || challenge.rule || '');
    const [isSaving, setIsSaving] = useState(false);

    const activeRule = activeSprint?.rule || challenge.rule || 'Complete your core daily commitment for this challenge.';
    const isPhaseSpecific = Boolean(activeSprint?.rule && activeSprint.rule !== challenge.rule);

    const handleSaveRule = async () => {
        if (!onUpdateSprintRule) {
            setIsEditingRule(false);
            return;
        }
        try {
            setIsSaving(true);
            await onUpdateSprintRule(ruleInput.trim());
            setIsEditingRule(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Sub-cards: Challenge Rules & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Challenge Rules */}
                <div className="neu-card p-5 bg-[#E0E5EC] space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2" style={{ color: accentColor }}>
                            <ClipboardCheck className="w-4 h-4" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                {activeSprint ? `Phase ${activeSprint.phaseNumber} Rule` : 'Challenge Rules'}
                            </h4>
                        </div>
                        {onUpdateSprintRule && !isEditingRule && (
                            <button
                                onClick={() => {
                                    setRuleInput(activeRule);
                                    setIsEditingRule(true);
                                }}
                                className="text-[10px] font-bold flex items-center space-x-1 hover:cursor-pointer"
                                style={{ color: accentColor }}
                            >
                                <Edit3 className="w-3 h-3" />
                                <span>Tweak Rule</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-[#717699]">
                        <span>What counts as a completed day</span>
                        {isPhaseSpecific && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded neu-inset text-indigo-700">
                                Phase Custom
                            </span>
                        )}
                    </div>

                    {isEditingRule ? (
                        <div className="space-y-2 pt-1">
                            <textarea
                                rows={2}
                                value={ruleInput}
                                onChange={(e) => setRuleInput(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl neu-input text-xs font-medium resize-none"
                                placeholder="Enter specific daily non-negotiable rule for this phase..."
                            />
                            <div className="flex items-center justify-end space-x-2">
                                <button
                                    onClick={() => setIsEditingRule(false)}
                                    className="px-2.5 py-1 rounded-lg neu-button text-[10px] font-bold text-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveRule}
                                    disabled={isSaving}
                                    className="px-3 py-1 rounded-lg neu-button-primary text-[10px] font-bold text-white shadow-sm flex items-center space-x-1"
                                >
                                    <Check className="w-3 h-3" />
                                    <span>{isSaving ? 'Saving...' : 'Save Rule'}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="neu-inset p-3.5 rounded-xl bg-[#E0E5EC]/90 text-xs font-medium text-slate-700 leading-relaxed">
                            {activeRule}
                        </div>
                    )}
                </div>

                {/* Challenge Tags */}
                <div className="neu-card p-5 bg-[#E0E5EC] space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2" style={{ color: accentColor }}>
                            <Tag className="w-4 h-4" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                Challenge Tags
                            </h4>
                        </div>
                        <button
                            onClick={onEdit}
                            className="text-[10px] font-bold flex items-center space-x-1 hover:cursor-pointer"
                            style={{ color: accentColor }}
                        >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {challenge.tags && challenge.tags.length > 0 ? (
                            challenge.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-1 rounded-lg neu-inset text-[11px] font-bold text-slate-700 bg-white/40"
                                >
                                    {tag}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-slate-400 font-medium italic">No tags</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Motivational Tip Banner */}
            <div className="neu-card p-4 bg-[#E0E5EC] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-9 h-9 rounded-xl neu-button flex items-center justify-center bg-amber-50 shrink-0"
                        style={{ color: accentColor }}
                    >
                        <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                        <h5 className="text-xs font-bold text-slate-900">Consistency compounds.</h5>
                        <p className="text-[11px] text-[#717699] font-medium">
                            Small daily actions lead to massive results over time.
                        </p>
                    </div>
                </div>
                <span
                    className="text-xs font-bold flex items-center space-x-1 cursor-pointer hover:underline"
                    style={{ color: accentColor }}
                >
                    <span>Keep showing up</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </div>
    );
};
