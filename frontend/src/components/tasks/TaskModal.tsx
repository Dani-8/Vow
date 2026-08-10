import React from 'react';
import { X, Sparkles, Calendar, Tag, Lock, Unlock, Repeat, Check } from 'lucide-react';
import { Task } from '../../types';
import { useTaskForm } from '../../hooks/useTaskForm';

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    description?: string;
    tags?: string[];
    startTime?: string | null;
    endTime?: string | null;
    isPrivate?: boolean;
    isHabit?: boolean;
  }) => Promise<void>;
  editingTask?: Task | null;
  defaultIsPrivate?: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  defaultIsPrivate = false,
}) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    tagsInput,
    setTagsInput,
    endTime,
    setEndTime,
    isHabit,
    setIsHabit,
    isPrivate,
    setIsPrivate,
    loading,
    error,
    handleSubmit,
  } = useTaskForm({
    editingTask,
    isOpen,
    defaultIsPrivate,
    onSubmit,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="neu-card w-full max-w-lg p-6 bg-[#E0E5EC] relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl neu-button flex items-center justify-center text-[#6D5DFC] bg-[#E0E5EC]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1a1c35]">
              {editingTask ? 'Edit Goal or Habit' : 'Create New Goal / Habit'}
            </h2>
            <p className="text-xs text-[#717699] font-medium">Set intentions, deadlines, and growth targets</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Goal / Habit Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 20 pages, Daily Meditation, Draft Q3 Plan..."
              className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Description / Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context or micro-intentions..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsHabit(!isHabit)}
              className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                isHabit ? 'neu-inset text-indigo-700 bg-indigo-50/50' : 'neu-button text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Repeat className="w-4 h-4 text-indigo-600" />
                <span>Daily Habit</span>
              </div>
              {isHabit && <Check className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                isPrivate ? 'neu-inset text-purple-700 bg-purple-50/50' : 'neu-button text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                {isPrivate ? <Lock className="w-4 h-4 text-purple-600" /> : <Unlock className="w-4 h-4 text-slate-500" />}
                <span>{isPrivate ? 'Growth Vault' : 'Public Task'}</span>
              </div>
              {isPrivate && <Check className="w-4 h-4 text-purple-600" />}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Target Deadline (Optional)</span>
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium text-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>Tags (comma separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Wellness, Focus, Reading, Personal..."
              className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl neu-button text-slate-600 font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl neu-button-primary font-semibold text-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingTask ? 'Update Goal' : 'Save Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
