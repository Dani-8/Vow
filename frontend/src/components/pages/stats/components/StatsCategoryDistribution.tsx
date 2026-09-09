import React from 'react';
import { PieChart, Sparkles, Compass } from 'lucide-react';
import { CategoryBreakdownItem } from '../statsHelpers';
import { getCategoryIconComponent } from '../../../common/categoryIcons';

interface StatsCategoryDistributionProps {
    categories: CategoryBreakdownItem[];
}

export const StatsCategoryDistribution: React.FC<StatsCategoryDistributionProps> = ({ categories }) => {
    const topCategory = categories[0];

    return (
        <div className="neu-card p-6 rounded-3xl space-y-5 border border-white/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                        <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-[#1a1c35]">Category & Focus Allocation</h3>
                        <p className="text-xs text-[#717699] font-medium">
                            Cross-system distribution across challenges, roadmaps, and daily habits
                        </p>
                    </div>
                </div>

                {topCategory && (
                    <div className="px-3 py-1.5 rounded-2xl neu-inset text-xs font-bold text-[#1a1c35] flex items-center space-x-1.5 shrink-0 bg-[#E0E5EC]/80">
                        <Sparkles className="w-3.5 h-3.5 text-[#549acb]" />
                        <span>
                            Primary Domain: <strong className="text-[#549acb]">{topCategory.name}</strong> ({topCategory.percentage}%)
                        </span>
                    </div>
                )}
            </div>

            {/* Distribution Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                    const Icon = getCategoryIconComponent(cat.iconId);
                    return (
                        <div key={cat.key} className="neu-inset p-4 rounded-2xl space-y-2.5 bg-[#E0E5EC]/80 border border-white/60">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2.5">
                                    <div
                                        className="w-8 h-8 rounded-xl neu-button flex items-center justify-center bg-[#E0E5EC] shrink-0"
                                        style={{ color: cat.color }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-[#1a1c35]">{cat.name}</h4>
                                        <span className="text-[10px] font-semibold text-[#717699]">
                                            {cat.itemCount} active item{cat.itemCount === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-[#1a1c35]">{cat.percentage}%</span>
                            </div>