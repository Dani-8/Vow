import React, { useState } from 'react';
import { X, Sparkles, Send, Lightbulb, Trophy, Compass, Shield, BookOpen } from 'lucide-react';
import { FeedCategory, FeedPost } from '../../../../../../types';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (post: Omit<FeedPost, 'id' | 'likesCount' | 'savesCount' | 'createdAt' | 'isLiked' | 'isSaved'>) => void;
    currentUser: { username: string; email?: string } | null;
}

const CATEGORIES: { id: FeedCategory; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'formula', label: 'Formula & Strategy', icon: Lightbulb, desc: 'Rules & frameworks that boost output' },
    { id: 'story', label: 'Journey & Story', icon: BookOpen, desc: 'Personal story of transformation & grit' },
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
            authorBadge: category === 'story' ? 'Storyteller' : 'Community Builder',
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