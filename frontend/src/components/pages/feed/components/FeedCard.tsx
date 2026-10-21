import React from 'react';
import { Flame, Bookmark, Share2, ArrowRight } from 'lucide-react';
import { FeedPost } from '../types';
import { getCategoryBadgeConfig } from './FeedCategoryFilter';

interface FeedCardProps {
    post: FeedPost;
    isLiked: boolean;
    isSaved: boolean;
    isCopied: boolean;
    onToggleLike: (postId: string) => void;
    onToggleSave: (postId: string) => void;
    onShare: (postId: string, title: string) => void;
    onViewDetail: (post: FeedPost) => void;
    onTagClick?: (tag: string) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({
    post,
    isLiked,
    isSaved,
    isCopied,
    onToggleLike,
    onToggleSave,
    onShare,
    onViewDetail,
    onTagClick,
}) => {
    const config = getCategoryBadgeConfig(post.category);
    const BadgeIcon = config.icon;

    // Threshold for true long content: 300 characters OR more than 4 newlines
    const lineCount = (post.content.match(/\n/g) || []).length;
    const isLongContent = post.content.length > 300 || lineCount >= 5;
