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

export function getTaskAttachments(taskId: string, taskTitle?: string): TaskAttachment[] {
  if (!taskId && !taskTitle) return [];
  const key = `vow_task_attachments_${taskId || 'default'}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn(`Error reading attachments for task ${taskId}:`, e);
  }

  const seedKey = findSeedKey(DEFAULT_TASK_ATTACHMENTS, taskId, taskTitle);
  if (seedKey && DEFAULT_TASK_ATTACHMENTS[seedKey]) {
    try {
      localStorage.setItem(key, JSON.stringify(DEFAULT_TASK_ATTACHMENTS[seedKey]));
    } catch {
      // ignore
    }
    return DEFAULT_TASK_ATTACHMENTS[seedKey];
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

  // Auto record activity
  addTaskActivity(taskId, {
    type: 'attachment_add',
    message: `Added attachment: "${newAttachment.name}"`,
    user: 'Alex Rivera',
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
      user: 'Alex Rivera',
    });
  }
}

export function getTaskActivities(taskId: string, taskTitle?: string): TaskActivityItem[] {
  if (!taskId && !taskTitle) return [];
  const key = `vow_task_activities_${taskId || 'default'}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn(`Error reading activities for task ${taskId}:`, e);
  }

  const seedKey = findSeedKey(DEFAULT_TASK_ACTIVITIES, taskId, taskTitle);
  if (seedKey && DEFAULT_TASK_ACTIVITIES[seedKey]) {
    try {
      localStorage.setItem(key, JSON.stringify(DEFAULT_TASK_ACTIVITIES[seedKey]));
    } catch {
      // ignore
    }
    return DEFAULT_TASK_ACTIVITIES[seedKey];
  }

  // Generic created fallback
  return [
    {
      id: `act_init_${taskId}`,
      type: 'created',
      message: 'Task initiated and organized in workspace',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];
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
