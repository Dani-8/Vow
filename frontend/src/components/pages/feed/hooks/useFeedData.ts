import { useState, useEffect, useMemo, useCallback } from 'react';
import { FeedPost, FeedCategory, INITIAL_FEED_POSTS } from '../types';
import { api } from '../../../../api';

const STORAGE_POSTS_KEY = 'app_community_feed_posts';
const STORAGE_SAVED_IDS_KEY = 'app_community_saved_post_ids';
const STORAGE_LIKED_IDS_KEY = 'app_community_liked_post_ids';

export function useFeedData() {
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

    // 2. Saved IDs
    const [savedIds, setSavedIds] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_SAVED_IDS_KEY);
            return raw ? JSON.parse(raw) : ['post_reel_formula'];
        } catch {
            return ['post_reel_formula'];
        }
    });

    // 3. Liked IDs
    const [likedIds, setLikedIds] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_LIKED_IDS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    // UI filters
    const [feedTab, setFeedTab] = useState<'all' | 'saved'>('all');
    const [selectedCategory, setSelectedCategory] = useState<FeedCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Fetch live posts from backend
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

    // Sync saved & liked
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

    const handleToggleLike = useCallback(async (postId: string) => {
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

        try {
            await api.likeFeedPost(postId, !isCurrentlyLiked);
        } catch (e) {
            console.warn('Could not sync like with backend:', e);
        }
    }, [likedIds]);

    const handleToggleSave = useCallback(async (postId: string) => {
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

        try {
            await api.saveFeedPost(postId, !isCurrentlySaved);
        } catch (e) {
            console.warn('Could not sync save with backend:', e);
        }
    }, [savedIds]);

    const handleShare = useCallback((postId: string, title: string) => {
        try {
            navigator.clipboard.writeText(`${title} - Shared from Vow Mindset Feed`);
            setCopiedId(postId);
            setTimeout(() => setCopiedId(null), 2500);
        } catch {
            // fallback
        }
    }, []);

    const handleCreatePost = useCallback(async (newPostData: Omit<FeedPost, 'id' | 'likesCount' | 'savesCount' | 'createdAt' | 'isLiked' | 'isSaved'>) => {
        const localId = `post_${Date.now()}`;
        const newPost: FeedPost = {
            ...newPostData,
            id: localId,
            likesCount: 1,
            savesCount: 0,
            createdAt: new Date().toISOString(),
        };

        setLikedIds((prev) => [...prev, localId]);
        setPosts((prev) => [newPost, ...prev]);

        try {
            const res = await api.createFeedPost(newPostData);
            if (res.post) {
                setPosts((prev) => [res.post, ...prev.filter((p) => p.id !== localId)]);
            }
        } catch (e) {
            console.warn('Could not sync post with backend:', e);
        }
    }, []);

    // Filtered posts calculation
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

    return {
        posts,
        displayedPosts,
        savedIds,
        likedIds,
        feedTab,
        setFeedTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        copiedId,
        handleToggleLike,
        handleToggleSave,
        handleShare,
        handleCreatePost,
    };
}
