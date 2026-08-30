import { TaskAttachment, TaskActivityItem, TaskStickyNote } from '../types';

export const TASK_DETAIL_UPDATED_EVENT = 'vow_task_detail_updated';

// Default initial sticky notes seed
const DEFAULT_TASK_STICKY_NOTES: Record<string, TaskStickyNote[]> = {
  'task_russian_mastery_r7u2k': [
    {
      id: 'sn_ru_1',
      title: 'Grammar Pillar & Rules',
      content: `Master Prepositional case endings first (*о ком? о чём?*), then Accusative for direct objects.

- [ ] Memorize masculine vs feminine noun endings
- [ ] Practice 10 prepositions with locative nouns`,
      color: 'yellow',
      isPinned: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'sn_ru_2',
      title: 'Cyrillic False Friends ⚠️',
      content: `Be careful with Latin lookalikes:
• В = V sound
• Н = N sound
• Р = R sound (rolled)
• С = S sound
• У = OO sound
• Х = KH sound`,
      color: 'rose',
      isPinned: true,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'sn_ru_3',
      title: 'Daily Vocab Goal',
      content: `Target: 20 new Anki flashcards every morning before breakfast.

> "Consistent 25-minute practice beats 3-hour weekly cramming."`,
      color: 'green',
      isPinned: false,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'sn_ru_4',
      title: 'Audio Resources & Podcasts',
      content: `1. Russian with Max (Slow Russian)
2. Comprehensible Russian with Inhabitant
3. In Russian From Afar`,
      color: 'blue',
      isPinned: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],

  'task_ui_revamp_m3p9q': [
    {
      id: 'sn_ui_1',
      title: 'Elevation Tokens & Shadows',
      content: `Standardize neumorphic bevels across all cards and modal sheets:
- Outer shadows: rgba(163, 177, 198, 0.6)
- Inner highlights: rgba(255, 255, 255, 0.8)`,
      color: 'purple',
      isPinned: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'sn_ui_2',
      title: 'Action Items Checklist',
      content: `- [ ] Audit primary action buttons for unified 2:1 padding ratio
- [ ] Ensure WCAG AA contrast on slate text`,
      color: 'yellow',
      isPinned: false,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
};

// Helper to resolve seed keys flexibly across exact IDs, titles, or task keywords
function findSeedKey<T>(dict: Record<string, T>, taskIdOrTitle: string, taskTitle?: string): string | undefined {
  const candidates = [taskIdOrTitle, taskTitle].filter(Boolean) as string[];
  for (const c of candidates) {
    if (dict[c]) return c;
    const normalized = c.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const key of Object.keys(dict)) {
      const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normalized.includes('russian') || normalized.includes('cyrillic') || normalized.includes('language')) {
        if (normKey.includes('russian')) return key;
      }
      if (normalized.includes('ui') || normalized.includes('revamp') || normalized.includes('design') || normalized.includes('neumorph')) {
        if (normKey.includes('ui')) return key;
      }
      if (normalized.includes('ai') || normalized.includes('llm') || normalized.includes('agent') || normalized.includes('engineer')) {
        if (normKey.includes('ai')) return key;
      }
      if (normalized.includes('mern') || normalized.includes('fullstack') || normalized.includes('stack')) {
        if (normKey.includes('mern')) return key;
      }
    }
  }
  return undefined;
}

export function getTaskStickyNotes(taskId: string, taskTitle?: string): TaskStickyNote[] {
  if (!taskId && !taskTitle) return [];
  const key = `vow_task_sticky_notes_${taskId || 'default'}`;
  
  // Check if user previously saved custom sticky notes
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      // If it only contains the generic starter note but matches a curated seed, upgrade it to curated seed!
      const isOnlyGenericStarter =
        Array.isArray(parsed) &&
        parsed.length === 1 &&
        (parsed[0].title === 'Action Item & Milestone Plan' || parsed[0].id.includes('starter'));

      if (Array.isArray(parsed) && parsed.length > 0 && !isOnlyGenericStarter) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`Error reading sticky notes for task ${taskId}:`, e);
  }

  const seedKey = findSeedKey(DEFAULT_TASK_STICKY_NOTES, taskId, taskTitle);
  if (seedKey && DEFAULT_TASK_STICKY_NOTES[seedKey]) {
    try {
      localStorage.setItem(key, JSON.stringify(DEFAULT_TASK_STICKY_NOTES[seedKey]));
    } catch {
      // ignore
    }
    return DEFAULT_TASK_STICKY_NOTES[seedKey];
  }

  // If there's an existing single note in legacy storage, migrate it to a sticky note
  const legacyNote = getTaskNote(taskId);
  if (legacyNote && legacyNote.trim().length > 0) {
    const migrated: TaskStickyNote[] = [
      {
        id: `sn_${Date.now()}`,
        title: 'Task Overview & Scratchpad',
        content: legacyNote,
        color: 'yellow',
        isPinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    try {
      localStorage.setItem(key, JSON.stringify(migrated));
    } catch {
      // ignore
    }
    return migrated;
  }

  // Provide a welcoming default starter note for any task so the board is never empty
  const defaultStarter: TaskStickyNote[] = [
    {
      id: `sn_${Date.now()}_starter`,
      title: 'Action Item & Milestone Plan',
      content: `- [ ] Define week 1 outcome\n- [ ] Break into 25-minute focus intervals\n\n> "Consistency transforms average effort into mastery."`,
      color: 'yellow',
      isPinned: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  try {
    localStorage.setItem(key, JSON.stringify(defaultStarter));
  } catch {
    // ignore
  }
  return defaultStarter;
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
    user: 'Alex Rivera',
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
      user: 'Alex Rivera',
    });
  }
}

// Default initial attachments seed
const DEFAULT_TASK_ATTACHMENTS: Record<string, TaskAttachment[]> = {
  'task_russian_mastery_r7u2k': [
    {
      id: 'att_ru_1',
      name: 'Russian_Cyrillic_CheatSheet.pdf',
      type: 'pdf',
      size: '1.2 MB',
      url: 'https://www.unicode.org/charts/PDF/U0400.pdf',
      uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'att_ru_2',
      name: 'OpenRussian Dictionary & Declensions',
      type: 'link',
      url: 'https://en.openrussian.org/',
      uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'att_ru_3',
      name: 'Grammar_Noun_Cases_Summary.docx',
      type: 'doc',
      size: '420 KB',
      url: '#',
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  'task_ui_revamp_m3p9q': [
    {
      id: 'att_ui_1',
      name: 'Figma Design System & Component Library',
      type: 'link',
      url: 'https://www.figma.com',
      uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'att_ui_2',
      name: 'Design_Tokens_Specification.pdf',
      type: 'pdf',
      size: '2.8 MB',
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
