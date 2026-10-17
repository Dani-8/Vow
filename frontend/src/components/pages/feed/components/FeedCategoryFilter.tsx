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

const CATEGORIES: FeedCategory[] = ['formula', 'story', 'win', 'insight', 'discipline'];

export const FeedCategoryFilter: React.FC<FeedCategoryFilterProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
            {/* All Categories Button */}
            <button
                onClick={() => onSelectCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${selectedCategory === 'all'
                        ? 'neu-button-primary !text-white shadow-[0_4px_14px_rgba(84,154,203,0.45)] scale-102'
                        : 'neu-button text-[#717699] hover:text-[#1a1c35] bg-[#E0E5EC]'
                    }`}
            >
                All Categories
            </button>

            {CATEGORIES.map((cat) => {
                const config = getCategoryBadgeConfig(cat);
                const Icon = config.icon;
                const isSelected = selectedCategory === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs flex items-center space-x-2 whitespace-nowrap transition-all font-bold ${isSelected
                                ? `${config.activeBtn} font-black scale-102`
                                : 'neu-button text-[#515777] hover:text-[#1a1c35] bg-[#E0E5EC]'
                            }`}
                    >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'stroke-[2.5]' : ''}`} />
                        <span>{config.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
