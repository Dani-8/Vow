import { Task, MasterStreakStats, User } from '../types';

export const DEFAULT_DEMO_USER: User = {
    id: 'demo_user_default',
    username: 'alex_rivera',
    name: 'Alex Rivera',
    email: 'alex_rivera@vow.internal',
    recoveryKey: 'VOW-9X4A-88KP-2Z1Q',
    createdAt: '2026-08-01T08:00:00Z',
    hasPinSet: true,
};

export const DEFAULT_INITIAL_TASKS: Task[] = [
    {
        _id: 'task_russian_mastery_r7u2k',
        userId: 'demo_user_default',
        title: 'Russian Language Learning: Daily Fluency & Grammar Path',
        description: 'Master Cyrillic script, top 1,000 core vocabulary words, noun cases (Accusative/Genitive/Prepositional), and daily conversational shadowing.',
        tags: ['RUSSIAN', 'LANGUAGE', 'DAILY'],
        startTime: new Date(Date.now() - 3600000 * 3).toISOString(),
        endTime: new Date(Date.now() + 3600000 * 4).toISOString(),
        status: 'in_progress',
        priority: 'High',
        isPrivate: false,
        isHabit: true,
        currentStreak: 6,
        bestStreak: 14,
        effectiveCurrentStreak: 6,
        effectiveBestStreak: 14,
        completedToday: false,
        missedPreviousDays: false,
        lastCompletedDate: new Date(Date.now() - 86400000).toISOString(),
        completionHistory: [
            new Date(Date.now() - 86400000 * 6).toISOString(),
            new Date(Date.now() - 86400000 * 5).toISOString(),
            new Date(Date.now() - 86400000 * 4).toISOString(),
            new Date(Date.now() - 86400000 * 3).toISOString(),
            new Date(Date.now() - 86400000 * 2).toISOString(),
            new Date(Date.now() - 86400000).toISOString(),
        ],
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date().toISOString(),
        subTasks: [
            {