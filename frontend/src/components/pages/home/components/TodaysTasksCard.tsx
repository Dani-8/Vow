import React from 'react';
import { CheckCircle2, Circle, Check } from 'lucide-react';
import { Task } from '../../../../types';

interface TodaysTasksCardProps {
    todayTasks: Task[];
    onToggleComplete: (task: Task) => void;
    onOpenCreateModal: () => void;
    onViewTaskDetail: (task: Task) => void;
}

export const TodaysTasksCard: React.FC<TodaysTasksCardProps> = ({
    todayTasks,
    onToggleComplete,
    onOpenCreateModal,
    onViewTaskDetail,
}) => {
    return (
        <div className="lg:col-span-7 neu-card p-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#549acb]" />
                        <h3 className="text-sm font-extrabold text-[#1a1c35]">Today's Tasks</h3>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full neu-badge text-[#549acb]">
                        {todayTasks.length} Tasks
                    </span>
                </div>
                <p className="text-[11px] text-[#717699] font-medium mb-4">
                    Tasks & sub-tasks scheduled for today
                </p>

                <div className="space-y-2.5">
                    {todayTasks.length === 0 ? (
                        <div className="text-center py-6 text-xs text-[#717699] font-medium neu-inset rounded-2xl p-4">
                            No tasks scheduled for today yet.
                            <button
                                onClick={onOpenCreateModal}
                                className="block mx-auto mt-2 text-[#549acb] font-bold hover:underline"
                            >
                                + Add a Task for Today
                            </button>
                        </div>
                    ) : (
                        todayTasks.map((t, idx) => {
                            const isCompleted = t.status === 'completed';
                            return (
                                <div
                                    key={t._id}
                                    className="neu-inset p-3 rounded-2xl flex items-center justify-between gap-3 group hover:border-[#549acb] transition-all"
                                >
                                    <div className="flex items-center space-x-3 min-w-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleComplete(t);
                                            }}
                                            className="shrink-0 transition-transform active:scale-95"
                                        >
                                            {isCompleted ? (
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                </div>
                                            ) : (
                                                <Circle className="w-5 h-5 text-[#717699] hover:text-[#549acb]" />
                                            )}
                                        </button>

                                        <span
                                            onClick={() => onViewTaskDetail(t)}
                                            className={`text-xs font-bold truncate cursor-pointer ${isCompleted ? 'line-through text-[#717699]' : 'text-[#1a1c35]'
                                                }`}
                                        >
                                            {t.title}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2 shrink-0">
                                        <span
                                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${isCompleted
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-sky-100 text-sky-700'
                                                }`}
                                        >
                                            {isCompleted ? 'Completed' : 'In Progress'}
                                        </span>

                                        <span className="text-[10px] font-semibold text-[#717699] hidden sm:inline">
                                            {idx === 0 ? '09:00 AM' : idx === 1 ? '02:00 PM' : '05:00 PM'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
