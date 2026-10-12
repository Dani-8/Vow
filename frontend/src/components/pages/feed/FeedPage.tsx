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