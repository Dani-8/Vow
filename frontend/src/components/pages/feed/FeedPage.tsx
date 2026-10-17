import React, { useState, useEffect, useMemo } from 'react';
import {
    Sparkles,
    Flame,
    Bookmark,
    BookmarkCheck,
    Share2,
    Plus,
    Search,
    Lightbulb,
    Trophy,
    Compass,
    Shield,
    TrendingUp,
    Info,
    HeartHandshake,
} from 'lucide-react';
import { FeedPost, FeedCategory, INITIAL_FEED_POSTS } from './types';
import { CreatePostModal } from './CreatePostModal';
import { User } from '../../../types';
import { api } from '../../../api';

interface FeedPageProps {
    currentUser: User | null;
    onNavigateToView?: (view: any, param?: string) => void;
}

const STORAGE_POSTS_KEY = 'app_community_feed_posts';
const STORAGE_SAVED_IDS_KEY = 'app_community_saved_post_ids';
const STORAGE_LIKED_IDS_KEY = 'app_community_liked_post_ids';

export const FeedPage: React.FC<FeedPageProps> = ({ currentUser, onNavigateToView }) => {
    // 1. Posts list (synced with backend / fallback to initial)
    const [posts, setPosts] = useState<FeedPost[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_POSTS_KEY);
            if (raw) return JSON.parse(raw);
            return INITIAL_FEED_POSTS;
        } catch {
            return INITIAL_FEED_POSTS;
        }
    });

    // Fetch live posts from backend on mount
    useEffect(() => {
        let isMounted = true;
        api.getFeedPosts()
            .then((res) => {
                if (isMounted && res.posts && Array.isArray(res.posts) && res.posts.length > 0) {
                    setPosts(res.posts);
                    localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(res.posts));
                }
            })
            .catch((err) => {
                console.warn('Backend feed fetch warning (using cache):', err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Saved post IDs (User's Vault)
    const [savedIds, setSavedIds] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_SAVED_IDS_KEY);
            return raw ? JSON.parse(raw) : ['post_reel_formula'];
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

    // Sync saved & liked to storage
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
    const handleToggleLike = async (postId: string) => {
        const isCurrentlyLiked = likedIds.includes(postId);
        const newLiked = isCurrentlyLiked
            ? likedIds.filter((id) => id !== postId)
            : [...likedIds, postId];
        setLikedIds(newLiked);

        // Optimistic UI update
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

        // Sync with backend API
        try {
            await api.likeFeedPost(postId, !isCurrentlyLiked);
        } catch (e) {
            console.warn('Could not sync like with backend:', e);
        }
    };

    // Handle Save to Vault Toggle
    const handleToggleSave = async (postId: string) => {
        const isCurrentlySaved = savedIds.includes(postId);
        const newSaved = isCurrentlySaved
            ? savedIds.filter((id) => id !== postId)
            : [...savedIds, postId];
        setSavedIds(newSaved);

        // Optimistic UI update
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

        // Sync with backend API
        try {
            await api.saveFeedPost(postId, !isCurrentlySaved);
        } catch (e) {
            console.warn('Could not sync save with backend:', e);
        }
    };

    // Handle Share / Copy link
    const handleShare = (postId: string, title: string) => {
        try {
            navigator.clipboard.writeText(`${title} - Shared from Vow Mindset Feed`);
            setCopiedId(postId);
            setTimeout(() => setCopiedId(null), 2500);
        } catch {
            // fallback
        }
    };

    // Handle New Post Creation
    const handleCreatePost = async (newPostData: Omit<FeedPost, 'id' | 'likesCount' | 'savesCount' | 'createdAt' | 'isLiked' | 'isSaved'>) => {
        const localId = `post_${Date.now()}`;
        const newPost: FeedPost = {
            ...newPostData,
            id: localId,
            likesCount: 1,
            savesCount: 0,
            createdAt: new Date().toISOString(),
        };

        // Optimistic update
        setLikedIds((prev) => [...prev, localId]);
        setPosts((prev) => [newPost, ...prev]);

        // Sync with backend
        try {
            const res = await api.createFeedPost(newPostData);
            if (res.post) {
                setPosts((prev) => [res.post, ...prev.filter((p) => p.id !== localId)]);
            }
        } catch (e) {
            console.warn('Could not sync post with backend:', e);
        }
    };

    // Filtered Posts
    const displayedPosts = useMemo(() => {
        return posts.filter((post) => {
            if (feedTab === 'saved' && !savedIds.includes(post.id)) {
                return false;
            }
            if (selectedCategory !== 'all' && post.category !== selectedCategory) {
                return false;
            }
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
        /* Root container matches the exact layout of HomeView and TasksPage (space-y-6 pb-8, no artificial max-w) */
        <div className="space-y-6 pb-8 animate-in fade-in duration-300">
            {/* Purpose & Community Guidelines Strip (Clear reminder this is purely for motivation & goals, not standard social media) */}
            <div className="neu-card p-4 sm:p-5 bg-[#E0E5EC] rounded-2xl border border-white/60 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-[#549acb] bg-sky-50/40 shrink-0">
                        <HeartHandshake className="w-5 h-5 text-[#549acb]" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#549acb]">
                                Purpose & Community Pact
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300/60">
                                100% Motivation Only
                            </span>
                        </div>
                        <p className="text-xs font-semibold text-[#515777] leading-relaxed">
                            This feed is built strictly to inspire and elevate. Share your real <strong>goals, milestones, and discipline formulas</strong>.
                            No social media noise or distractions—pure focus, grit, and mutual growth.
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="neu-button-primary px-4 py-2.5 rounded-xl text-xs font-black flex items-center space-x-1.5 text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Share Formula / Goal</span>
                    </button>
                </div>
            </div>

            {/* Navigation Switcher: [ All Feed ] vs [ Saved Vault ] & Live Search */}
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
                        <span>All Motivation ({posts.length})</span>
                    </button>

                    <button
                        onClick={() => setFeedTab('saved')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${feedTab === 'saved'
                            ? 'neu-button text-amber-600 bg-[#E0E5EC] shadow-sm'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        <BookmarkCheck className="w-4 h-4 text-amber-500" />
                        <span>Saved in Vault ({savedIds.length})</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-sm w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717699]" />
                    <input
                        type="text"
                        placeholder="Search formulas, goals, tags..."
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
                        {feedTab === 'saved' ? 'No Saved Posts in Your Vault Yet' : 'No Motivation Posts Found'}
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
                                className="neu-card p-5 sm:p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all space-y-4 text-left"
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