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
