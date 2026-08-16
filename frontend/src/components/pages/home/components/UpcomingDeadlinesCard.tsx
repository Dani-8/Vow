import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { Task } from '../../../../types';

interface UpcomingDeadlinesCardProps {
  tasks: Task[];
  onViewTaskDetail?: (task: Task) => void;
}

export const UpcomingDeadlinesCard: React.FC<UpcomingDeadlinesCardProps> = ({
  tasks,
  onViewTaskDetail,
}) => {
  // Find active tasks that have scheduled endTime / due dates or are pending
  const pendingTasksWithDates = tasks
    .filter((t) => t.status !== 'completed' && t.endTime)
    .sort((a, b) => new Date(a.endTime!).getTime() - new Date(b.endTime!).getTime())
    .slice(0, 3);

  // Fallback to active tasks without explicit dates if needed
  const activeTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 3);
  const displayTasks = pendingTasksWithDates.length > 0 ? pendingTasksWithDates : activeTasks;

  return (
    <div className="neu-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#549acb]" />
            <h3 className="text-sm font-extrabold text-[#1a1c35]">Upcoming Deadlines</h3>
          </div>
        </div>
        <p className="text-[11px] text-[#717699] font-medium mb-3">Next important due dates</p>

        {displayTasks.length > 0 ? (
          <div className="space-y-2">
            {displayTasks.map((task) => {
              const dateStr = task.endTime
                ? new Date(task.endTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Pending';

              return (
                <div
                  key={task._id}
                  onClick={() => onViewTaskDetail?.(task)}
                  className="flex items-center justify-between text-xs p-2 rounded-xl neu-inset cursor-pointer hover:border-[#549acb] transition-all"
                >
                  <span className="font-bold text-[#1a1c35] truncate max-w-[150px]">
                    {task.title}
                  </span>
                  <span className="text-[10px] font-extrabold text-[#549acb] shrink-0">
                    {dateStr}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="neu-inset p-3 rounded-xl flex items-center space-x-2 text-[#717699]">
            <CheckCircle2 className="w-4 h-4 text-[#549acb] shrink-0" />
            <p className="text-xs font-semibold">No pending deadlines</p>
          </div>
        )}
      </div>
    </div>
  );
};
