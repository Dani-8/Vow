import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { User, FeedPost } from '../../../types';
import { useFeedData } from './components/main/hooks/useFeedData';
import { FeedCommunityBanner } from './components/main/components/FeedCommunityBanner';
import { FeedControlsBar } from './components/main/components/FeedControlsBar';
import { FeedCategoryFilter } from './components/main/components/FeedCategoryFilter';
import { FeedCard } from './components/main/components/FeedCard';
import { CreatePostModal } from './components/main/components/CreatePostModal';

interface FeedPageProps {
    currentUser: User | null;
    onNavigateToView?: (view: any, param?: string) => void;
    onViewPostPage?: (post: FeedPost) => void;
}
