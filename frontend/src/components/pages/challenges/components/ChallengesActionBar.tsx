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
    const filters = [
        { key: 'active' as const, label: 'Active', count: counts.active, color: 'indigo' },
        { key: 'completed' as const, label: 'Completed', count: counts.completed, color: 'emerald' },
        { key: 'paused' as const, label: 'Paused', count: counts.paused, color: 'amber' },
    ];

    const actions = [
        { label: 'Guide', icon: HelpCircle, onClick: onOpenGuide, className: 'neu-button px-3.5 py-2 rounded-xl font-bold text-xs text-[#717699] hover:text-[#1a1c35]' },
        { label: 'Start a Challenge', icon: Plus, onClick: onStartChallenge, className: 'neu-button-primary px-4 py-2 rounded-xl font-bold text-xs text-white shadow-md hover:scale-105 transition-transform' },
    ];

    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            {/* Left: Status Filter Tabs */}
            <div className="flex items-center bg-pink-400 space-x-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0">
                {filters.map(({ key, label, count, color }) => (
                    <button
                        key={key}
                        onClick={() => onFilterChange(key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${activeFilter === key
                            ? `neu-inset text-${color}-700 bg-${color}-50/70 font-black`
                            : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        <span>{label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full neu-inset text-${color}-700`}>
                            {count}
                        </span>
                    </button>
                ))}
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

                {actions.map(({ label, icon: Icon, onClick, className }) => (
                    <button
                        key={label}
                        onClick={onClick}
                        className={`${className} flex items-center space-x-1.5 shrink-0`}
                        title={label === 'Guide' ? 'How Challenges Work' : undefined}
                    >
                        <Icon className="w-4 h-4" />
                        <span className={label === 'Guide' ? 'hidden sm:inline' : 'whitespace-nowrap'}>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
