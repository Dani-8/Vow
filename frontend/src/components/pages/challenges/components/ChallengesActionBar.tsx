import React from 'react';
import { Search, HelpCircle, Plus } from 'lucide-react';

interface ChallengesActionBarProps {
    activeFilter: 'active' | 'completed' | 'paused';
    onFilterChange: (filter: 'active' | 'completed' | 'paused') => void;
    counts: { active: number; completed: number; paused: number };
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenGuide: () => void;
    onStartChallenge: () => void;
}

export const ChallengesActionBar: React.FC<ChallengesActionBarProps> = ({
    activeFilter,
    onFilterChange,
    counts,
    searchQuery,
    onSearchChange,
    onOpenGuide,
    onStartChallenge,
}) => {
    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            {/* Left: Status Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0">
                <button
                    onClick={() => onFilterChange('active')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${activeFilter === 'active'
                        ? 'neu-inset text-indigo-700 bg-indigo-50/70 font-black'
                        : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    <span>Active</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full neu-inset text-indigo-700">
                        {counts.active}
                    </span>
                </button>

                <button
                    onClick={() => onFilterChange('completed')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${activeFilter === 'completed'
                        ? 'neu-inset text-emerald-700 bg-emerald-50/70 font-black'
                        : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    <span>Completed</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full neu-inset text-emerald-700">
                        {counts.completed}
                    </span>
                </button>

                <button
                    onClick={() => onFilterChange('paused')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${activeFilter === 'paused'
                        ? 'neu-inset text-amber-700 bg-amber-50/70 font-black'
                        : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    <span>Paused</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full neu-inset text-amber-700">
                        {counts.paused}
                    </span>
                </button>
            </div>

            {/* Right: Search Input + Guide + Start Challenge */}
            <div className="flex items-center space-x-2 flex-1 lg:flex-initial justify-end">
                <div className="relative flex-1 lg:w-56 min-w-[140px]">
                    <Search className="w-4 h-4 text-[#717699] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search challenges..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl neu-input text-xs font-medium"
                    />
                </div>

                <button
                    onClick={onOpenGuide}
                    className="neu-button px-3.5 py-2 rounded-xl font-bold text-xs text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1.5 shrink-0"
                    title="How Challenges Work"
                >
                    <HelpCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Guide</span>
                </button>

                <button
                    onClick={onStartChallenge}
                    className="neu-button-primary px-4 py-2 rounded-xl font-bold text-xs text-white flex items-center space-x-1.5 shadow-md hover:scale-105 transition-transform shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span className="whitespace-nowrap">Start a Challenge</span>
                </button>
            </div>
        </div>
    );
};
