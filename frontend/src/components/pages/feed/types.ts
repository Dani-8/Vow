export type FeedCategory = 'formula' | 'win' | 'insight' | 'discipline';

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

export const INITIAL_FEED_POSTS: FeedPost[] = [
    {
        id: 'post_reel_formula',
        authorName: 'Alex Mercer',
        authorBadge: 'Discipline Strategist',
        category: 'formula',
        title: 'The Formula that Changed Everything',
        content: `Here's the exact framework that finally shifted my output:

• Goal + no deadline = fantasy
• Goal + deadline = objective
• Goal + deadline + plan = strategy
• Goal + deadline + plan + consistent action = success

Don't let your aspirations stay at stage one. Commit a date, map the roadmap, and execute daily.`,
        likesCount: 142,
        savesCount: 68,
        createdAt: '2026-10-09T18:20:00Z',
        tags: ['strategy', 'execution', 'mindset'],
    },
    {
        id: 'post_deepwork_rule',
        authorName: 'Dr. Elena Vance',
        authorBadge: 'Deep Work Researcher',
        category: 'insight',
        title: 'Why 45 Minutes of Flow Beats 6 Hours of Multitasking',
        content: `Every time you switch tabs or glance at notifications, your brain suffers "attention residue". It takes up to 23 minutes to regain deep immersion. 

Two 45-minute distraction-free blocks with a real timer consistently produces more high-value output than an entire day of fragmented half-working. Protect your focus window like your life depends on it.`,
        likesCount: 98,
        savesCount: 52,
        createdAt: '2026-10-08T14:15:00Z',
        tags: ['focus', 'habits', 'productivity'],
    },