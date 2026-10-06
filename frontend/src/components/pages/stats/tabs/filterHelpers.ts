        })
        .map((act) => {
            // Apply Execution Type (All vs Challenges vs Tasks)
            let challengeActions = act.challengeActions;
            let taskActions = act.taskActions;

            if (filters.executionType === 'challenges') {
                taskActions = 0;
            } else if (filters.executionType === 'tasks') {
                challengeActions = 0;
            }

            const totalActions = challengeActions + taskActions;
            let level: 0 | 1 | 2 | 3 | 4 = 0;
            if (totalActions >= 5) level = 4;
            else if (totalActions >= 3) level = 3;
            else if (totalActions >= 2) level = 2;
            else if (totalActions >= 1) level = 1;

            return {
                ...act,
                challengeActions,
                taskActions,
                totalActions,
                level,
            };
        });
}
