import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Sparkles, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { Challenge } from '../../../../../types';

interface StartNextSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    challenge: Challenge;
    accentColor: string;
    onStartSprint: (sprintData: {
        title: string;
        targetDays: number;
        startDate: string;
        targetEndDate?: string;
        rule?: string;
    }) => Promise<void>;
}

const PRESET_DURATIONS = [
    { label: '7 Days', days: 7 },
    { label: '10 Days', days: 10 },
    { label: '14 Days', days: 14 },
    { label: '21 Days', days: 21 },
    { label: '30 Days', days: 30 },
];

export const StartNextSprintModal: React.FC<StartNextSprintModalProps> = ({
    isOpen,
    onClose,
    challenge,
    accentColor,
    onStartSprint,
}) => {
    const existingSprints = challenge.sprints || [];
    const lastSprint = existingSprints.length > 0 ? existingSprints[existingSprints.length - 1] : null;
    const nextPhaseNumber = existingSprints.length + 1;
    const isExtension = challenge.status === 'completed' || (lastSprint && lastSprint.status === 'completed');

    const [title, setTitle] = useState('');
    const [targetDays, setTargetDays] = useState<number>(14);
    const [isCustomDays, setIsCustomDays] = useState(false);
    const [customDaysInput, setCustomDaysInput] = useState('14');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [rule, setRule] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Compute default start date seamlessly from previous sprint
    useEffect(() => {
        if (isOpen) {
            let defaultStart = new Date().toISOString().split('T')[0];
            if (lastSprint?.targetEndDate) {
                const prevEnd = new Date(lastSprint.targetEndDate);
                // The day after previous sprint ends
                const nextDay = new Date(prevEnd.getTime() + 86400000);
                const nextDayStr = nextDay.toISOString().split('T')[0];
                // If the day after previous sprint is today or future, use it
                const todayStr = new Date().toISOString().split('T')[0];
                defaultStart = nextDayStr >= todayStr ? nextDayStr : todayStr;
            }

            const previousRule = lastSprint?.rule || challenge.rule || '';
            setTitle(`Phase ${nextPhaseNumber}: ${challenge.title} (Part ${nextPhaseNumber})`);
            setTargetDays(14);
            setIsCustomDays(false);
            setCustomDaysInput('14');
            setStartDate(defaultStart);
            setRule(previousRule);
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, challenge, lastSprint, nextPhaseNumber]);

    if (!isOpen) return null;

    const activeDaysCount = isCustomDays ? parseInt(customDaysInput, 10) || targetDays : targetDays;
    const startObj = new Date(startDate || new Date());
    // End date calculation: startDate + (activeDaysCount - 1) days
    const endObj = new Date(startObj.getTime() + Math.max(0, activeDaysCount - 1) * 86400000);
    const prevRule = lastSprint?.rule || challenge.rule || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Please enter a sprint/phase title.');
            return;
        }

        if (activeDaysCount <= 0) {
            setError('Sprint duration must be at least 1 day.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await onStartSprint({
                title: title.trim(),
                targetDays: activeDaysCount,
                startDate,
                targetEndDate: endObj.toISOString().split('T')[0],
                rule: rule.trim() || undefined,
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to start sprint');
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
                        <Plus className="w-6 h-6" style={{ color: accentColor }} />
                    </div>
                    <div>
                        <span
                            className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full neu-inset"
                            style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
                        >
                            {isExtension ? 'Extend Challenge / Bonus Sprint' : `Phase ${nextPhaseNumber} Sprint`}
                        </span>
                        <h3 className="text-lg font-black text-[#1a1c35] mt-1">
                            {isExtension ? `Launch Bonus Phase ${nextPhaseNumber}` : `Launch Phase ${nextPhaseNumber} Sprint`}
                        </h3>
                        <p className="text-xs font-bold text-[#717699]">
                            {isExtension
                                ? `Keep your momentum going on "${challenge.title}"`
                                : `Progress "${challenge.title}" to its next milestone`}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Phase Title */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                            Sprint / Phase Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Phase 2: Advanced Conversational Dialogues"
                            className="w-full px-3.5 py-2.5 rounded-xl neu-input text-xs font-bold"
                            required
                        />
                    </div>

                    {/* Target Duration */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                            Sprint Duration (Days) *
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_DURATIONS.map((preset) => {
                                const isSelected = !isCustomDays && targetDays === preset.days;
                                return (
                                    <button
                                        key={preset.days}
                                        type="button"
                                        onClick={() => {
                                            setIsCustomDays(false);
                                            setTargetDays(preset.days);
                                        }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                            isSelected
                                                ? 'neu-button-primary text-white shadow-sm'
                                                : 'neu-button text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => setIsCustomDays(true)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl neu-input text-xs font-bold"
                        />
                    </div>

                    {/* Sprint Rule */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                            Phase Rule / Daily Goal
                        </label>
                        <input
                            type="text"
                            value={rule}
                            onChange={(e) => setRule(e.target.value)}
                            placeholder="e.g. Learn 6 new verbs daily and form 3 sentences."
                            className="w-full px-3.5 py-2.5 rounded-xl neu-input text-xs font-medium"
                        />
                    </div>

                    {/* Date Preview Card */}
                    <div className="neu-card p-3 rounded-xl bg-[#E0E5EC] flex items-center justify-between text-xs font-bold text-slate-700">
                        <div className="flex items-center space-x-1.5">
                            <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                            <span>
                                {startObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                                {endObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full neu-inset text-indigo-700">
                            {activeDaysCount} Days Sprint
                        </span>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-300/70 flex items-center justify-end space-x-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl neu-button text-xs font-bold text-slate-600 hover:text-slate-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl neu-button-primary text-xs font-bold text-white shadow-md disabled:opacity-50 flex items-center space-x-1.5"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>{isSubmitting ? 'Launching...' : 'Start Phase Sprint'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
