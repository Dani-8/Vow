import React from 'react';
import { Target, Sparkles } from 'lucide-react';
import { FocusItem } from '../../../../hooks/useHomeData';
import { Task } from '../../../../types';

interface TodaysFocusCardProps {
    focusList: FocusItem[];
    onViewTaskDetail: (task: Task) => void;
}

export const TodaysFocusCard: React.FC<TodaysFocusCardProps> = ({
    focusList,
    onViewTaskDetail,
}) => {
    return (
        <div className="lg:col-span-5 neu-card p-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-2 mb-1">
                    <Target className="w-4 h-4 text-[#549acb]" />
                    <h3 className="text-sm font-extrabold text-[#1a1c35]">Today's Focus</h3>
                </div>
                <p className="text-[11px] text-[#717699] font-medium mb-4">
                    Your top priorities for today
                </p>

                {focusList.length > 0 ? (
                    <div className="space-y-3">
                        {focusList.map((item, index) => (
                            <div
                                key={item._id}
                                onClick={() => item.originalTask && onViewTaskDetail(item.originalTask)}
                                className="neu-inset p-3 rounded-2xl flex items-center space-x-3 cursor-pointer hover:border-[#549acb] transition-all"
                            >
                                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                                    {index + 1}
                                </div>
                                <p className="text-xs font-bold text-[#1a1c35] truncate flex-1">{item.title}</p>
                                <span
                                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0 ${item.tagColor}`}
                                >
                                    {item.tag}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="neu-inset p-4 rounded-2xl flex flex-col items-center justify-center text-center py-6">
                        <div className="w-8 h-8 rounded-xl bg-[#549acb]/10 text-[#549acb] flex items-center justify-center mb-2">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-[#1a1c35]">No active focus tasks</p>
                        <p className="text-[10px] text-[#717699] mt-0.5 max-w-[200px]">
                            Add your high-priority tasks to see them highlighted here as your daily focus.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
