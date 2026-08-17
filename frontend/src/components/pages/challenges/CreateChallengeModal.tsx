import React, { useState, useEffect } from 'react';
import {
    X,
    Target,
    Code,
    Dumbbell,
    BookOpen,
    ClipboardCheck,
    Sparkles,
    Palette,
    Calendar,
    Layers,
    Plus,
} from 'lucide-react';
import { Challenge } from '../../../types';

interface CreateChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (challengeData: Partial<Challenge>) => Promise<void>;
    editingChallenge?: Challenge | null;
}

const CATEGORIES = [
    { id: 'engineering', label: 'Engineering', icon: Code, color: 'purple' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'emerald' },
    { id: 'learning', label: 'Learning', icon: BookOpen, color: 'amber' },
    { id: 'discipline', label: 'Discipline', icon: ClipboardCheck, color: 'rose' },
    { id: 'mindfulness', label: 'Mindfulness', icon: Sparkles, color: 'blue' },
];

const PRESET_DURATIONS = [
    { days: 21, label: '21 Days' },
    { days: 30, label: '30 Days' },
    { days: 60, label: '60 Days' },
    { days: 75, label: '75 Days' },
    { days: 100, label: '100 Days' },
];

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingChallenge,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('engineering');
    const [color, setColor] = useState('purple');
    const [targetDays, setTargetDays] = useState<number>(100);
    const [isCustomDays, setIsCustomDays] = useState(false);
    const [customDaysInput, setCustomDaysInput] = useState('100');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [rule, setRule] = useState('');
    const [tagsInput, setTagsInput] = useState('Discipline, Focus, Growth');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (editingChallenge) {
            setTitle(editingChallenge.title);
            setDescription(editingChallenge.description || '');
            setCategory(editingChallenge.category || 'engineering');
            setColor(editingChallenge.color || 'purple');
            setTargetDays(editingChallenge.targetDays || 100);
            setCustomDaysInput(String(editingChallenge.targetDays || 100));
            const hasPreset = PRESET_DURATIONS.some((p) => p.days === editingChallenge.targetDays);
            setIsCustomDays(!hasPreset);
            setStartDate(
                editingChallenge.startDate ? editingChallenge.startDate.split('T')[0] : new Date().toISOString().split('T')[0]
            );
            setRule(editingChallenge.rule || '');
            setTagsInput(editingChallenge.tags ? editingChallenge.tags.join(', ') : '');
        } else {
            setTitle('');
            setDescription('');
            setCategory('engineering');
            setColor('purple');
            setTargetDays(100);
            setCustomDaysInput('100');
            setIsCustomDays(false);
            setStartDate(new Date().toISOString().split('T')[0]);
            setRule('');
            setTagsInput('Discipline, Focus, Growth');
        }
        setError(null);
    }, [editingChallenge, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Challenge title is required');
            return;
        }

        const finalDays = isCustomDays ? Math.max(1, parseInt(customDaysInput, 10) || 30) : targetDays;
        const finalTags = tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        const startDateTime = new Date(startDate);
        const targetEndDateTime = new Date(startDateTime.getTime() + finalDays * 86400000);

        try {
            setIsSubmitting(true);
            setError(null);
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                category,
                color,
                icon: category === 'engineering' ? 'code' : category === 'fitness' ? 'dumbbell' : category === 'learning' ? 'book' : category === 'discipline' ? 'clipboard-check' : 'sparkles',
                targetDays: finalDays,
                startDate: startDateTime.toISOString(),
                targetEndDate: targetEndDateTime.toISOString(),
                rule: rule.trim(),
                tags: finalTags,
                status: editingChallenge ? editingChallenge.status : 'active',
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save challenge');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="neu-card w-full max-w-xl p-6 sm:p-8 bg-[#E0E5EC] relative my-6 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
                    title="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-purple-600 bg-purple-50 shrink-0">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#1a1c35]">
                            {editingChallenge ? 'Edit Challenge' : 'Start a New Challenge'}
                        </h2>
                        <p className="text-xs font-semibold text-[#717699]">
                            Set your target days, rules, and daily commitment
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Challenge Title */}
                    <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                            Challenge Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 100 Days of Code & AI Engineering"
                            className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-semibold"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                            Short Vision / Mantra
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Ship code. Learn AI. Build in public."
                            className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                        />
                    </div>

                    {/* Category Selector */}
                    <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                            Category
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {CATEGORIES.map((cat) => {
                                const IconComponent = cat.icon;
                                const isSelected = category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                            setCategory(cat.id);
                                            setColor(cat.color);
                                        }}
                                        className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold transition-all ${isSelected
                                            ? 'neu-inset text-indigo-700 bg-indigo-50/60 font-black'
                                            : 'neu-button text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        <IconComponent className="w-4 h-4 shrink-0" />
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Duration in Days */}
                    <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                            Target Duration (Days) *
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
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
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isSelected
                                            ? 'neu-button-primary text-white'
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
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isCustomDays
                                    ? 'neu-button-primary text-white'
                                    : 'neu-button text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Custom Days
                            </button>
                        </div>

                        {isCustomDays && (
                            <div className="flex items-center space-x-3 mt-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={customDaysInput}
                                    onChange={(e) => setCustomDaysInput(e.target.value)}
                                    placeholder="e.g. 31, 75, 250"
                                    className="w-32 px-4 py-2 rounded-xl neu-input text-sm font-bold"
                                    required
                                />
                                <span className="text-xs font-bold text-[#717699]">
                                    Total calendar days in sprint
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Start Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl neu-input text-xs font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                                Tags (Comma Separated)
                            </label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="Discipline, Focus, Coding"
                                className="w-full px-4 py-2 rounded-xl neu-input text-xs font-medium"
                            />
                        </div>
                    </div>

                    {/* Challenge Rules */}
                    <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                            Challenge Rule (&quot;What counts as a completed day&quot;)
                        </label>
                        <textarea
                            rows={2}
                            value={rule}
                            onChange={(e) => setRule(e.target.value)}
                            placeholder="e.g. Code for at least 1 hour and learn something new in AI or Software Engineering."
                            className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-medium resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl neu-button text-xs font-bold text-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl neu-button-primary text-xs font-bold text-white shadow-md disabled:opacity-50"
                        >
                            {isSubmitting
                                ? 'Saving...'
                                : editingChallenge
                                    ? 'Update Challenge'
                                    : 'Create & Commit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
