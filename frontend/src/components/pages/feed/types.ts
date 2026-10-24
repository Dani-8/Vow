export type FeedCategory = 'formula' | 'win' | 'insight' | 'discipline' | 'story';

export interface FeedPost {
    id: string;
    authorName: string;
    authorBadge?: string;
    authorAvatar?: string;
    category: FeedCategory;
    title: string;
    content: string;
    likesCount: number;
    savesCount: number;
    createdAt: string;
    isLiked?: boolean;
    isSaved?: boolean;
    tags: string[];
}
