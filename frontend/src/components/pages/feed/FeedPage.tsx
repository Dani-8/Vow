import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { User } from '../../../types';
import { FeedPost } from './types';
import { useFeedData } from './hooks/useFeedData';
import { FeedCommunityBanner } from './components/FeedCommunityBanner';
import { FeedControlsBar } from './components/FeedControlsBar';
import { FeedCategoryFilter } from './components/FeedCategoryFilter';
import { FeedCard } from './components/FeedCard';
import { CreatePostModal } from './components/CreatePostModal';

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

            {/* Posts Stream */}
            {displayedPosts.length === 0 ? (
                <div className="neu-inset p-12 rounded-3xl text-center space-y-3 bg-[#E0E5EC]/80 border border-white/60">
                    <div className="w-12 h-12 mx-auto rounded-2xl neu-button flex items-center justify-center text-[#717699]">
                        <Bookmark className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-[#1a1c35]">
                        {feedTab === 'saved' ? 'No Saved Posts in Your Vault Yet' : 'No Motivation Posts Found'}
                    </h3>
                    <p className="text-xs font-semibold text-[#717699] max-w-sm mx-auto">
                        {feedTab === 'saved'
                            ? 'Click the bookmark icon on any post in the feed to save key formulas and rules here.'
                            : 'Try adjusting your search query or category filters, or publish a new framework.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedPosts.map((post) => (
                        <FeedCard
                            key={post.id}
                            post={post}
                            isLiked={likedIds.includes(post.id)}
                            isSaved={savedIds.includes(post.id)}
                            isCopied={copiedId === post.id}
                            onToggleLike={handleToggleLike}
                            onToggleSave={handleToggleSave}
                            onShare={handleShare}
                            onViewDetail={handleOpenPost}
                            onTagClick={(tag) => setSearchQuery(tag)}
                        />
                    ))}
                </div>
            )}