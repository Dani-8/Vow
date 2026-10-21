import React from 'react';
import { Flame, Bookmark, Share2 } from 'lucide-react';
import { FeedPost } from '../../../../../../types';

interface PostActionBarProps {
    post: FeedPost;
    isLiked: boolean;
    isSaved: boolean;
    isCopied: boolean;
    onToggleLike: (postId: string) => void;
    onToggleSave: (postId: string) => void;
    onShare: (postId: string, title: string) => void;
}
