import React from 'react';
import { Sparkles } from 'lucide-react';
import { FeedPost } from '../../../../../../types';
import { getCategoryBadgeConfig } from '../../main/components/FeedCategoryFilter';

interface RelatedPostsSectionProps {
    relatedPosts: FeedPost[];
    categoryLabel: string;
    onSelectPost?: (post: FeedPost) => void;
}