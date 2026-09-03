import React from 'react';

export type TaskTabType = 'overview' | 'sub-tasks' | 'notes' | 'files' | 'activity';

interface TaskDetailTabsProps {
    activeTab: TaskTabType;
    onTabChange: (tab: TaskTabType) => void;
}