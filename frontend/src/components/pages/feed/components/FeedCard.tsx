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

    return (
        <article className="neu-card p-5 sm:p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all space-y-3.5 text-left">
            {/* Top Author & Badge Header */}
            <div className="flex items-center justify-between">
                <div
                    onClick={() => onViewDetail(post)}
                    className="flex items-center space-x-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-2xl neu-inset bg-gradient-to-tr from-sky-500/20 to-purple-500/20 flex items-center justify-center font-black text-sm text-[#1a1c35] border border-white/60 group-hover:scale-105 transition-transform">
                        {post.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-black text-[#1a1c35] group-hover:text-[#549acb] transition-colors">
                                {post.authorName}
                            </h4>
                            {post.authorBadge && (
                                <span className="text-[10px] font-bold text-[#717699] bg-white/60 px-2 py-0.5 rounded-md neu-inset">
                                    {post.authorBadge}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-semibold text-[#717699] block mt-0.5">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                </div>

                {/* Category Pill */}
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 border ${config.badgeBg}`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{config.label}</span>
                </span>
            </div>

            {/* Post Title - Clickable */}
            <h3
                onClick={() => onViewDetail(post)}
                className="text-base sm:text-lg font-black text-[#1a1c35] cursor-pointer hover:text-[#549acb] transition-colors"
            >
                {post.title}
            </h3>

            {/* Post Content Box */}
            <div
                onClick={() => (isLongContent ? onViewDetail(post) : undefined)}
                className={`neu-inset p-4 rounded-2xl bg-white/40 border border-white/60 relative ${isLongContent ? 'cursor-pointer group' : ''
                    }`}
            >
                {isLongContent ? (
                    <>
                        <div className="max-h-36 overflow-hidden relative">
                            <p className="text-xs sm:text-sm font-medium text-[#29335a] leading-relaxed whitespace-pre-line">
                                {post.content}
                            </p>

                            {/* Gradient fade overlay ONLY when content exceeds fixed height */}
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#E0E5EC] via-[#E0E5EC]/85 to-transparent pointer-events-none" />
                        </div>