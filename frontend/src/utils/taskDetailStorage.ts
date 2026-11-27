    },
  ],
  'task_mern_project_m3k9p': [
    {
      id: 'att_mern_1',
      name: 'Express & RESTful API Blueprint Specs',
      type: 'link',
      url: 'https://expressjs.com/',
      uploadedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
      id: 'att_mern_2',
      name: 'Database_Schema_ERD_Diagram.pdf',
      type: 'pdf',
      size: '1.9 MB',
      url: '#',
      uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'att_mern_3',
      name: 'Cloud_Run_Container_Setup.docx',
      type: 'doc',
      size: '380 KB',
      url: '#',
      uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
};

// Default initial activity logs seed
const DEFAULT_TASK_ACTIVITIES: Record<string, TaskActivityItem[]> = {
  'task_russian_mastery_r7u2k': [
    {
      id: 'act_ru_1',
      type: 'created',
      message: 'Created task "Russian Language Learning: Daily Fluency & Grammar Path"',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: 'act_ru_2',
      type: 'subtask_complete',
      message: 'Completed subtask: "Cyrillic Alphabet & Phonetic Pronunciation Drills"',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'act_ru_3',
      type: 'attachment_add',
      message: 'Attached reference link: "OpenRussian Dictionary & Declensions"',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'act_ru_4',
      type: 'comment',
      message: 'Completed today\'s flashcard set (45 cards). Feeling much more confident with pronunciation!',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ],
  'task_ai_engineer_a8x4m': [
    {
      id: 'act_ai_1',
      type: 'created',
      message: 'Created goal "AI Engineering: Production Agents, RAG & LLM Workflows"',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
      id: 'act_ai_2',
      type: 'subtask_complete',
      message: 'Completed subtask: "Gemini 2.5 API Integration & Structured Schema Outputs"',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'act_ai_3',
      type: 'note_update',
      message: 'Pinned architecture guide: "Core Architecture Pillars"',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'act_ai_4',
      type: 'comment',
      message: 'Successfully verified tool-calling response schemas with zero hallucination rate.',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ],
  'task_mern_project_m3k9p': [
    {
      id: 'act_mern_1',
      type: 'created',
      message: 'Created project goal "Full-Stack MERN Project: Scalable App & Cloud Deployment"',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
    {
      id: 'act_mern_2',
      type: 'subtask_complete',
      message: 'Completed subtask: "Express RESTful API Architecture & JWT Auth Middleware"',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'act_mern_3',
      type: 'subtask_complete',
      message: 'Completed subtask: "Database Schema Models, Indexing & Validation"',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'act_mern_4',
      type: 'comment',
      message: 'Frontend components modularized cleanly. Ready to connect real-time reactive streams.',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
};

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
