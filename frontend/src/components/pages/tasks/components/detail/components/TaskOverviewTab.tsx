import React from 'react';
import {
    CheckCircle2,
    Clock,
    Flame,
    StickyNote,
    Paperclip,
    Activity,
    Tag,
    Calendar,
    AlertCircle,
    ExternalLink,
    ChevronRight,
    ListTodo,
    Sparkles,
    ArrowUpRight,
    Pin
} from 'lucide-react';
import { Task, SubTask, TaskAttachment, TaskActivityItem, TaskStickyNote } from '../../../../../../types';
import { TaskTabType } from './TaskDetailTabs';
import { RotatingConsequenceBanner } from '../../../../../common/RotatingConsequenceBanner';

interface TaskOverviewTabProps {
    task: Task;
    subTasks: SubTask[];
    stickyNotes: TaskStickyNote[];
    attachments: TaskAttachment[];
    activities: TaskActivityItem[];
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    onTabChange: (tab: TaskTabType) => void;
    onToggleComplete: (task: Task) => void;
    onEditTask?: (task: Task) => void;
}

export const TaskOverviewTab: React.FC<TaskOverviewTabProps> = ({
    task,
    subTasks,
    stickyNotes,
    attachments,
    activities,
    completedCount,
    totalCount,
    progressPercent,
    onTabChange,
    onToggleComplete,
    onEditTask,
}) => {
    const isCompleted = task.status === 'completed';

    // Priority color config
    const getPriorityBadge = (priority?: string) => {
        switch (priority) {
            case 'High':
                return { label: 'High Priority', bg: 'bg-rose-500/10 text-rose-600 border-rose-200' };
            case 'Medium':
                return { label: 'Medium Priority', bg: 'bg-amber-500/10 text-amber-600 border-amber-200' };
            case 'Low':
                return { label: 'Low Priority', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
            default:
                return { label: 'Standard Priority', bg: 'bg-slate-500/10 text-slate-600 border-slate-200' };
        }
    };

    const priorityStyle = getPriorityBadge(task.priority);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            {/* Left / Main Column: Core Status, Progress & Scratchpad Preview */}
            <div className="lg:col-span-8 space-y-6">
                {/* 1. Status & Sub-tasks Progress Card */}
                <div className="neu-card p-6 bg-[#E0E5EC] space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${priorityStyle.bg}`}>
                                {priorityStyle.label}
                            </span>
                            <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${task.isHabit ? 'bg-indigo-500/10 text-indigo-600' : 'bg-blue-500/10 text-blue-600'
                                }`}>
                                {task.isHabit ? 'Daily Habit' : 'Milestone Task'}
                            </span>
                            {task.isPrivate && (
                                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-700">
                                    🔒 Private Vault
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => onToggleComplete(task)}
                            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide flex items-center space-x-2 transition-all neu-button ${isCompleted
                                ? 'text-emerald-700 bg-emerald-500/15 hover:bg-emerald-500/25'
                                : 'text-slate-700 hover:text-[#1a1c35]'
                                }`}
                        >
                            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
                        </button>
                    </div>

                    {/* Description */}
                    {task.description ? (
                        <p className="text-sm font-medium text-[#4a4e69] leading-relaxed">
                            {task.description}
                        </p>
                    ) : (
                        <p className="text-sm italic text-slate-400">
                            No description added yet. You can edit this task to add clear goals and requirements.
                        </p>
                    )}

                    {/* Consequences of Skipping / Cost of Inaction Banner */}
                    <RotatingConsequenceBanner
                        consequences={task.consequencesOfSkipping}
                        consequenceOfSkipping={task.consequenceOfSkipping}
                        onEdit={onEditTask ? () => onEditTask(task) : undefined}
                        title="Consequences of Skipping"
                        badgeLabel="Cost of Inaction"
                    />

                    {/* Subtask Progress Bar */}
                    <div className="pt-2 space-y-2 border-t border-[#c8d0e0]/70">
                        <div className="flex items-center justify-between text-xs font-bold text-[#717699]">
                            <div className="flex items-center space-x-1.5 text-[#1a1c35]">
                                <ListTodo className="w-4 h-4 text-[#2563eb]" />
                                <span className="font-black">Sub-task Breakdown</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>{completedCount} of {totalCount} completed</span>
                                <span className="text-[#2563eb] font-black">({progressPercent}%)</span>
                            </div>
                        </div>

                        <div className="h-3 w-full neu-inset rounded-full overflow-hidden p-0.5 bg-[#d1d9e6]">
                            <div
                                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#2563eb] to-[#3b82f6]"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <div className="flex justify-end pt-1">
                            <button
                                onClick={() => onTabChange('sub-tasks')}
                                className="text-xs font-bold text-[#2563eb] hover:underline flex items-center space-x-1"
                            >
                                <span>Manage &amp; Timeline Breakdown</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Pinned Sticky Notes Board Preview */}
                <div className="neu-card p-6 bg-[#E0E5EC] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-xl neu-button text-amber-600">
                                <StickyNote className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#1a1c35]">Sticky Notes &amp; Guidelines</h3>
                                <span className="text-[11px] font-medium text-[#717699]">{stickyNotes.length} pinned paper notes</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onTabChange('notes')}
                            className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center space-x-1"
                        >
                            <span>Open Sticky Board</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {stickyNotes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {stickyNotes.slice(0, 4).map((note) => {
                                const bgMap: Record<string, string> = {
                                    yellow: 'bg-amber-100/90 border-amber-300 text-amber-950',
                                    green: 'bg-emerald-100/90 border-emerald-300 text-emerald-950',
                                    blue: 'bg-sky-100/90 border-sky-300 text-sky-950',
                                    purple: 'bg-purple-100/90 border-purple-300 text-purple-950',
                                    rose: 'bg-rose-100/90 border-rose-300 text-rose-950',
                                    gray: 'bg-slate-100/90 border-slate-300 text-slate-900',
                                };
                                const style = bgMap[note.color || 'yellow'] || bgMap.yellow;

                                return (
                                    <div
                                        key={note.id}
                                        onClick={() => onTabChange('notes')}
                                        className={`p-4 rounded-xl border shadow-xs hover:shadow-md cursor-pointer transition-all ${style} space-y-2`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black truncate">{note.title || 'Sticky Note'}</h4>
                                            {note.isPinned && <Pin className="w-3 h-3 fill-current opacity-70" />}
                                        </div>
                                        <p className="text-[11px] leading-relaxed line-clamp-3 font-medium opacity-90">
                                            {note.content}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            onClick={() => onTabChange('notes')}
                            className="p-5 rounded-xl border border-dashed border-[#c8d0e0] text-center cursor-pointer hover:bg-slate-200/30 transition-all space-y-1"
                        >
                            <p className="text-xs font-bold text-[#4a4e69]">No sticky notes pinned yet.</p>
                            <p className="text-[11px] text-slate-400">Click to pin multi-colored cards for research, checklists, and rules.</p>
                        </div>
                    )}
                </div>

                {/* 3. Files & Attached Resources Preview */}
                <div className="neu-card p-6 bg-[#E0E5EC] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-xl neu-button text-indigo-600">
                                <Paperclip className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#1a1c35]">Resources &amp; Attachments</h3>
                                <span className="text-[11px] font-medium text-[#717699]">{attachments.length} attached items</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onTabChange('files')}
                            className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                        >
                            <span>Vault &amp; Links</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {attachments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {attachments.slice(0, 4).map((att) => (
                                <div
                                    key={att.id}
                                    className="p-3 rounded-xl neu-flat bg-[#E0E5EC] flex items-center justify-between hover:scale-[1.01] transition-transform"
                                >
                                    <div className="flex items-center space-x-2.5 overflow-hidden">
                                        <span className="p-2 rounded-lg neu-inset text-xs font-black uppercase text-indigo-600">
                                            {att.type === 'link' ? '🔗' : att.type === 'pdf' ? '📄' : '📁'}
                                        </span>
                                        <div className="truncate">
                                            <p className="text-xs font-bold text-[#1a1c35] truncate">{att.name}</p>
                                            <span className="text-[10px] text-slate-400">{att.size || 'Resource link'}</span>
                                        </div>
                                    </div>

                                    {att.url && att.url !== '#' && (
                                        <a
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg neu-button text-slate-500 hover:text-indigo-600 shrink-0 ml-2"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            onClick={() => onTabChange('files')}
                            className="p-5 rounded-xl border border-dashed border-[#c8d0e0] text-center cursor-pointer hover:bg-slate-200/30 transition-all space-y-1"
                        >
                            <p className="text-xs font-bold text-[#4a4e69]">No files or links attached yet.</p>
                            <p className="text-[11px] text-slate-400">Click to upload documents, screenshots, or Figma/GitHub bookmarks.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Metadata & Recent Activity Timeline */}
            <div className="lg:col-span-4 space-y-6">
                {/* Metadata Details Card */}
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

                {/* Activity Quick Stream */}
                <div className="neu-card p-5 bg-[#E0E5EC] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-xs font-black uppercase tracking-wider text-[#1a1c35]">
                                Recent Audit Trail
                            </h3>
                        </div>

                        <button
                            onClick={() => onTabChange('activity')}
                            className="text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                            View Full History
                        </button>
                    </div>

                    <div className="space-y-3">
                        {activities.slice(0, 3).map((act) => (
                            <div key={act.id} className="text-xs space-y-0.5 pb-2 border-b border-[#c8d0e0]/50 last:border-0 last:pb-0">
                                <p className="text-[#1a1c35] font-medium leading-tight">{act.message}</p>
                                <span className="text-[10px] text-slate-400">
                                    {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
