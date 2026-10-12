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
    {
        id: 'post_streak_win',
        authorName: 'Marcus Sterling',
        authorBadge: '30-Day Finisher',
        category: 'win',
        title: 'Completed My 30-Day TypeScript Mastery Sprint! 🏆',
        content: `Just logged Day 30 without a single skipped day. Started from feeling intimidated by advanced generics and utility types to building a full enterprise compiler plugin. 

The secret wasn't willpower—it was locking down 30 minutes every morning right after coffee before touching any emails. Onward to the next challenge!`,
        likesCount: 175,
        savesCount: 41,
        createdAt: '2026-10-07T09:30:00Z',
        tags: ['challenge', 'coding', 'consistency'],
    },
    {
        id: 'post_daily_discipline',
        authorName: 'Sarah Jenkins',
        authorBadge: 'Habit Architect',
        category: 'discipline',
        title: 'The "Never Miss Twice" Rule',
        content: `Missing one workout or one study session isn't failure; it's life. But missing twice is the start of a new, negative habit.

If life gets in the way today, do at least the micro-version (even 5 minutes). Keep the identity alive so tomorrow isn't an uphill battle.`,
        likesCount: 120,
        savesCount: 63,
        createdAt: '2026-10-06T11:00:00Z',
        tags: ['discipline', 'momentum', 'resilience'],
    },
];
