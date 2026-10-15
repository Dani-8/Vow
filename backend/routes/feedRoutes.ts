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