import React from 'react';
import { Flame, Tag } from 'lucide-react';
import { Task } from '../../../../../../types';

interface TaskAttributesCardProps {
    task: Task;
}

export const TaskAttributesCard: React.FC<TaskAttributesCardProps> = ({ task }) => {
    return (
        <div className="neu-card p-5 bg-[#E0E5EC] space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#717699]">
                Task Attributes
            </h3>

            <div className="space-y-3 text-xs">
                {/* Streak if habit */}
                {task.isHabit && (
                    <div className="flex items-center justify-between p-3 rounded-xl neu-inset bg-[#dbe2ed]/60">
                        <div className="flex items-center space-x-2 text-amber-600">
                            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span className="font-bold text-[#1a1c35]">Current Streak</span>
                        </div>
                        <span className="font-black text-amber-600 text-sm">{task.currentStreak || 0} days</span>
                    </div>
                )}

                {/* Tags */}
                <div className="space-y-1.5">
                    <span className="font-bold text-[#717699] flex items-center space-x-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Tags</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {task.tags && task.tags.length > 0 ? (
                            task.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2.5 py-1 rounded-lg neu-inset text-[11px] font-black text-[#4a4e69] bg-[#dbe2ee]/50"
                                >
                                    #{tag}
                                </span>
                            ))
                        ) : (
                            <span className="text-slate-400 italic">No tags assigned</span>
                        )}
                    </div>
                </div>

                {/* Created & Updated dates */}
                <div className="pt-3 border-t border-[#c8d0e0]/70 space-y-2 text-[11px] text-[#717699]">
                    <div className="flex justify-between">
                        <span>Created</span>
                        <span className="font-medium text-[#1a1c35]">
                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Last Updated</span>
                        <span className="font-medium text-[#1a1c35]">
                            {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
