import React from 'react';
import { Activity } from 'lucide-react';
import { TaskActivityItem } from '../../../../../../types';
import { TaskActivityCommentBox } from './TaskActivityCommentBox';
import { TaskActivityItemRow } from './TaskActivityItemRow';

interface TaskActivityTabProps {
    taskId: string;
    activities: TaskActivityItem[];
    onAddComment: (message: string, commentType?: string) => void;
    onDeleteActivity?: (activityId: string) => void;
}

export const TaskActivityTab: React.FC<TaskActivityTabProps> = ({
    taskId,
    activities,
    onAddComment,
    onDeleteActivity,
}) => {
    return (
        <div className="space-y-6 animate-fadeIn max-w-4xl">
            {/* Post Check-in / Comment Box */}
            <TaskActivityCommentBox onAddComment={onAddComment} />

            {/* Activities Audit Trail Timeline */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#1a1c35]">
                        Audit Trail &amp; Work Stream ({activities.length})
                    </h3>
                </div>

                {activities.length > 0 ? (
                    <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-5 before:w-0.5 before:bg-[#c8d0e0]/60">
                        {activities.map((act) => (
                            <TaskActivityItemRow
                                key={act.id}
                                item={act}
                                onDeleteActivity={onDeleteActivity}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="neu-inset p-8 rounded-2xl text-center space-y-2 bg-[#dbe2ee]/30">
                        <p className="text-xs font-bold text-[#4a4e69]">No activity recorded yet</p>
                        <p className="text-[11px] text-slate-400">
                            Check-ins, subtask completions, status changes, and files will appear here automatically.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
