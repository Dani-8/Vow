import { Router, Request, Response } from 'express';

export interface BackendFeedPost {
    id: string;
    authorName: string;
    authorBadge?: string;
    category: 'formula' | 'win' | 'insight' | 'discipline';
    title: string;
    content: string;
    likesCount: number;
    savesCount: number;
    createdAt: string;
    tags: string[];
}

const router = Router();

// In-memory feed posts store initialized with high-impact community formulas
let feedPostsStore: BackendFeedPost[] = [
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