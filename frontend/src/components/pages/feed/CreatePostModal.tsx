import React, { useState } from 'react';
import { X, Sparkles, Send, Tag, Lightbulb, Trophy, Compass, Shield } from 'lucide-react';
import { FeedCategory, FeedPost } from './types';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (post: Omit<FeedPost, 'id' | 'likesCount' | 'savesCount' | 'createdAt' | 'isLiked' | 'isSaved'>) => void;
    currentUser: { username: string; email?: string } | null;
}

const CATEGORIES: { id: FeedCategory; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'formula', label: 'Formula & Strategy', icon: Lightbulb, desc: 'Rules & frameworks that boost output' },
    { id: 'win', label: 'Milestone & Win', icon: Trophy, desc: 'Streaks, challenges & goals completed' },
    { id: 'insight', label: 'Deep Insight', icon: Compass, desc: 'Lessons learned on focus and discipline' },
    { id: 'discipline', label: 'Habit & Mindset', icon: Shield, desc: 'Principles to stay resilient and locked in' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    currentUser,
}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<FeedCategory>('formula');
    const [tagsInput, setTagsInput] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        const tags = tagsInput
            .split(',')
            .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
            .filter((t) => t.length > 0);

        onSubmit({
            authorName: currentUser?.username || 'Fellow Strategist',
            authorBadge: 'Community Builder',
            category,
            title: title.trim(),
            content: content.trim(),
            tags: tags.length > 0 ? tags : ['mindset', category],
        });

        setTitle('');
        setContent('');
        setTagsInput('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg neu-card p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-2xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full neu-button flex items-center justify-center text-[#717699] hover:text-[#1a1c35] transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl neu-button-primary flex items-center justify-center text-white">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-[#1a1c35]">Share with Community</h2>
                        <p className="text-xs font-semibold text-[#717699]">
                            Post a rule, milestone win, or focus insight
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category Selection */}
                    <div>
                        <label className="text-[11px] font-bold text-[#515777] block mb-1.5 uppercase tracking-wider">
                            Post Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                const isSelected = category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-2.5 rounded-xl text-left transition-all flex items-center space-x-2 ${isSelected
                                            ? 'neu-button border-2 border-[#549acb] bg-sky-50/80 text-[#549acb]'
                                            : 'neu-card bg-[#E0E5EC] hover:bg-[#D8DEE8] text-[#515777]'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#549acb]' : 'text-[#717699]'}`} />
                                        <span className="text-xs font-black truncate">{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-[11px] font-bold text-[#515777] block mb-1 uppercase tracking-wider">
                            Headline / Rule
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Goal + Deadline + Plan = Strategy"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full neu-inset px-4 py-2.5 rounded-xl text-xs font-bold text-[#1a1c35] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#549acb]"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-[11px] font-bold text-[#515777] block mb-1 uppercase tracking-wider">
                            Content & Framework
                        </label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Share the formula, your routine, or the insight that helped you stay disciplined..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full neu-inset p-3 rounded-xl text-xs font-semibold text-[#1a1c35] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#549acb] resize-none"
                        />
                    </div>
