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

export const FeedPostPage: React.FC<FeedPostPageProps> = ({
    post,
    postId,
    allPosts = [],
    onBack,
    isLiked,
    isSaved,
    isCopied,
    onToggleLike,
    onToggleSave,
    onShare,
    onSelectPost,
}) => {
    // Resolve post either from props or by looking up in allPosts
    const currentPost = useMemo(() => {
        if (post) return post;
        if (postId && allPosts.length > 0) {
            return allPosts.find((p) => p.id === postId) || null;
        }
        return null;
    }, [post, postId, allPosts]);
