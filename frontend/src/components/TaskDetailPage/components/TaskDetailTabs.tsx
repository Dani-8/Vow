import React from 'react';

export type TaskTabType = 'overview' | 'sub-tasks' | 'notes' | 'files' | 'activity';

interface TaskDetailTabsProps {
    activeTab: TaskTabType;
    onTabChange: (tab: TaskTabType) => void;
}

export const TaskDetailTabs: React.FC<TaskDetailTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    const tabs: { id: TaskTabType; label: string }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'sub-tasks', label: 'Sub-Tasks' },
        { id: 'notes', label: 'Notes' },
        { id: 'files', label: 'Files' },
        { id: 'activity', label: 'Activity' },
    ];

    return (
        <div className="border-b border-[#c8d0e0]/60 flex items-center space-x-6 sm:space-x-8 px-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`pb-3 text-sm font-bold transition-all relative whitespace-nowrap ${isActive
                                ? 'text-[#2563eb]'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        <span>{tab.label}</span>
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-full shadow-sm" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
