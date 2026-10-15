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