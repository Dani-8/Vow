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

export function saveTaskStickyNotes(taskId: string, notes: TaskStickyNote[]): void {
  if (!taskId) return;
  const key = `vow_task_sticky_notes_${taskId}`;
  try {
    localStorage.setItem(key, JSON.stringify(notes));
  } catch (e) {
    console.error(`Error saving sticky notes for task ${taskId}:`, e);
  }

  notifyTaskDetailUpdated(taskId, 'note');
}

export function addTaskStickyNote(
  taskId: string,
  noteData: Omit<TaskStickyNote, 'id' | 'createdAt' | 'updatedAt'>
): TaskStickyNote {
  const current = getTaskStickyNotes(taskId);
  const newNote: TaskStickyNote = {
    ...noteData,
    id: `sn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newNote, ...current];
  saveTaskStickyNotes(taskId, updated);

  addTaskActivity(taskId, {
    type: 'note_update',
    message: `Pinned new sticky note: "${newNote.title || 'Untitled Note'}"`,
    user: 'You',
  });

  return newNote;
}

export function updateTaskStickyNote(
  taskId: string,
  noteId: string,
  updates: Partial<Omit<TaskStickyNote, 'id' | 'createdAt'>>
): void {
  const current = getTaskStickyNotes(taskId);
  const updated = current.map((n) => {
    if (n.id === noteId) {
      return {
        ...n,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return n;
  });

  saveTaskStickyNotes(taskId, updated);
}

export function deleteTaskStickyNote(taskId: string, noteId: string): void {
  const current = getTaskStickyNotes(taskId);
  const deleted = current.find((n) => n.id === noteId);
  const updated = current.filter((n) => n.id !== noteId);
  saveTaskStickyNotes(taskId, updated);

  if (deleted) {
    addTaskActivity(taskId, {
      type: 'note_update',
      message: `Removed sticky note: "${deleted.title || 'Note'}"`,
      user: 'You',
    });
  }
}

export function getTaskNote(taskId: string): string {
  if (!taskId) return '';
  const key = `vow_task_note_${taskId}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) return saved;
  } catch (e) {
    console.warn(`Error reading note for task ${taskId}:`, e);
  }

  return '';
