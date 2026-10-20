import { useState, useEffect, useMemo, useCallback } from 'react';
import { FeedPost, FeedCategory } from '../../../../../../types';
import { INITIAL_FEED_POSTS } from '../../../../../../data/defaultFeedPosts';
import { api } from '../../../../../../api';

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