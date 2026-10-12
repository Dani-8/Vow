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
