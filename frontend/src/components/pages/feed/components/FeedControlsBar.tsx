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
