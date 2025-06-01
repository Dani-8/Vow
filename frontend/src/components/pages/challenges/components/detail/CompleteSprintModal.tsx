import React, { useState } from 'react';
import { X, Award, Star, CheckCircle2, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { ChallengeSprint, SprintRetrospective } from '../../../../../types';

interface CompleteSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    sprint: ChallengeSprint;
    accentColor: string;
    isFinalSprint?: boolean;
    onConfirmComplete: (retrospective: SprintRetrospective, actionAfter: 'start_next' | 'complete_challenge' | 'stay') => Promise<void>;
    onStartNextSprintPrompt: () => void;
}

export const CompleteSprintModal: React.FC<CompleteSprintModalProps> = ({
    isOpen,
    onClose,
    sprint,
    accentColor,
    isFinalSprint = false,
    onConfirmComplete,
    onStartNextSprintPrompt,
}) => {
    const [summary, setSummary] = useState(sprint.retrospective?.summary || '');
    const [score, setScore] = useState<number>(sprint.retrospective?.score || 5);
    const [keyLearnings, setKeyLearnings] = useState(sprint.retrospective?.keyLearnings || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const completedDaysCount = (sprint.logs || []).filter((l) => l.status === 'completed').length;

    const handleComplete = async (actionAfter: 'start_next' | 'complete_challenge' | 'stay') => {
        if (!summary.trim()) {
            setError('Please write a brief summary of what you achieved during this sprint.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            const retro: SprintRetrospective = {
                completedAt: new Date().toISOString().split('T')[0],
                summary: summary.trim(),
                score,
                keyLearnings: keyLearnings.trim() || undefined,
            };
            await onConfirmComplete(retro, actionAfter);
            onClose();
            if (actionAfter === 'start_next') {
                onStartNextSprintPrompt();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to complete sprint');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="neu-card w-full max-w-lg p-6 sm:p-7 bg-[#E0E5EC] relative max-h-[92vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35] transition-colors"
                    title="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-300/70">
                    <div
                        className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center shrink-0 shadow-sm"
                        style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
                    >
                        {isFinalSprint ? (
                            <Trophy className="w-6 h-6 text-amber-500" />
                        ) : (
                            <Award className="w-6 h-6" style={{ color: accentColor }} />
                        )}
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full neu-inset text-emerald-700 bg-emerald-50">
                            {isFinalSprint ? 'Challenge Finale Milestone' : `Phase ${sprint.phaseNumber} Sprint Completed`}
                        </span>
                        <h3 className="text-lg font-black text-[#1a1c35] mt-1">
                            {sprint.title}
                        </h3>
                        <p className="text-xs font-bold text-[#717699]">
                            {completedDaysCount} of {sprint.targetDays} Days Logged Completed
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold">
                        {error}
                    </div>
                )}

                <div className="space-y-5">
                    {/* Rating / Satisfaction */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                            How satisfied are you with this sprint?
                        </label>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setScore(val)}
                                    className={`p-2.5 rounded-xl transition-all flex items-center space-x-1 ${
                                        score >= val
                                            ? 'neu-button text-amber-500 bg-amber-50/60'
                                            : 'neu-button text-slate-400 opacity-60'
                                    }`}
                                >
                                    <Star className={`w-4 h-4 ${score >= val ? 'fill-amber-500' : ''}`} />
                                    <span className="text-xs font-bold">{val}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Final Result / Summary */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                            Milestone Accomplishment &amp; Result *
                        </label>
                        <textarea
                            rows={3}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="e.g. Completed all core grammar modules and built a 50-word daily vocabulary!"
                            className="w-full px-3.5 py-2.5 rounded-xl neu-input text-xs font-medium resize-none"
                            required
                        />
                    </div>

                    {/* Key Lessons / Next Stage ideas */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                            Key Takeaways &amp; Lessons (Optional)
                        </label>
                        <textarea
                            rows={2}
                            value={keyLearnings}
                            onChange={(e) => setKeyLearnings(e.target.value)}
                            placeholder="e.g. Spaced repetition in the morning worked 10x better than studying late at night."
                            className="w-full px-3.5 py-2.5 rounded-xl neu-input text-xs font-medium resize-none"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-300/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl neu-button text-xs font-bold text-slate-600 hover:text-slate-900 order-3 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleComplete('complete_challenge')}
                            className="px-4 py-2.5 rounded-xl neu-button text-xs font-bold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 flex items-center justify-center space-x-1.5 disabled:opacity-50 order-2"
                        >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Finish &amp; Mark Complete</span>
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleComplete('start_next')}
                            className="px-5 py-2.5 rounded-xl neu-button-primary text-xs font-bold text-white shadow-md disabled:opacity-50 flex items-center justify-center space-x-1.5 order-1 sm:order-3"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Save &amp; Start Next Phase</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
