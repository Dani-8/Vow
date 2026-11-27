import { TaskAttachment, TaskActivityItem, TaskStickyNote } from '../types';

export const TASK_DETAIL_UPDATED_EVENT = 'vow_task_detail_updated';

export function getTaskStickyNotes(
  taskId: string,
  _taskTitle?: string,
  initialStickyNotes?: TaskStickyNote[]
): TaskStickyNote[] {
  if (!taskId) return [];
  const key = `vow_task_sticky_notes_${taskId}`;

  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`Error reading sticky notes for task ${taskId}:`, e);
  }

  if (initialStickyNotes && initialStickyNotes.length > 0) {
    try {
      localStorage.setItem(key, JSON.stringify(initialStickyNotes));
    } catch {
      // ignore storage errors
    }
    return initialStickyNotes;
  }

  return [];
}