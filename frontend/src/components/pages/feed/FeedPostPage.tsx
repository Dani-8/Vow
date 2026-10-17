import React, { useMemo } from 'react';
import { ArrowLeft, Flame, Bookmark, Share2, Calendar, Sparkles, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';
import { FeedPost } from './types';
import { getCategoryBadgeConfig } from './components/FeedCategoryFilter';

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
