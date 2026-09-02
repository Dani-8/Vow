import React from 'react';
import { CheckCircle2, Circle, Repeat, Lock } from 'lucide-react';
import { Task } from '../../../../../../types';

interface TaskCardHeaderProps {
    task: Task;
    isCompleted: boolean;
    onToggleComplete: (task: Task) => void;
}

export const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
    task,
    isCompleted,
    onToggleComplete,
}) => {
    return (
        <div className="flex items-start space-x-3 flex-1 min-w-0">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(task);
                }}
                className={`mt-0.5 w-7 h-7 rounded-xl neu-button flex items-center justify-center shrink-0 transition-transform ${isCompleted
                        ? 'bg-emerald-500 text-white shadow-inner scale-105 border-emerald-500'
                        : 'text-[#717699] hover:text-[#549acb] hover:scale-110'
                    }`}
                title={isCompleted ? 'Mark as incomplete' : 'Mark complete today'}
            >
                {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                    <Circle className="w-5 h-5 text-[#717699]" />
                )}
            </button>

            <div className="flex-1 min-w-0 group/click">
                <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                    <h3
                        className={`text-base font-bold text-[#1a1c35] group-hover/click:text-[#549acb] transition-colors break-words ${isCompleted ? 'line-through text-[#717699] font-normal' : ''
                            }`}
                    >
                        {task.title}
                    </h3>

                    {task.isHabit && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg neu-inset bg-[#E0E5EC] text-[#549acb] uppercase tracking-wide flex items-center space-x-1 shrink-0">
                            <Repeat className="w-3 h-3 text-[#549acb]" />
                            <span>Daily Habit</span>
                        </span>
                    )}

                    {task.isPrivate && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg neu-inset bg-[#E0E5EC] text-purple-700 uppercase tracking-wide flex items-center space-x-1 shrink-0">
                            <Lock className="w-3 h-3 text-purple-600" />
                            <span>Growth Vault</span>
                        </span>
                    )}
                </div>

                {task.description && (
                    <p
                        className={`text-xs text-[#717699] mt-1 leading-snug line-clamp-2 break-words w-full ${isCompleted ? 'text-[#717699]/70' : ''
                            }`}
                    >
                        {task.description}
                    </p>
                )}
            </div>
        </div>
    );
};
