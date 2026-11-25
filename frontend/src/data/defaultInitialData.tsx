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
