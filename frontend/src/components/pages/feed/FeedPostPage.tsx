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

    if (!currentPost) {
        return (
            <div className="w-full space-y-6 pb-8 animate-in fade-in duration-300">
                <button
                    onClick={onBack}
                    className="neu-button px-4 py-2 rounded-xl text-xs font-bold text-[#515777] hover:text-[#1a1c35] flex items-center space-x-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Mindset Feed</span>
                </button>
                <div className="neu-inset p-12 rounded-3xl text-center space-y-3 bg-[#E0E5EC]/80 border border-white/60">
                    <h3 className="text-base font-black text-[#1a1c35]">Post Not Found</h3>
                    <p className="text-xs font-semibold text-[#717699]">
                        This post may have been removed or the link is expired.
                    </p>
                </div>
            </div>
        );
    }

    const config = getCategoryBadgeConfig(currentPost.category);
    const BadgeIcon = config.icon;

    // Related posts in same category
    const relatedPosts = allPosts
        .filter((p) => p.id !== currentPost.id && p.category === currentPost.category)
        .slice(0, 3);

    return (
        <div className="w-full space-y-6 pb-8 animate-in fade-in duration-300">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="neu-button px-4 py-2.5 rounded-2xl text-xs font-black text-[#515777] hover:text-[#1a1c35] flex items-center space-x-2 transition-all hover:scale-102"
                >
                    <ArrowLeft className="w-4 h-4 text-[#549acb]" />
                    <span>Back to Feed Stream</span>
                </button>

                {/* Category Pill */}
                <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-2 border shadow-xs ${config.badgeBg}`}>
                    <BadgeIcon className="w-4 h-4" />
                    <span>{config.label}</span>
                </span>
            </div>

            {/* Main Post Card Hero */}
            <div className="neu-card p-6 sm:p-10 bg-[#E0E5EC] rounded-3xl border border-white/70 shadow-xl space-y-6 text-left">
                {/* Hero Content (Author info, date, title, formatted story/content, tags) */}
                <PostHeroCard post={currentPost} />

                {/* Bottom Action Bar (Respect/Flame, Save to Vault, Share) */}
                <PostActionBar
                    post={currentPost}
                    isLiked={isLiked}
                    isSaved={isSaved}
                    isCopied={isCopied}
                    onToggleLike={onToggleLike}
                    onToggleSave={onToggleSave}
                    onShare={onShare}
                />
            </div>
