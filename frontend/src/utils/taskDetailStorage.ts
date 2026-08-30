import { TaskAttachment, TaskActivityItem } from '../types';

export const TASK_DETAIL_UPDATED_EVENT = 'vow_task_detail_updated';

// Default initial notes seed
const DEFAULT_TASK_NOTES: Record<string, string> = {
  'task_russian_mastery_r7u2k': `# Russian Language Learning Roadmap

## Core Focus Areas
- **Alphabet Mastery**: Memorize Cyrillic letters (especially false friends like *В, Н, Р, С, У, Х*).
- **Daily Vocabulary**: 20 new Anki flashcards every morning.
- **Grammar Pillar**: Master Prepositional case endings first (*о ком? о чём?*), then Accusative for direct objects.

### Useful Tips
> Consistent 30-minute daily practice yields 4x better retention than a single 3-hour weekly cram session.

- [ ] Practice vocal pronunciation with audio recordings
- [ ] Write 5 original sentences using new vocabulary
- [ ] Review Russian noun gender rules (-а/-я vs consonants vs -о/-е)`,

  'task_ui_revamp_m3p9q': `# Design System & UI Overhaul Notes

## Objectives
1. Harmonize neumorphic shadows and elevation levels across all modal views.
2. Refine typography hierarchy using high-contrast bold titles and readable slate body text.
3. Optimize responsive grid layouts for tablet and mobile screens.

### Checklist
- [ ] Audit all primary action buttons for unified padding
- [ ] Update color tokens in Tailwind configuration
- [ ] Review contrast ratios to meet WCAG AA standards`,
};

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

  if (DEFAULT_TASK_NOTES[taskId]) {
    try {
      localStorage.setItem(key, DEFAULT_TASK_NOTES[taskId]);
    } catch {
      // ignore
    }
    return DEFAULT_TASK_NOTES[taskId];
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

export function getTaskAttachments(taskId: string): TaskAttachment[] {
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