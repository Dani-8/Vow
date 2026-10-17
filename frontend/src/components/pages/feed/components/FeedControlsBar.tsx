import React from 'react';
import { TrendingUp, BookmarkCheck, Search } from 'lucide-react';

interface FeedControlsBarProps {
    feedTab: 'all' | 'saved';
    onSelectTab: (tab: 'all' | 'saved') => void;
    totalPostsCount: number;
    savedPostsCount: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const FeedControlsBar: React.FC<FeedControlsBarProps> = ({
    feedTab,
    onSelectTab,
    totalPostsCount,
    savedPostsCount,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-1 neu-inset p-1.5 rounded-2xl bg-[#E0E5EC]/90 border border-white/60 w-fit">
                <button
                    onClick={() => onSelectTab('all')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${feedTab === 'all'
                        ? 'neu-button text-[#549acb] bg-[#E0E5EC] shadow-sm'
                        : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    <TrendingUp className="w-4 h-4" />
                    <span>All Motivation ({totalPostsCount})</span>
                </button>

                <button
                    onClick={() => onSelectTab('saved')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${feedTab === 'saved'
                        ? 'neu-button text-amber-600 bg-[#E0E5EC] shadow-sm'
                        : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    <BookmarkCheck className="w-4 h-4 text-amber-500" />
                    <span>Saved in Vault ({savedPostsCount})</span>
                </button>
            </div>