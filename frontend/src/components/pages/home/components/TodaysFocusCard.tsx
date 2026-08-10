import React from 'react';
import { Target } from 'lucide-react';
import { FocusItem } from '../../hooks/useHomeData';
import { Task } from '../../types';

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
            </div>
        </div>
    );
};
