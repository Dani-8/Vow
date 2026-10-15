import { Router, Request, Response } from 'express';

export interface BackendFeedPost {
    id: string;
    authorName: string;
    authorBadge?: string;
    category: 'formula' | 'win' | 'insight' | 'discipline' | 'story';
    title: string;
    content: string;
    likesCount: number;
    savesCount: number;
    createdAt: string;
    tags: string[];
}

const router = Router();

// In-memory feed posts store initialized with high-impact community formulas & stories
let feedPostsStore: BackendFeedPost[] = [
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
        likesCount: 143,
        savesCount: 69,
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
        likesCount: 99,
        savesCount: 53,
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
        likesCount: 176,
        savesCount: 42,
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
        likesCount: 121,
        savesCount: 64,
        createdAt: '2026-10-06T11:00:00Z',
        tags: ['discipline', 'momentum', 'resilience'],
    },
];

// GET /api/feed - get all posts
router.get('/', (req: Request, res: Response) => {
    return res.json({ posts: feedPostsStore });
});

// POST /api/feed - create a new post
router.post('/', (req: Request, res: Response) => {
    const { authorName, authorBadge, category, title, content, tags } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const newPost: BackendFeedPost = {
        id: `post_${Date.now()}`,
        authorName: authorName || 'Anonymous Builder',
        authorBadge: authorBadge || 'Community Member',
        category: category || 'formula',
        title: title.trim(),
        content: content.trim(),
        likesCount: 1,
        savesCount: 0,
        createdAt: new Date().toISOString(),
        tags: Array.isArray(tags) && tags.length > 0 ? tags : ['mindset', category || 'formula'],
    };

    feedPostsStore.unshift(newPost);
    return res.status(201).json({ post: newPost });
});

// POST /api/feed/:id/like - toggle like
router.post('/:id/like', (req: Request, res: Response) => {
    const { id } = req.params;
    const { increment } = req.body; // true = +1, false = -1

    const found = feedPostsStore.find((p) => p.id === id);
    if (!found) {
        return res.status(404).json({ error: 'Post not found' });
    }

    if (increment === false) {
        found.likesCount = Math.max(0, found.likesCount - 1);
    } else {
        found.likesCount += 1;
    }

    return res.json({ post: found });
});

// POST /api/feed/:id/save - toggle save counter
router.post('/:id/save', (req: Request, res: Response) => {
    const { id } = req.params;
    const { increment } = req.body;

    const found = feedPostsStore.find((p) => p.id === id);
    if (!found) {
        return res.status(404).json({ error: 'Post not found' });
    }

    if (increment === false) {
        found.savesCount = Math.max(0, found.savesCount - 1);
    } else {
        found.savesCount += 1;
    }

    return res.json({ post: found });
});

export default router;
