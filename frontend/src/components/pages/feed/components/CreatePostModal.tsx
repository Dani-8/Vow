import React, { useState } from 'react';
import { X, Sparkles, Send, Lightbulb, Trophy, Compass, Shield, BookOpen } from 'lucide-react';
import { FeedCategory, FeedPost } from '../types';

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
