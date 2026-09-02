import React from 'react';
import { Search } from 'lucide-react';

export type FilterCategory = 'all' | 'habits' | 'tasks' | 'todo' | 'completed';

interface ControlsBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
}

export const TaskControlsBar: React.FC<ControlsBarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange, }) => {
  return (
    <div className="neu-card p-4 flex flex-wrap items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-[#717699] absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search goals, habits, tags..."
          className="w-full pl-10 pr-4 py-2 rounded-xl neu-input text-sm font-medium"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center neu-inset p-1.5 rounded-2xl space-x-1">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${activeFilter === 'all'
            ? 'neu-button !text-[#549acb] bg-[#E0E5EC]'
            : 'text-[#717699] hover:text-[#1a1c35]'
            }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('habits')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${activeFilter === 'habits'
            ? 'neu-button !text-[#549acb] bg-[#E0E5EC]'
            : 'text-[#717699] hover:text-[#1a1c35]'
            }`}
        >
          Habits
        </button>
        <button
          onClick={() => onFilterChange('tasks')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${activeFilter === 'tasks'
            ? 'neu-button !text-[#549acb] bg-[#E0E5EC]'
            : 'text-[#717699] hover:text-[#1a1c35]'
            }`}
        >
          Single Tasks
        </button>
        <button
          onClick={() => onFilterChange('todo')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${activeFilter === 'todo'
            ? 'neu-button !text-[#549acb] bg-[#E0E5EC]'
            : 'text-[#717699] hover:text-[#1a1c35]'
            }`}
        >
          Pending
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${activeFilter === 'completed'
            ? 'neu-button !text-[#549acb] bg-[#E0E5EC]'
            : 'text-[#717699] hover:text-[#1a1c35]'
            }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
};
