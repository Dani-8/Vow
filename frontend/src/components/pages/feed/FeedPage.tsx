import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { User, FeedPost } from '../../../types';
import { useFeedData } from './components/main/hooks/useFeedData';
import { FeedCommunityBanner } from './components/main/components/FeedCommunityBanner';
import { FeedControlsBar } from './components/main/components/FeedControlsBar';
import { FeedCategoryFilter } from './components/main/components/FeedCategoryFilter';
import { FeedCard } from './components/main/components/FeedCard';
import { CreatePostModal } from './components/main/components/CreatePostModal';

interface FeedPageProps {
    currentUser: User | null;
    onNavigateToView?: (view: any, param?: string) => void;
    onViewPostPage?: (post: FeedPost) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({ currentUser, onNavigateToView, onViewPostPage }) => {
    const {
        posts,
        displayedPosts,
        savedIds,
        likedIds,
        feedTab,
        setFeedTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        copiedId,
        handleToggleLike,
        handleToggleSave,
        handleShare,
        handleCreatePost,
    } = useFeedData();

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleOpenPost = (post: FeedPost) => {
        if (onViewPostPage) {
            onViewPostPage(post);
        } else if (onNavigateToView) {
            onNavigateToView('feed-post', post.id);
        }
    };

    return (
        <div className="w-full space-y-6 pb-8 animate-in fade-in duration-300">
            {/* Purpose & Community Guidelines Banner */}
            <FeedCommunityBanner onOpenCreateModal={() => setIsCreateOpen(true)} />

            {/* Sub-tab Navigation (All vs Saved Vault) and Search */}
            <FeedControlsBar
                feedTab={feedTab}
                onSelectTab={setFeedTab}
                totalPostsCount={posts.length}
                savedPostsCount={savedIds.length}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Category Filter Pills (Includes Formula, Story & Journey, Win, Insight, Discipline) */}
            <FeedCategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
