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
}

export function saveTaskNote(taskId: string, content: string): void {
  if (!taskId) return;
  const key = `vow_task_note_${taskId}`;
  try {
    localStorage.setItem(key, content);
  } catch (e) {
    console.error(`Error saving note for task ${taskId}:`, e);
  }

  notifyTaskDetailUpdated(taskId, 'note');
}

export function getTaskAttachments(taskId: string, _taskTitle?: string): TaskAttachment[] {
  if (!taskId) return [];
  const key = `vow_task_attachments_${taskId}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn(`Error reading attachments for task ${taskId}:`, e);
  }

  return [];
}

export function saveTaskAttachments(taskId: string, attachments: TaskAttachment[]): void {
  if (!taskId) return;
  const key = `vow_task_attachments_${taskId}`;
  try {
    localStorage.setItem(key, JSON.stringify(attachments));
  } catch (e) {
    console.error(`Error saving attachments for task ${taskId}:`, e);
  }

  notifyTaskDetailUpdated(taskId, 'attachments');
}

export function addTaskAttachment(
  taskId: string,
  attachmentData: Omit<TaskAttachment, 'id' | 'uploadedAt'>
): TaskAttachment {
  const current = getTaskAttachments(taskId);
  const newAttachment: TaskAttachment = {
    ...attachmentData,
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    uploadedAt: new Date().toISOString(),
  };

  const updated = [newAttachment, ...current];
  saveTaskAttachments(taskId, updated);

  addTaskActivity(taskId, {
    type: 'attachment_add',
    message: `Added attachment: "${newAttachment.name}"`,
    user: 'You',
  });

  return newAttachment;
}

export function deleteTaskAttachment(taskId: string, attachmentId: string): void {
  const current = getTaskAttachments(taskId);
  const deleted = current.find((a) => a.id === attachmentId);
  const updated = current.filter((a) => a.id !== attachmentId);
  saveTaskAttachments(taskId, updated);

  if (deleted) {
    addTaskActivity(taskId, {
      type: 'attachment_add',
      message: `Removed attachment: "${deleted.name}"`,
      user: 'You',
    });
  }
}

export function getTaskActivities(taskId: string, _taskTitle?: string): TaskActivityItem[] {
  if (!taskId) return [];
  const key = `vow_task_activities_${taskId}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn(`Error reading activities for task ${taskId}:`, e);
  }

  return [];
}

export function saveTaskActivities(taskId: string, activities: TaskActivityItem[]): void {
  if (!taskId) return;
  const key = `vow_task_activities_${taskId}`;
  try {
    localStorage.setItem(key, JSON.stringify(activities));
  } catch (e) {
    console.error(`Error saving activities for task ${taskId}:`, e);
  }

  notifyTaskDetailUpdated(taskId, 'activity');
}

export function addTaskActivity(
  taskId: string,
  activityData: Omit<TaskActivityItem, 'id' | 'timestamp'>
): TaskActivityItem {
  const current = getTaskActivities(taskId);
  const newActivity: TaskActivityItem = {
    ...activityData,
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  const updated = [newActivity, ...current];
  saveTaskActivities(taskId, updated);
  return newActivity;
}

export function deleteTaskActivity(taskId: string, activityId: string): void {
  const current = getTaskActivities(taskId);
  const updated = current.filter((a) => a.id !== activityId);
  saveTaskActivities(taskId, updated);
}

function notifyTaskDetailUpdated(taskId: string, updateType: 'note' | 'attachments' | 'activity'): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(TASK_DETAIL_UPDATED_EVENT, {
        detail: { taskId, updateType },
      })
    );
  }
}
