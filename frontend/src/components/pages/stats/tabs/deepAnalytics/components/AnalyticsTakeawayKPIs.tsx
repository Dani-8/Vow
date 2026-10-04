import React from 'react';
import { Flame, ShieldCheck, Zap, Filter, X } from 'lucide-react';
import { CategoryBreakdownItem } from '../../../statsHelpers';

interface NormalizedCategory extends CategoryBreakdownItem {
    color: string;
}

interface VelocityStats {
    windowDays: number;
    totalCompleted: number;
    ratePerDay: number;
    formattedRate: string;
    paceLabel: string;
}

interface AnalyticsTakeawayKPIsProps {
    activeCategory: NormalizedCategory | null;
    highestVolume?: NormalizedCategory;
    highestEfficiency?: NormalizedCategory;
    velocityStats: VelocityStats;
    selectedCategoryKey: string | null;
    onToggleCategory: (catKey: string) => void;
    onResetCategoryFilter: () => void;
}

export const AnalyticsTakeawayKPIs: React.FC<AnalyticsTakeawayKPIsProps> = ({
    activeCategory,
    highestVolume,
    highestEfficiency,
    velocityStats,
    selectedCategoryKey,
    onToggleCategory,
    onResetCategoryFilter,
}) => {
    return (
        <div className="space-y-4">
            {/* Cross-Filter Domain Banner */}
            {activeCategory && (
                <div className="neu-card p-3.5 rounded-2xl flex items-center justify-between border-2 border-[#549acb]/40 bg-[#E0E5EC] animate-fadeIn">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-white bg-[#549acb]">
                            <Filter className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-xs font-black text-[#1a1c35] flex items-center space-x-1.5">
                                <span>Domain Filter Active:</span>
                                <span
                                    className="px-2 py-0.5 rounded-md text-white font-bold"
                                    style={{ backgroundColor: activeCategory.color }}
                                >
                                    {activeCategory.name}
                                </span>
                            </span>
                            <p className="text-[11px] text-[#717699] font-medium">
                                All momentum curves, cadence waves, and metrics below are isolated to this domain.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onResetCategoryFilter}
                        className="neu-button px-3 py-1.5 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35] flex items-center space-x-1 transition-all"
                    >
                        <span>Reset Domain</span>
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Top 3 Executive Takeaway Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Primary Energy Focus */}
                <div
                    onClick={() => highestVolume && onToggleCategory(highestVolume.key)}
                    className={`neu-card p-5 rounded-3xl space-y-2 border cursor-pointer transition-all ${
                        selectedCategoryKey === highestVolume?.key
                            ? 'ring-2 ring-[#549acb] shadow-md border-transparent'
                            : 'border-white/60 hover:scale-[1.01]'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#549acb] flex items-center space-x-1.5">
                            <Flame className="w-3.5 h-3.5 text-[#549acb]" />
                            <span>Primary Energy Focus</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-[#44476A]">
                            {highestVolume?.percentage || 0}% Volume
                        </span>
                    </div>
                    <div className="text-xl font-black text-[#1a1c35]">
                        {highestVolume?.name || 'Balanced Focus'}
                    </div>
                    <p className="text-xs text-[#717699] font-medium leading-relaxed">
                        {highestVolume && highestVolume.itemCount > 0
                            ? `${highestVolume.name} holds ${highestVolume.itemCount} total item${highestVolume.itemCount === 1 ? '' : 's'} (${highestVolume.completedCount} conquered) across your ecosystem.`
                            : 'No workload allocated yet. Create tasks, habits, or blueprints to track energy.'}
                    </p>
                </div>

                {/* Card 2: Highest Follow-Through */}
                <div
                    onClick={() => highestEfficiency && onToggleCategory(highestEfficiency.key)}
                    className={`neu-card p-5 rounded-3xl space-y-2 border cursor-pointer transition-all ${
                        selectedCategoryKey === highestEfficiency?.key
                            ? 'ring-2 ring-emerald-500 shadow-md border-transparent'
                            : 'border-white/60 hover:scale-[1.01]'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Highest Follow-Through</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-emerald-600">
                            {highestEfficiency && highestEfficiency.itemCount > 0
                                ? Math.round((highestEfficiency.completedCount / highestEfficiency.itemCount) * 100)
                                : 0}% Rate
                        </span>
                    </div>
                    <div className="text-xl font-black text-[#1a1c35]">
                        {highestEfficiency?.name || 'Universal Flow'}
                    </div>
                    <p className="text-xs text-[#717699] font-medium leading-relaxed">
                        {highestEfficiency && highestEfficiency.itemCount > 0
                            ? `${highestEfficiency.completedCount} of ${highestEfficiency.itemCount} item${highestEfficiency.itemCount === 1 ? '' : 's'} completed with an unbroken ${Math.round((highestEfficiency.completedCount / highestEfficiency.itemCount) * 100)}% execution rate.`
                            : 'Complete roadmap items or habit cycles to establish your peak discipline domain.'}
                    </p>
                </div>

                {/* Card 3: Execution Velocity */}
                <div className="neu-card p-5 rounded-3xl space-y-2 border border-white/60">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#6366f1] flex items-center space-x-1.5">
                            <Zap className="w-3.5 h-3.5 text-[#6366f1] fill-[#6366f1]" />
                            <span>Execution Velocity</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-[#6366f1]">
                            {velocityStats.totalCompleted} Conquered
                        </span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-black text-[#1a1c35]">
                            {velocityStats.formattedRate}
                        </span>
                        <span className="text-xs font-bold text-[#717699]">actions / day</span>
                    </div>
                    <p className="text-xs text-[#717699] font-medium leading-relaxed">
                        {velocityStats.totalCompleted > 0
                            ? `${velocityStats.totalCompleted} actions finished across this ${velocityStats.windowDays}-day horizon. ${velocityStats.paceLabel}.`
                            : `No items completed in this ${velocityStats.windowDays}-day horizon yet. Log progress to calculate velocity.`}
                    </p>
                </div>
            </div>
        </div>
    );
};
