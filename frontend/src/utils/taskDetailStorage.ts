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