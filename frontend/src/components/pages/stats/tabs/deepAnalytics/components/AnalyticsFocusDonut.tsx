import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { CategoryBreakdownItem } from '../../../statsHelpers';

interface NormalizedCategory extends CategoryBreakdownItem {
    color: string;
}

interface AnalyticsFocusDonutProps {
    categories: NormalizedCategory[];
    activeCategory: NormalizedCategory | null;
    selectedCategoryKey: string | null;
    onToggleCategory: (catKey: string) => void;
    onResetCategoryFilter: () => void;
}

export const AnalyticsFocusDonut: React.FC<AnalyticsFocusDonutProps> = ({
    categories,
    activeCategory,
    selectedCategoryKey,
    onToggleCategory,
    onResetCategoryFilter,
}) => {
    return (
        <div className="lg:col-span-5 neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#6366f1] bg-[#E0E5EC]">
                            <PieIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-[#1a1c35]">Focus Share (Donut)</h3>
                            <p className="text-xs text-[#717699] font-medium">
                                Click any slice or card to filter dashboard
                            </p>
                        </div>
                    </div>

                    {activeCategory && (
                        <button
                            onClick={onResetCategoryFilter}
                            className="text-[10px] px-2 py-0.5 rounded-lg neu-inset text-[#717699] hover:text-[#1a1c35] font-bold"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Recharts Pie / Donut with Click-To-Filter */}
                <div className="w-full h-52 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categories}
                                dataKey="itemCount"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={3}
                                stroke="#E0E5EC"
                                strokeWidth={2}
                                onClick={(entry: any) => {
                                    const key = entry?.payload?.key || entry?.key;
                                    if (key) onToggleCategory(key);
                                }}
                                className="cursor-pointer"
                            >
                                {categories.map((entry) => {
                                    const isSelected = selectedCategoryKey === entry.key;
                                    const isAnySelected = Boolean(selectedCategoryKey);
                                    return (
                                        <Cell
                                            key={`cell-${entry.key}`}
                                            fill={entry.color}
                                            opacity={!isAnySelected || isSelected ? 1 : 0.35}
                                            stroke={isSelected ? '#1a1c35' : '#E0E5EC'}
                                            strokeWidth={isSelected ? 3 : 2}
                                        />
                                    );
                                })}
                            </Pie>
                            <Tooltip
                                formatter={(val: any, name: any) => [`${val} items`, name]}
                                contentStyle={{
                                    backgroundColor: '#E0E5EC',
                                    borderRadius: '14px',
                                    border: '1px solid #CBD5E1',
                                    boxShadow: '4px 4px 8px #bec3c9, -4px -4px 8px #ffffff',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Donut Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-black text-[#1a1c35]">
                            {activeCategory
                                ? activeCategory.itemCount
                                : categories.reduce((s, c) => s + c.itemCount, 0)}
                        </span>
                        <span className="text-[9px] font-bold uppercase text-[#717699]">
                            {activeCategory ? activeCategory.name.split(' ')[0] : 'Total Items'}
                        </span>
                    </div>
                </div>

                {/* Donut Legend Cards */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                    {categories.slice(0, 6).map((cat) => {
                        const isSelected = selectedCategoryKey === cat.key;
                        const isDimmed = selectedCategoryKey !== null && !isSelected;

                        return (
                            <button
                                key={cat.key}
                                onClick={() => onToggleCategory(cat.key)}
                                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-left transition-all ${isSelected
                                    ? 'neu-button bg-[#E0E5EC] ring-2 ring-[#549acb]'
                                    : isDimmed
                                        ? 'neu-inset opacity-50 hover:opacity-100'
                                        : 'neu-inset bg-[#E0E5EC]/80 hover:bg-[#E0E5EC]'
                                    }`}
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: cat.color }}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="text-[11px] font-bold text-[#1a1c35] truncate flex items-center justify-between">
                                        <span>{cat.name}</span>
                                        {isSelected && (
                                            <span className="text-[9px] text-[#549acb] font-black">✓</span>
                                        )}
                                    </div>
                                    <div className="text-[9px] font-semibold text-[#717699]">
                                        {cat.percentage}% share
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
