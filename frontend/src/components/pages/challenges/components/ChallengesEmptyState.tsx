import React from 'react';
import { Target, Trophy, Coffee, Search, Plus, HelpCircle, Lightbulb } from 'lucide-react';

interface ChallengesEmptyStateProps {
    isInitialOnboarding?: boolean;
    activeFilter?: 'active' | 'completed' | 'paused';
    searchQuery?: string;
    onClearSearch?: () => void;
    onViewActive?: () => void;
    onStartChallenge: () => void;
    onOpenGuide: () => void;
}

export const ChallengesEmptyState: React.FC<ChallengesEmptyStateProps> = ({
    isInitialOnboarding = false,
    activeFilter = 'active',
    searchQuery = '',
    onClearSearch,
    onViewActive,
    onStartChallenge,
    onOpenGuide,
}) => {
    // Case 1: Initial Onboarding View (0 Challenges created yet)
    if (isInitialOnboarding) {
        return (
            <div className="space-y-6">
                <div className="neu-card p-10 sm:p-14 bg-[#E0E5EC] flex flex-col items-center justify-center text-center space-y-5">
                    {/* Target Illustration with Rings */}
                    <div className="relative w-28 h-28 rounded-full neu-inset flex items-center justify-center p-3">
                        <div className="w-20 h-20 rounded-full neu-button flex items-center justify-center text-[#549acb] bg-sky-50 shadow-inner">
                            <Target className="w-10 h-10 text-[#549acb]" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs shadow-md">
                            ✨
                        </div>
                    </div>

                    <div className="space-y-2 max-w-md">
                        <h3 className="text-lg sm:text-xl font-black text-[#1a1c35]">
                            No Challenges Created Yet
                        </h3>
                        <p className="text-xs font-semibold text-[#717699] leading-relaxed">
                            Give yourself a 21, 60, 100, or custom day challenge. Build unbreakable habits, track
                            your progress on a GitHub-style heatmap, and log your daily journey.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <button
                            onClick={onStartChallenge}
                            className="neu-button-primary px-6 py-3 rounded-2xl font-bold text-xs text-white flex items-center space-x-2 shadow-md hover:scale-105 transition-transform"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Start Your First Challenge</span>
                        </button>

                        <button
                            onClick={onOpenGuide}
                            className="neu-button px-4 py-3 rounded-2xl font-bold text-xs text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1.5"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span>Learn how Challenges work</span>
                        </button>
                    </div>
                </div>

                {/* Tip Banner */}
                <div className="neu-card p-4 bg-[#E0E5EC] flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl neu-button flex items-center justify-center text-amber-500 bg-amber-50 shrink-0">
                        <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900">
                            Tip: Start with a 21-day challenge to build momentum before tackling a 100-day sprint.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Case 2: Tab-specific or Search empty state
    return (
        <div className="neu-card p-10 sm:p-14 bg-[#E0E5EC] flex flex-col items-center justify-center text-center space-y-4">
            {searchQuery ? (
                <>
                    <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center text-[#549acb] bg-sky-50/60 shadow-inner">
                        <Search className="w-8 h-8 text-[#549acb]" />
                    </div>
                    <div className="space-y-1.5 max-w-md">
                        <h3 className="text-lg font-black text-[#1a1c35]">
                            No Matching Challenges Found
                        </h3>
                        <p className="text-xs font-medium text-[#717699] leading-relaxed">
                            We couldn't find any challenges matching &ldquo;<span className="font-bold text-[#1a1c35]">{searchQuery}</span>&rdquo;. Try searching for a different keyword or tag.
                        </p>
                    </div>
                    {onClearSearch && (
                        <button
                            onClick={onClearSearch}
                            className="neu-button px-5 py-2 rounded-xl font-bold text-xs text-[#549acb] hover:text-[#1a1c35] transition-all"
                        >
                            Clear Search
                        </button>
                    )}
                </>
            ) : activeFilter === 'completed' ? (
                <>
                    <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center text-emerald-600 bg-emerald-50/60 shadow-inner">
                        <Trophy className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="space-y-1.5 max-w-md">
                        <h3 className="text-lg font-black text-[#1a1c35]">
                            No Completed Challenges Yet
                        </h3>
                        <p className="text-xs font-medium text-[#717699] leading-relaxed">
                            Every completed check-in gets you closer to the finish line. Stay consistent with your daily targets to reach 100% completion!
                        </p>
                    </div>
                    {onViewActive && (
                        <button
                            onClick={onViewActive}
                            className="neu-button px-5 py-2 rounded-xl font-bold text-xs text-[#549acb] hover:text-[#1a1c35] transition-all"
                        >
                            View Active Challenges
                        </button>
                    )}
                </>
            ) : activeFilter === 'paused' ? (
                <>
                    <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center text-amber-600 bg-amber-50/60 shadow-inner">
                        <Coffee className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="space-y-1.5 max-w-md">
                        <h3 className="text-lg font-black text-[#1a1c35]">
                            No Paused Challenges
                        </h3>
                        <p className="text-xs font-medium text-[#717699] leading-relaxed">
                            Any challenge you temporarily put on hold will appear here. You can resume your streak whenever you are ready.
                        </p>
                    </div>
                    {onViewActive && (
                        <button
                            onClick={onViewActive}
                            className="neu-button px-5 py-2 rounded-xl font-bold text-xs text-[#549acb] hover:text-[#1a1c35] transition-all"
                        >
                            View Active Challenges
                        </button>
                    )}
                </>
            ) : (
                <>
                    <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center text-[#549acb] bg-sky-50/60 shadow-inner">
                        <Target className="w-8 h-8 text-[#549acb]" />
                    </div>
                    <div className="space-y-1.5 max-w-md">
                        <h3 className="text-lg font-black text-[#1a1c35]">
                            No Active Challenges
                        </h3>
                        <p className="text-xs font-medium text-[#717699] leading-relaxed">
                            You don&apos;t have any active challenges currently running. Start a new challenge or resume one from your paused list.
                        </p>
                    </div>
                    <button
                        onClick={onStartChallenge}
                        className="neu-button-primary px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center space-x-2 shadow-md hover:scale-105 transition-transform"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Start a Challenge</span>
                    </button>
                </>
            )}
        </div>
    );
};
