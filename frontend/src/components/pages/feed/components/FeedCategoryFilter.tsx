import React from 'react';
import { Lightbulb, Trophy, Compass, Shield, BookOpen } from 'lucide-react';
import { FeedCategory } from '../types';

interface FeedCategoryFilterProps {
    selectedCategory: FeedCategory | 'all';
    onSelectCategory: (category: FeedCategory | 'all') => void;
}

export const getCategoryBadgeConfig = (cat: FeedCategory) => {
    switch (cat) {
        case 'formula':
            return {
                label: 'Formula',
                icon: Lightbulb,
                badgeBg: 'text-amber-700 bg-amber-100/90 border-amber-300',
                activeBtn: '!bg-gradient-to-r !from-amber-500 !to-amber-600 !text-white !border-transparent shadow-[0_4px_14px_rgba(245,158,11,0.45)]',
            };
        case 'story':
            return {
                label: 'Story & Journey',
                icon: BookOpen,
                badgeBg: 'text-rose-700 bg-rose-100/90 border-rose-300',
                activeBtn: '!bg-gradient-to-r !from-rose-500 !to-rose-600 !text-white !border-transparent shadow-[0_4px_14px_rgba(244,63,94,0.45)]',
            };
        case 'win':
            return {
                label: 'Milestone Win',
                icon: Trophy,
                badgeBg: 'text-emerald-700 bg-emerald-100/90 border-emerald-300',
                activeBtn: '!bg-gradient-to-r !from-emerald-500 !to-emerald-600 !text-white !border-transparent shadow-[0_4px_14px_rgba(16,185,129,0.45)]',
            };
        case 'insight':
            return {
                label: 'Focus Insight',
                icon: Compass,
                badgeBg: 'text-sky-700 bg-sky-100/90 border-sky-300',
                activeBtn: '!bg-gradient-to-r !from-sky-500 !to-sky-600 !text-white !border-transparent shadow-[0_4px_14px_rgba(14,165,233,0.45)]',
            };
        case 'discipline':
            return {
                label: 'Discipline Rule',
                icon: Shield,
                badgeBg: 'text-purple-700 bg-purple-100/90 border-purple-300',
                activeBtn: '!bg-gradient-to-r !from-purple-500 !to-purple-600 !text-white !border-transparent shadow-[0_4px_14px_rgba(168,85,247,0.45)]',
            };
    }
};
