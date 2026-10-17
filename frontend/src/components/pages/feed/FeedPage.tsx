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
