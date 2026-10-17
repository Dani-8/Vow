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