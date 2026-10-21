import React from 'react';
import { Calendar } from 'lucide-react';
import { FeedPost } from '../../../../../../types';
import { getCategoryBadgeConfig } from '../../main/components/FeedCategoryFilter';

interface PostHeroCardProps {
    post: FeedPost;
}