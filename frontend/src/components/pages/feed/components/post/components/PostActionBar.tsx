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

export const PostActionBar: React.FC<PostActionBarProps> = ({
    post,
    isLiked,
    isSaved,
    isCopied,
    onToggleLike,
    onToggleSave,
    onShare,
}) => {
    return (
        <div className="flex items-center justify-between pt-5 border-t border-slate-200/60">
            <div className="flex items-center space-x-3">
                <button
                    type="button"
                    onClick={() => onToggleLike(post.id)}
                    className={`neu-button px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 ${isLiked
                        ? 'text-rose-600 bg-rose-50 border-rose-300 shadow-inner'
                        : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    <Flame className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{post.likesCount} Respect</span>
                </button>

                <button
                    type="button"
                    onClick={() => onToggleSave(post.id)}
                    className={`neu-button px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 ${
                        isSaved
                            ? 'text-amber-600 bg-amber-50 border-amber-300 shadow-inner'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                    }`}
                >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{isSaved ? 'Saved in Vault' : 'Save to Vault'}</span>
                </button>
            </div>