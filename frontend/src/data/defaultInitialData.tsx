            {
                id: 'sub_mern_4',
                taskId: 'task_mern_project_m3k9p',
                title: 'Global State Management & Optimistic CRUD Updates',
                dateLabel: 'Tomorrow',
                status: 'in_progress',
                priority: 'Medium',
            },
            {
                id: 'sub_mern_5',
                taskId: 'task_mern_project_m3k9p',
                title: 'Docker Containerization & Production Cloud Run Deploy',
                dateLabel: 'Next Week',
                status: 'pending',
                priority: 'High',
            },
        ],
    },
];

export const DEFAULT_INITIAL_PRIVATE_TASKS: Task[] = [
    {
        _id: 'task_private_clarity_9vbt1',
        userId: 'demo_user_default',
        title: 'Personal High-Performance Vow & Growth Tracker',
        description: 'Long-range personal milestones, deep work discipline, and private reflections on focus.',
        tags: ['DISCIPLINE', 'PRIVATE', 'FOCUS'],
        status: 'in_progress',
        priority: 'High',
        isPrivate: true,
        isHabit: false,
        currentStreak: 5,
        bestStreak: 12,
        effectiveCurrentStreak: 5,
        effectiveBestStreak: 12,
        completedToday: false,
        missedPreviousDays: false,
        completionHistory: [],
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const DEFAULT_INITIAL_STATS: MasterStreakStats = {
    masterStreak: 6,
    activeToday: true,
    totalCheckIns: 28,
    completedDaysSet: [
        new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        new Date(Date.now() - 86400000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
    ],
    totalTasks: 3,
    totalHabits: 1,
};
