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
                    <div className="w-9 h-9 rounded-xl neu-button flex items-center justify-center bg-amber-50 shrink-0"
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
                <span className="text-xs font-bold flex items-center space-x-1 cursor-pointer hover:underline" style={{ color: accentColor }}>
                    <span>Keep showing up</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </div>
    );
};
