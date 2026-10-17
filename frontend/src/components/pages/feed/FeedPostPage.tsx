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
