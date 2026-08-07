import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Sparkles,
  Lock,
  Unlock,
  Repeat,
  Flame,
  Trophy,
  Clock,
  Tag,
  Edit3,
  Trash2,
  ListTodo,
  Plus,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { Task } from '../types';

interface TaskDetailModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onToggleComplete: (task: Task) => void;
  onTogglePrivate: (task: Task) => void;
  onOpenAIAssist: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  task,
  onClose,
  onToggleComplete,
  onTogglePrivate,
  onOpenAIAssist,
  onEditTask,
  onDeleteTask,
}) => {
  const [subtasks, setSubtasks] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Load subtasks from localStorage or state when task changes
  useEffect(() => {
    if (!task) return;
    const stored = localStorage.getItem(`vow_subtasks_${task._id}`);
    if (stored) {
      try {
        setSubtasks(JSON.parse(stored));
      } catch (e) {
        setSubtasks([]);
      }
    } else {
      // Default initial micro-step guide if none saved
      setSubtasks([]);
    }
  }, [task]);

  const saveSubtasks = (updated: { id: string; text: string; done: boolean }[]) => {
    setSubtasks(updated);
    if (task) {
      localStorage.setItem(`vow_subtasks_${task._id}`, JSON.stringify(updated));
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    const updated = [
      ...subtasks,
      { id: Date.now().toString(), text: newSubtaskText.trim(), done: false },
    ];
    saveSubtasks(updated);
    setNewSubtaskText('');
  };

  const handleToggleSubtask = (id: string) => {
    const updated = subtasks.map((st) => (st.id === id ? { ...st, done: !st.done } : st));
    saveSubtasks(updated);
  };

  const handleDeleteSubtask = (id: string) => {
    const updated = subtasks.filter((st) => st.id !== id);
    saveSubtasks(updated);
  };

  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'completed';
  const currentStreak = task.effectiveCurrentStreak ?? task.currentStreak ?? 0;
  const bestStreak = task.effectiveBestStreak ?? task.bestStreak ?? 0;

  // Deadline calculation
  let timeLeftStr = null;
  let isStruggling = false;
  if (task.endTime) {
    const now = new Date().getTime();
    const end = new Date(task.endTime).getTime();
    const diff = end - now;
    if (diff <= 0) {
      timeLeftStr = 'Overdue';
      isStruggling = !isCompleted;
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const days = Math.floor(hours / 24);
      if (days > 0) timeLeftStr = `${days}d ${hours % 24}h remaining`;
      else if (hours > 0) timeLeftStr = `${hours}h ${minutes}m remaining`;
      else timeLeftStr = `${minutes}m remaining`;

      isStruggling = diff < 4 * 60 * 60 * 1000 && !isCompleted;
    }
  }

  const completedSubtasksCount = subtasks.filter((s) => s.done).length;
  const subtaskProgress =
    subtasks.length > 0 ? Math.round((completedSubtasksCount / subtasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="neu-card w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden bg-[#E0E5EC] shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-white/50 flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5 flex-1 min-w-0">
            <button
              onClick={() => onToggleComplete(task)}
              className={`mt-1 w-8 h-8 rounded-xl neu-button flex items-center justify-center shrink-0 transition-transform ${
                isCompleted
                  ? 'bg-emerald-500 text-white shadow-inner scale-105 border-emerald-500'
                  : 'text-[#717699] hover:text-[#549acb] hover:scale-110'
              }`}
              title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <Circle className="w-5 h-5 text-[#717699]" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                <h2
                  className={`text-xl sm:text-2xl font-extrabold text-[#1a1c35] break-words ${
                    isCompleted ? 'line-through text-[#717699]/80 font-normal' : ''
                  }`}
                >
                  {task.title}
                </h2>

                {task.isHabit && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg neu-inset bg-[#E0E5EC] text-[#549acb] uppercase tracking-wide flex items-center space-x-1 shrink-0">
                    <Repeat className="w-3 h-3 text-[#549acb]" />
                    <span>Daily Habit</span>
                  </span>
                )}

                {task.isPrivate && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg neu-inset bg-[#E0E5EC] text-purple-700 uppercase tracking-wide flex items-center space-x-1 shrink-0">
                    <Lock className="w-3 h-3 text-purple-600" />
                    <span>Growth Vault</span>
                  </span>
                )}
              </div>

              {/* Status Bar */}
              <div className="flex items-center space-x-3 mt-2 flex-wrap gap-y-1">
                <div className="flex items-center space-x-1 text-xs font-bold text-[#549acb]">
                  <Flame className="w-4 h-4 fill-[#549acb]" />
                  <span>{currentStreak} Day Streak</span>
                </div>
                <div className="flex items-center space-x-1 text-xs font-bold text-[#44476A]">
                  <Trophy className="w-4 h-4 text-[#549acb]" />
                  <span>Best: {bestStreak}d</span>
                </div>

                {timeLeftStr && (
                  <div
                    className={`flex items-center space-x-1 text-xs font-bold px-2.5 py-0.5 rounded-lg neu-badge ${
                      timeLeftStr === 'Overdue'
                        ? 'text-rose-700 bg-rose-50 border border-rose-200'
                        : isStruggling
                        ? 'text-amber-700 bg-amber-50 border border-amber-200'
                        : 'text-[#717699]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timeLeftStr}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35] shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Description */}
          {task.description ? (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#717699] uppercase tracking-wider">
                Description & Notes
              </h4>
              <p className="text-sm text-[#44476A] leading-relaxed whitespace-pre-wrap neu-inset p-4 rounded-2xl bg-[#E0E5EC]">
                {task.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#717699] italic">No description provided for this goal.</p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#717699] uppercase tracking-wider">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-bold text-[#717699] neu-inset bg-[#E0E5EC] px-3 py-1 rounded-xl flex items-center space-x-1.5 uppercase tracking-wider"
                  >
                    <Tag className="w-3 h-3 text-[#717699]" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks / Micro-Steps Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ListTodo className="w-4 h-4 text-[#549acb]" />
                <h4 className="text-xs font-bold text-[#717699] uppercase tracking-wider">
                  Micro-Steps & Action Checklist
                </h4>
              </div>
              {subtasks.length > 0 && (
                <span className="text-xs font-bold text-[#549acb]">
                  {completedSubtasksCount}/{subtasks.length} ({subtaskProgress}%)
                </span>
              )}
            </div>

            {/* Progress bar */}
            {subtasks.length > 0 && (
              <div className="w-full h-2 rounded-full neu-inset overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#549acb] to-emerald-500 transition-all duration-300"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>
            )}

            {/* Subtask items list */}
            <div className="space-y-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl neu-card hover:bg-white/30 transition-all"
                >
                  <button
                    onClick={() => handleToggleSubtask(st.id)}
                    className="flex items-center space-x-2.5 flex-1 text-left min-w-0"
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                        st.done
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-gray-400/60'
                      }`}
                    >
                      {st.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span
                      className={`text-sm font-medium text-[#1a1c35] truncate ${
                        st.done ? 'line-through text-[#717699]' : ''
                      }`}
                    >
                      {st.text}
                    </span>
                  </button>

                  <button
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="p-1 rounded-lg text-[#717699] hover:text-rose-600 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                placeholder="Add a micro-step..."
                className="flex-1 px-3.5 py-2 rounded-xl neu-input text-xs font-medium"
              />
              <button
                type="submit"
                className="neu-button px-3 py-2 rounded-xl text-xs font-bold text-[#549acb] flex items-center space-x-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 border-t border-white/50 flex flex-wrap items-center justify-between gap-3 bg-[#E0E5EC]">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenAIAssist(task);
              }}
              className="px-3.5 py-2 rounded-xl neu-button text-xs font-bold text-[#549acb] flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#549acb]" />
              <span>Ask AI Coach</span>
            </button>

            <button
              onClick={() => {
                onTogglePrivate(task);
              }}
              className="px-3 py-2 rounded-xl neu-button text-xs font-bold text-[#717699] hover:text-purple-600 flex items-center space-x-1.5"
            >
              {task.isPrivate ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Make Public</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Move to Growth Vault</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onEditTask(task);
              }}
              className="px-3.5 py-2 rounded-xl neu-button text-xs font-bold text-[#717699] hover:text-[#549acb] flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Goal</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onDeleteTask(task);
              }}
              className="px-3 py-2 rounded-xl neu-button text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
