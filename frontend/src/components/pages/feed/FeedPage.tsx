import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { User } from '../../../types';
import { FeedPost } from './types';
import { useFeedData } from './hooks/useFeedData';
import { FeedCommunityBanner } from './components/FeedCommunityBanner';
import { FeedControlsBar } from './components/FeedControlsBar';
import { FeedCategoryFilter } from './components/FeedCategoryFilter';
import { FeedCard } from './components/FeedCard';
import { CreatePostModal } from './components/CreatePostModal';

interface FeedPageProps {
    currentUser: User | null;
    onNavigateToView?: (view: any, param?: string) => void;
    onViewPostPage?: (post: FeedPost) => void;
}
