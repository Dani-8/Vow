import React from 'react';
import { Sparkles } from 'lucide-react';
import { FeedPost } from '../../../../../../types';
import { getCategoryBadgeConfig } from '../../main/components/FeedCategoryFilter';

interface RelatedPostsSectionProps {
    relatedPosts: FeedPost[];
    categoryLabel: string;
    onSelectPost?: (post: FeedPost) => void;
}

export const RelatedPostsSection: React.FC<RelatedPostsSectionProps> = ({
    relatedPosts,
    categoryLabel,
    onSelectPost,
}) => {
    if (!relatedPosts || relatedPosts.length === 0) return null;

    return (
        <div className="space-y-3 pt-4">
            <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#549acb]" />
                <h4 className="text-sm font-black text-[#1a1c35]">
                    More in {categoryLabel}
                </h4>
            </div>
            <div classN