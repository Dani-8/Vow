import React, { useState } from 'react';
import { X, Award, Star, CheckCircle2 } from 'lucide-react';
import { ChallengeSprint, SprintRetrospective } from '../../../../../types';

interface CompleteSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    sprint: ChallengeSprint;
    accentColor: string;
    onConfirmComplete: (retrospective: SprintRetrospective) => Promise<void>;
    onStartNextSprintPrompt: () => void;
}

export const CompleteSprintModal: React.FC<CompleteSprintModalProps> = ({
    isOpen,
    onClose,
    sprint,
    accentColor,
    onConfirmComplete,
    onStartNextSprintPrompt,
}) => {
    const [summary, setSummary] = useState('');
    const [score, setScore] = useState<number>(5);
    const [keyLearnings, setKeyLearnings] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const completedDaysCount = (sprint.logs || []).filter((l) => l.status === 'completed').length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!summary.trim()) {
            setError('Please write a brief summary of what you achieved during this sprint.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await onConfirmComplete({
                completedAt: new Date().toISOString().split('T')[0],
                summary: summary.trim(),
                score,
                keyLearnings: keyLearnings.trim() || undefined,
            });
            onClose();
            onStartNextSprintPrompt();
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
                        <Award className="w-6 h-6" style={{ color: accentColor }} />
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full neu-inset text-emerald-700 bg-emerald-50">
                            Sprint Milestone Completed
                        </span>
                        <h3 className="text-lg font-black text-[#1a1c35] mt-1">
                            {sprint.title}
                        </h3>
                        <p className="text-xs font-bold text-[#717699]">
                            {completedDaysCount} of {sprint.targetDays} Days Logged
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Rating / Satisfaction */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                            How did this sprint go?
                        </label>