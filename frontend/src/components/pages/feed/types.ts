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

export const INITIAL_FEED_POSTS: FeedPost[] = [
    {
        id: 'post_transformation_story',
        authorName: 'David K.',
        authorBadge: 'From Burnout to Mastery',
        category: 'story',
        title: 'How I Rebuilt My Career and Focus from Complete Scratch in 6 Months',
        content: `Six months ago, I was completely overwhelmed. I had 15 different unfinished side projects, zero daily routine, and felt guilty every evening looking at my untouched todo lists. I would open social media to numb the anxiety, which only made it worse.

The turning point was realizing that motivation is a myth—systems are everything. I started using Vow to lock in just ONE non-negotiable 45-minute focus block per day before checking any messages. 

When you track every sprint without lying to yourself, small compounding gains kick in. That single 45-minute daily block turned into shipping my first production SaaS, losing 18 pounds by tracking daily workouts, and hitting a 90-day unbroken streak. 

Never underestimate what consistent, daily micro-actions can do over 180 days. If you are struggling right now, stop trying to fix your entire life in one weekend. Pick one task, start the timer, and conquer today.`,
        likesCount: 215,
        savesCount: 114,
        createdAt: '2026-10-09T12:00:00Z',
        tags: ['story', 'transformation', 'discipline', 'journey'],
    },
    {
        id: 'post_founder_survival_story',
        authorName: 'Maya Thorne',
        authorBadge: 'Solo Bootstrapper',
        category: 'story',
        title: 'Zero Customers to $8k MRR: The Brutal 300-Day Discipline Journey',
        content: `In January, I quit my comfortable corporate engineering job to go all-in on my dream of building an independent software studio. Everyone warned me it was risky, but I thought pure passion would carry me through.

By month three, reality slapped me in the face. My savings were draining fast, my launch generated exactly zero paying customers, and imposter syndrome paralyzed me from writing even a single line of code for two straight weeks. I spent entire days refreshing Twitter and feeling like a complete failure.

One night, looking at my empty bank account, I made a strict vow: no more daydreaming, no more relying on fleeting "motivation". I created a 90-day sprint with two rigid non-negotiable rules:
1. 90 minutes of uninterrupted deep code before noon every single day.
2. Direct personal outreach to 5 potential users every afternoon without exception.

I logged every focus sprint, recorded my lessons, and refused to let skipped days compound. Month 5 brought our first $500. Month 8 hit $3,000. Yesterday, we crossed $8,200 MRR with 120 happy customers.

The lesson that saved my life: You do not rise to the level of your goals. You fall to the level of your daily discipline. If you have a dream that keeps you up at night, protect your focus hours with fierce boundaries. Nobody is coming to build it for you.`,
        likesCount: 289,
        savesCount: 156,
        createdAt: '2026-10-10T08:30:00Z',
        tags: ['story', 'bootstrapping', 'grit', 'mindset', 'success'],
    },