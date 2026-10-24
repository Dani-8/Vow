import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FeedPost } from '../../../types';
import { getCategoryBadgeConfig } from './components/main/components/FeedCategoryFilter';
import { PostHeroCard } from './components/post/components/PostHeroCard';
import { PostActionBar } from './components/post/components/PostActionBar';
import { RelatedPostsSection } from './components/post/components/RelatedPostsSection';

interface FeedPostPageProps {
    post: FeedPost | null;
    postId?: string;
    allPosts?: FeedPost[];
    onBack: () => void;
    isLiked: boolean;
    isSaved: boolean;
    isCopied: boolean;
    onToggleLike: (postId: string) => void;
    onToggleSave: (postId: string) => void;
    onShare: (postId: string, title: string) => void;
    onSelectPost?: (post: FeedPost) => void;
}
