import React from 'react';
import { Calendar } from 'lucide-react';
import { FeedPost } from '../../../../../../types';
import { getCategoryBadgeConfig } from '../../main/components/FeedCategoryFilter';

interface PostHeroCardProps {
    post: FeedPost;
}

export const PostHeroCard: React.FC<PostHeroCardProps> = ({ post }) => {
    const config = getCategoryBadgeConfig(post.category);

    return (
        <div className="space-y-4">
            {/* Author Info & Date */}
            <div className="flex items-center space-x-4 pb-4 border-b border-slate-200/60">
                <div className="w-14 h-14 rounded-2xl neu-inset bg-gradient-to-tr from-sky-500/25 to-purple-500/25 flex items-center justify-center font-black text-lg text-[#1a1c35] border border-white/70 shrink-0">
                    {post.authorName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-base sm:text-lg font-black text-[#1a1c35]">
                            {post.authorName}
                        </h3>
                        {post.authorBadge && (
                            <span className="text-[10px] font-extrabold text-[#549acb] bg-sky-50/90 px-2.5 py-0.5 rounded-md neu-inset border border-sky-200/60">
                                {post.authorBadge}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-semibold text-[#717699] flex items-center space-x-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                    </span>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a1c35] tracking-tight leading-tight">
                {post.title}
            </h1>