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