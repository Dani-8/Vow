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