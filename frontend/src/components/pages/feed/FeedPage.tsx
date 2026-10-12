import React, { useState, useEffect, useMemo } from 'react';
import {
    Sparkles,
    Flame,
    Bookmark,
    BookmarkCheck,
    Share2,
    Plus,
    Filter,
    Search,
    Lightbulb,
    Trophy,
    Compass,
    Shield,
    CheckCircle2,
    MessageSquare,
    TrendingUp,
} from 'lucide-react';
import { FeedPost, FeedCategory, INITIAL_FEED_POSTS } from './types';
import { CreatePostModal } from './CreatePostModal';
import { User } from '../../../types';

interface FeedPageProps {
    currentUser: User | null;
    onNavigateToView?: (view: any, param?: string) => void;
}

const STORAGE_POSTS_KEY = 'app_community_feed_posts';
const STORAGE_SAVED_IDS_KEY = 'app_community_saved_post_ids';
const STORAGE_LIKED_IDS_KEY = 'app_community_liked_post_ids';

export const FeedPage: React.FC<FeedPageProps> = ({ currentUser, onNavigateToView }) => {
    // 1. Posts list
    const [posts, setPosts] = useState<FeedPost[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_POSTS_KEY);
            if (raw) return JSON.parse(raw);
            return INITIAL_FEED_POSTS;
        } catch {
            return INITIAL_FEED_POSTS;
        }
    });

    // 2. Saved post IDs (The user's Saved Vault)
    const [savedIds, setSavedIds] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_SAVED_IDS_KEY);
            return raw ? JSON.parse(raw) : ['post_reel_formula']; // default save the popular formula
        } catch {
            return ['post_reel_formula'];
        }
    });

    // 3. Liked post IDs
    const [likedIds, setLikedIds] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_LIKED_IDS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    // Feed Navigation Sub-Tab: "All Posts" vs "Saved Vault"
    const [feedTab, setFeedTab] = useState<'all' | 'saved'>('all');
    const [selectedCategory, setSelectedCategory] = useState<FeedCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Sync to storage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
        } catch (e) {
            console.error('Failed to sync posts', e);
        }
    }, [posts]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_SAVED_IDS_KEY, JSON.stringify(savedIds));
        } catch (e) {
            console.error('Failed to sync saved posts', e);
        }
    }, [savedIds]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_LIKED_IDS_KEY, JSON.stringify(likedIds));
        } catch (e) {
            console.error('Failed to sync liked posts', e);
        }
    }, [likedIds]);

    // Handle Like Toggle
    const handleToggleLike = (postId: string) => {
        const isCurrentlyLiked = likedIds.includes(postId);
        const newLiked = isCurrentlyLiked
            ? likedIds.filter((id) => id !== postId)
            : [...likedIds, postId];
        setLikedIds(newLiked);

        setPosts((prev) =>
            prev.map((p) => {
                if (p.id === postId) {
                    return {
                        ...p,
                        likesCount: isCurrentlyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1,
                    };
                }
                return p;
            })
        );
    };

    // Handle Save to Vault Toggle
    const handleToggleSave = (postId: string) => {
        const isCurrentlySaved = savedIds.includes(postId);
        const newSaved = isCurrentlySaved
            ? savedIds.filter((id) => id !== postId)
            : [...savedIds, postId];
        setSavedIds(newSaved);

        setPosts((prev) =>
            prev.map((p) => {
                if (p.id === postId) {
                    return {
                        ...p,
                        savesCount: isCurrentlySaved ? Math.max(0, p.savesCount - 1) : p.savesCount + 1,
                    };
                }
                return p;
            })
        );
    };

    // Handle Share / Copy link
    const handleShare = (postId: string, title: string) => {
        try {
            navigator.clipboard.writeText(`${title} - Shared from Mindset Feed`);
            setCopiedId(postId);
            setTimeout(() => setCopiedId(null), 2500);
        } catch {
            // fallback
        }
    };

    // Handle New Post Creation
    const handleCreatePost = (newPostData: Omit<FeedPost, 'id' | 'likesCount' | 'savesCount' | 'createdAt' | 'isLiked' | 'isSaved'>) => {
        const newPost: FeedPost = {
            ...newPostData,
            id: `post_${Date.now()}`,
            likesCount: 1,
            savesCount: 0,
            createdAt: new Date().toISOString(),
        };
        // Auto-like author's own post
        setLikedIds((prev) => [...prev, newPost.id]);
        setPosts((prev) => [newPost, ...prev]);
    };

    // Filtered Posts
    const displayedPosts = useMemo(() => {
        return posts.filter((post) => {
            // Tab filter (All vs Saved)
            if (feedTab === 'saved' && !savedIds.includes(post.id)) {
                return false;
            }
            // Category filter
            if (selectedCategory !== 'all' && post.category !== selectedCategory) {
                return false;
            }
            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesTitle = post.title.toLowerCase().includes(q);
                const matchesContent = post.content.toLowerCase().includes(q);
                const matchesAuthor = post.authorName.toLowerCase().includes(q);
                const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q));
                if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesTags) {
                    return false;
                }
            }
            return true;
        });
    }, [posts, feedTab, savedIds, selectedCategory, searchQuery]);

    const getCategoryBadge = (cat: FeedCategory) => {
        switch (cat) {
            case 'formula':
                return {
                    label: 'Formula',
                    icon: Lightbulb,
                    color: 'text-amber-600 bg-amber-50/80 border-amber-200',
                };
            case 'win':
                return {
                    label: 'Milestone Win',
                    icon: Trophy,
                    color: 'text-emerald-600 bg-emerald-50/80 border-emerald-200',
                };
            case 'insight':
                return {
                    label: 'Focus Insight',
                    icon: Compass,
                    color: 'text-sky-600 bg-sky-50/80 border-sky-200',
                };
            case 'discipline':
                return {
                    label: 'Discipline Rule',
                    icon: Shield,
                    color: 'text-purple-600 bg-purple-50/80 border-purple-200',
                };
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300">
            {/* Header Hero Banner */}
            <div className="neu-card p-6 sm:p-8 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-[#549acb] border border-sky-300">
                            Community & Mindset
                        </span>
                        <span className="text-xs font-bold text-[#717699]">
                            {posts.length} Shared Wisdom Blocks
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#1a1c35] tracking-tight">
                        Discipline & Strategy Feed
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold text-[#717699] max-w-xl">
                        Formulas, rules, and milestone breakthroughs from disciplined builders. Save the best frameworks to your personal vault.
                    </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="neu-button-primary px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center space-x-2 text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Post Framework</span>
                    </button>
                </div>
            </div>

            {/* Navigation Switcher: [ All Feed ] vs [ Saved Vault ] */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-1 neu-inset p-1.5 rounded-2xl bg-[#E0E5EC]/90 border border-white/60 w-fit">
                    <button
                        onClick={() => setFeedTab('all')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${feedTab === 'all'
                            ? 'neu-button text-[#549acb] bg-[#E0E5EC] shadow-sm'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        <TrendingUp className="w-4 h-4" />
                        <span>All Posts</span>
                    </button>

                    <button
                        onClick={() => setFeedTab('saved')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${feedTab === 'saved'
                            ? 'neu-button text-amber-600 bg-[#E0E5EC] shadow-sm'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        <BookmarkCheck className="w-4 h-4 text-amber-500" />
                        <span>Saved Vault ({savedIds.length})</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-xs w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717699]" />
                    <input
                        type="text"
                        placeholder="Search formulas, tags, mindset..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full neu-inset pl-9 pr-4 py-2 rounded-xl text-xs font-bold text-[#1a1c35] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#549acb]"
                    />
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${selectedCategory === 'all'
                        ? 'neu-button-primary text-white shadow-sm'
                        : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    All Categories
                </button>

                {(['formula', 'win', 'insight', 'discipline'] as FeedCategory[]).map((cat) => {
                    const badge = getCategoryBadge(cat);
                    const Icon = badge.icon;
                    const isSelected = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all ${isSelected
                                ? 'neu-button text-[#549acb] bg-[#E0E5EC] border-2 border-[#549acb] font-black'
                                : 'neu-card bg-[#E0E5EC] hover:bg-[#D8DEE8] text-[#515777]'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{badge.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Posts Stream */}
            {displayedPosts.length === 0 ? (
                <div className="neu-inset p-12 rounded-3xl text-center space-y-3 bg-[#E0E5EC]/80 border border-white/60">
                    <div className="w-12 h-12 mx-auto rounded-2xl neu-button flex items-center justify-center text-[#717699]">
                        <Bookmark className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-[#1a1c35]">
                        {feedTab === 'saved' ? 'No Saved Posts in Your Vault Yet' : 'No Posts Found'}
                    </h3>
                    <p className="text-xs font-semibold text-[#717699] max-w-sm mx-auto">
                        {feedTab === 'saved'
                            ? 'Click the bookmark icon on any post in the feed to save key formulas and rules here.'
                            : 'Try adjusting your search query or category filters, or publish a new framework.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedPosts.map((post) => {
                        const isLiked = likedIds.includes(post.id);
                        const isSaved = savedIds.includes(post.id);
                        const badge = getCategoryBadge(post.category);
                        const BadgeIcon = badge.icon;

                        return (
                            <article
                                key={post.id}
                                className="neu-card p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all space-y-4 text-left"
                            >
                                {/* Post Top: Author Info & Category Badge */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-2xl neu-inset bg-gradient-to-tr from-sky-500/20 to-purple-500/20 flex items-center justify-center font-black text-sm text-[#1a1c35] border border-white/60">
                                            {post.authorName.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h4 className="text-sm font-black text-[#1a1c35]">
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
                                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 border ${badge.color}`}>
                                        <BadgeIcon className="w-3.5 h-3.5" />
                                        <span>{badge.label}</span>
                                    </span>
                                </div>

                                {/* Post Title & Content */}
                                <div className="space-y-2">
                                    <h3 className="text-base sm:text-lg font-black text-[#1a1c35]">
                                        {post.title}
                                    </h3>
                                    <div className="neu-inset p-4 rounded-2xl bg-white/40 border border-white/60">
                                        <p className="text-xs sm:text-sm font-medium text-[#29335a] leading-relaxed whitespace-pre-line">
                                            {post.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                onClick={() => setSearchQuery(tag)}
                                                className="cursor-pointer text-[10px] font-bold text-[#549acb] hover:text-[#3d84b5] bg-sky-50/60 px-2 py-0.5 rounded-lg border border-sky-200/50"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Bottom Action Bar: Like, Save to Vault, Share */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                                    <div className="flex items-center space-x-2">
                                        {/* Like / Flame Reaction */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleLike(post.id)}
                                            className={`neu-button px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${isLiked
                                                ? 'text-rose-600 bg-rose-50/80 border-rose-300 font-black shadow-inner'
                                                : 'text-[#717699] hover:text-[#1a1c35]'
                                                }`}
                                            title={isLiked ? 'Unlike' : 'Give Respect'}
                                        >
                                            <Flame className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                            <span>{post.likesCount}</span>
                                        </button>

                                        {/* Save to Vault */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleSave(post.id)}
                                            className={`neu-button px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${isSaved
                                                ? 'text-amber-600 bg-amber-50/80 border-amber-300 font-black shadow-inner'
                                                : 'text-[#717699] hover:text-[#1a1c35]'
                                                }`}
                                            title={isSaved ? 'Saved in Vault' : 'Save to Vault'}
                                        >
                                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                                            <span>{isSaved ? 'Saved in Vault' : 'Save'}</span>
                                        </button>
                                    </div>

                                    {/* Share Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleShare(post.id, post.title)}
                                        className="neu-button px-3 py-1.5 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1.5"
                                        title="Copy quote"
                                    >
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>{copiedId === post.id ? 'Copied!' : 'Share'}</span>
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreatePost}
                currentUser={currentUser}
            />
        </div>
    );
};
