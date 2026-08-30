import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Bold,
  Italic,
  List,
  CheckSquare,
  Code,
  Quote,
  Heading2,
  Heading3,
  Eye,
  Edit3,
  Save,
  CheckCircle2,
  ListPlus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SubTask } from '../../../../types';

interface TaskNotesTabProps {
  taskId: string;
  initialNote: string;
  onSaveNote: (content: string) => void;
  onAddSubTask?: (subTask: Omit<SubTask, 'id'>) => void;
}

export const TaskNotesTab: React.FC<TaskNotesTabProps> = ({
  taskId,
  initialNote,
  onSaveNote,
  onAddSubTask,
}) => {
  const [content, setContent] = useState(initialNote);
  const [isPreview, setIsPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [extractModalOpen, setExtractModalOpen] = useState(false);
  const [detectedTasks, setDetectedTasks] = useState<string[]>([]);
  const [selectedTasksToImport, setSelectedTasksToImport] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initialNote when taskId changes
  useEffect(() => {
    setContent(initialNote);
    setSaveStatus('saved');
  }, [taskId, initialNote]);

  // Handle changes with debounce auto-save
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setSaveStatus('dirty');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saving');
      onSaveNote(val);
      setTimeout(() => {
        setSaveStatus('saved');
      }, 400);
    }, 800);
  };

  const handleManualSave = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaveStatus('saving');
    onSaveNote(content);
    setTimeout(() => {
      setSaveStatus('saved');
    }, 300);
  };

  // Markdown formatting shortcuts
  const insertFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultPlaceholder;

    const newContent =
      content.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      content.substring(end);

    setContent(newContent);
    setSaveStatus('dirty');

    // Auto save
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onSaveNote(newContent);
      setSaveStatus('saved');
    }, 600);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  // Convert lines into Subtasks detector
  const handleDetectSubtasks = () => {
    const lines = content.split('\n');
    const detected: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      // Match markdown checklists, bullet points, or numbered lists
      if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]') || trimmed.startsWith('* [ ]')) {
        const text = trimmed.replace(/^[-*]\s*\[[ x]\]\s*/, '').trim();
        if (text.length > 2) detected.push(text);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s+/.test(trimmed)) {
        const text = trimmed.replace(/^[-*]|\d+\.\s*/, '').trim();
        if (text.length > 2 && !text.startsWith('#')) detected.push(text);
      }
    });

    // Remove duplicates
    const unique = Array.from(new Set(detected));
    setDetectedTasks(unique);
    setSelectedTasksToImport(unique);
    setExtractModalOpen(true);
  };

  const handleImportSubtasks = () => {
    if (!onAddSubTask || selectedTasksToImport.length === 0) {
      setExtractModalOpen(false);
      return;
    }

    selectedTasksToImport.forEach((title) => {
      onAddSubTask({
        taskId,
        title,
        dateLabel: 'From Note',
        status: 'pending',
        priority: 'Medium',
      });
    });

    setExtractModalOpen(false);
  };

  const toggleSelectTaskToImport = (item: string) => {
    if (selectedTasksToImport.includes(item)) {
      setSelectedTasksToImport(selectedTasksToImport.filter((t) => t !== item));
    } else {
      setSelectedTasksToImport([...selectedTasksToImport, item]);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn max-w-5xl">
      {/* Top Controls Toolbar */}
      <div className="neu-card p-4 bg-[#E0E5EC] flex flex-wrap items-center justify-between gap-3">
        {/* Left Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**', 'bold text')}
            title="Bold (**text**)"
            className="p-2 rounded-xl neu-button text-slate-700 hover:text-[#2563eb] text-xs font-bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*', 'italic text')}
            title="Italic (*text*)"
            className="p-2 rounded-xl neu-button text-slate-700 hover:text-[#2563eb] text-xs font-bold"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('## ', '', 'Section Heading')}
            title="Heading 2 (## Heading)"
            className="p-2 rounded-xl neu-button text-slate-700 hover:text-[#2563eb] text-xs font-bold"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('### ', '', 'Subsection')}
            title="Heading 3 (### Subheading)"
            className="p-2 rounded-xl neu-button text-slate-700 hover:text-[#2563eb] text-xs font-bold"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <div className="h-5 w-[1px] bg-[#c8d0e0] mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting('- [ ] ', '', 'Checklist item')}
            title="Checklist item (- [ ] Task)"
            className="p-2 rounded-xl neu-button text-slate-700 hover:text-[#2563eb] text-xs font-bold"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- ', '', 'Bullet point')}
            title="Bullet List (- item)"
            className="p-2 rounded-xl neu-button text-slate-700 hover:text-[#2563eb] text-xs font-bold"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('> ', '', 'Quoted insight')}
            title="Quote (> quote)"
            className="p-2 rounded-xl neu-button text-slate-700 hover:text-[#2563eb] text-xs font-bold"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('```\n', '\n```', 'code block')}
            title="Code block"
            className="p-2 rounded-xl neu-button text-slate-700 hover:text-[#2563eb] text-xs font-bold"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

