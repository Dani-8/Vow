import React, { useState, useEffect, useMemo } from 'react';
import {
    X,
    Target,
    Code,
    Dumbbell,
    BookOpen,
    ClipboardCheck,
    Sparkles,
    Calendar,
    Check,
    Clock,
    Flame,
} from 'lucide-react';
import { Challenge } from '../../../../types';

interface CreateChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (challengeData: Partial<Challenge>) => Promise<void>;
    editingChallenge?: Challenge | null;
}

const CATEGORIES = [
    { id: 'engineering', label: 'Engineering', icon: Code, defaultColor: '#549acb' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, defaultColor: '#10b981' },
    { id: 'learning', label: 'Learning', icon: BookOpen, defaultColor: '#f59e0b' },
    { id: 'discipline', label: 'Discipline', icon: ClipboardCheck, defaultColor: '#f43f5e' },
    { id: 'mindfulness', label: 'Mindfulness', icon: Sparkles, defaultColor: '#6366f1' },
];

const ACCENT_COLORS = [
    { id: 'blue', label: 'Brand Blue', hex: '#549acb' },
    { id: 'indigo', label: 'Indigo', hex: '#6366f1' },
    { id: 'emerald', label: 'Emerald', hex: '#10b981' },
    { id: 'rose', label: 'Rose', hex: '#f43f5e' },
    { id: 'amber', label: 'Amber', hex: '#f59e0b' },
    { id: 'violet', label: 'Violet', hex: '#8b5cf6' },
    { id: 'orange', label: 'Orange', hex: '#f0784b' },
    { id: 'cyan', label: 'Cyan', hex: '#06b6d4' },
    { id: 'pink', label: 'Pink', hex: '#e45c97' },
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
    const [color, setColor] = useState('#549acb');
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
            setColor(editingChallenge.color || '#549acb');
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
            setColor('#549acb');
            setTargetDays(100);
            setCustomDaysInput('100');
            setIsCustomDays(false);
            setStartDate(new Date().toISOString().split('T')[0]);
            setRule('');
            setTagsInput('Discipline, Focus, Growth');
        }
        setError(null);
    }, [editingChallenge, isOpen]);

    const activeDaysCount = useMemo(() => {
        return isCustomDays ? Math.max(1, parseInt(customDaysInput, 10) || 30) : targetDays;
    }, [isCustomDays, customDaysInput, targetDays]);

    const calculatedDates = useMemo(() => {
        const startObj = new Date(startDate || new Date().toISOString().split('T')[0]);
        if (isNaN(startObj.getTime())) {
            const today = new Date();
            return {
                startStr: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                endStr: new Date(today.getTime() + activeDaysCount * 86400000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                }),
            };
        }
        const endObj = new Date(startObj.getTime() + activeDaysCount * 86400000);
        return {
            startStr: startObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            endStr: endObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
    }, [startDate, activeDaysCount]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Challenge title is required');
            return;
        }

        const finalDays = activeDaysCount;
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
                icon:
                    category === 'engineering'
                        ? 'code'
                        : category === 'fitness'
                            ? 'dumbbell'
                            : category === 'learning'
                                ? 'book'
                                : category === 'discipline'
                                    ? 'clipboard-check'
                                    : 'sparkles',
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
            <div className="neu-card w-full max-w-4xl p-6 sm:p-8 bg-[#E0E5EC] relative my-6 max-h-[92vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2.5 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35] transition-colors"
                    title="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="flex items-center space-x-4 mb-7 pb-5 border-b border-slate-300/70">
                    <div
                        className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center shrink-0 shadow-sm"
                        style={{ color: color, backgroundColor: `${color}18` }}
                    >
                        <Target className="w-6 h-6" style={{ color: color }} />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#1a1c35] tracking-tight">
                            {editingChallenge ? 'Edit Challenge' : 'Start a New Challenge'}
                        </h2>
                        <p className="text-xs font-semibold text-[#717699] mt-0.5">
                            Define your goals, track daily consistency, and reach milestones.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-3.5 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 2-Column Split Layout with Center Divider */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
                        {/* LEFT COLUMN: Identity & Focus */}
                        <div className="space-y-5 md:pr-6 md:border-r border-slate-300/80">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                    1. Identity & Theme
                                </h3>
                                <span className="text-[10px] font-bold text-[#717699]">Core Setup</span>
                            </div>

                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                    Challenge Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. 100 Days of Code & AI"
                                    className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-bold"
                                    required
                                />
                            </div>

                            {/* Description / Mantra */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                    Short Vision / Mantra
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g. Ship code. Learn AI. Build in public."
                                    className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-medium"
                                />
                            </div>

                            {/* Category Selector */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                    Category
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {CATEGORIES.map((cat) => {
                                        const IconComponent = cat.icon;
                                        const isSelected = category === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    setCategory(cat.id);
                                                    if (!editingChallenge) {
                                                        setColor(cat.defaultColor);
                                                    }
                                                }}
                                                className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold transition-all ${isSelected
                                                    ? 'neu-inset text-[#1a1c35] font-black'
                                                    : 'neu-button text-slate-600 hover:text-slate-900'
                                                    }`}
                                            >
                                                <IconComponent className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{cat.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Accent Theme Color */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                        Accent Theme Color
                                    </label>
                                    <span className="text-[10px] font-bold text-[#717699]">
                                        Active matrix & badge
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3 p-2.5 rounded-xl neu-inset bg-[#E0E5EC]/60 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-nowrap">
                                    {ACCENT_COLORS.map((c) => {
                                        const isSelected = color === c.hex || color === c.id;
                                        return (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => setColor(c.hex)}
                                                title={c.label}
                                                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-all cursor-pointer ${isSelected
                                                    ? 'ring-2 ring-offset-2 ring-slate-600 scale-110 shadow-sm'
                                                    : 'opacity-75 hover:opacity-100 hover:scale-105'
                                                    }`}
                                                style={{ backgroundColor: c.hex }}
                                            >
                                                {isSelected && (
                                                    <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" strokeWidth={3} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                    Tags (Comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                    placeholder="Discipline, Focus, Coding"
                                    className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-medium"
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Commitment & Timeline */}
                        <div className="space-y-5 md:pl-2">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                    2. Commitment & Timeline
                                </h3>
                                <span className="text-[10px] font-bold text-[#717699]">Schedule & Rules</span>
                            </div>

                            {/* Duration in Days */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                    Target Duration (Days) *
                                </label>
                                <div className="flex flex-wrap gap-2.5">
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
                                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${isSelected
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
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${isCustomDays
                                            ? 'neu-button-primary text-white shadow-sm'
                                            : 'neu-button text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        Custom
                                    </button>
                                </div>

                                {isCustomDays && (
                                    <div className="flex items-center space-x-3 mt-3 pt-1">
                                        <input
                                            type="number"
                                            min="1"
                                            max="1000"
                                            value={customDaysInput}
                                            onChange={(e) => setCustomDaysInput(e.target.value)}
                                            placeholder="e.g. 45"
                                            className="w-28 px-3.5 py-2 rounded-xl neu-input text-xs font-bold"
                                            required
                                        />
                                        <span className="text-[11px] font-bold text-[#717699]">
                                            Total custom calendar days
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Start Date */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-bold"
                                />
                            </div>

                            {/* Date Summary Card Preview */}
                            <div className="neu-card p-3.5 rounded-xl bg-[#E0E5EC] space-y-2 border border-slate-300/40">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" style={{ color: color }} />
                                        <span>Sprint Window Preview</span>
                                    </div>
                                    <span
                                        className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full neu-inset"
                                        style={{ color: color, backgroundColor: `${color}18` }}
                                    >
                                        {activeDaysCount} Days Total
                                    </span>
                                </div>
                                <div className="text-[11px] font-semibold text-[#717699] flex items-center justify-between pt-1 border-t border-slate-200/60">
                                    <span>Starts: <strong className="text-slate-800 ml-1">{calculatedDates.startStr}</strong></span>
                                    <span>Target Finish: <strong className="text-slate-800 ml-1">{calculatedDates.endStr}</strong></span>
                                </div>
                            </div>

                            {/* Challenge Rules */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                    Challenge Rule (&quot;What counts as completed&quot;)
                                </label>
                                <textarea
                                    rows={2}
                                    value={rule}
                                    onChange={(e) => setRule(e.target.value)}
                                    placeholder="e.g. Work 1 hour minimum and post your daily reflection log."
                                    className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-medium resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-5 border-t border-slate-300/70 flex items-center justify-end space-x-3.5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl neu-button text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-7 py-2.5 rounded-xl neu-button-primary text-xs font-bold text-white shadow-md disabled:opacity-50 transition-transform active:scale-95"
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
