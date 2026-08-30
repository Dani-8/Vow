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

        {/* Right Actions: Auto-save status, convert to subtasks, mode toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Save Status Pill */}
          <div className="flex items-center space-x-1.5 text-xs font-medium text-[#717699] px-2 py-1">
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold hidden sm:inline">Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span className="text-blue-600 font-bold">Saving...</span>
              </>
            )}
            {saveStatus === 'dirty' && (
              <button
                onClick={handleManualSave}
                className="text-amber-700 font-bold hover:underline flex items-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            )}
          </div>

          {/* Convert to Subtasks action */}
          {onAddSubTask && (
            <button
              onClick={handleDetectSubtasks}
              className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/70 flex items-center space-x-1.5 transition-all shadow-sm"
              title="Convert bullet points & checklists to Sub-tasks"
            >
              <ListPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Convert to Subtasks</span>
              <span className="sm:hidden">Extract</span>
            </button>
          )}

          {/* Toggle View Mode */}
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-[#1a1c35] flex items-center space-x-1.5"
          >
            {isPreview ? (
              <>
                <Edit3 className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="neu-card p-6 bg-[#E0E5EC] min-h-[420px] relative">
        {isPreview ? (
          <div className="prose prose-slate max-w-none text-[#1a1c35] space-y-4">
            {content ? (
              <div className="space-y-3 leading-relaxed">
                {content.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-xl font-black text-[#1a1c35] border-b border-slate-300 pb-2">{line.substring(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-lg font-black text-[#1a1c35] pt-2">{line.substring(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={idx} className="text-sm font-black text-[#1a1c35]">{line.substring(4)}</h3>;
                  }
                  if (line.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="p-3 rounded-xl neu-inset bg-[#dbe2ee]/60 border-l-4 border-blue-500 italic text-xs text-[#2b2e4a]">
                        {line.substring(2)}
                      </blockquote>
                    );
                  }
                  if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
                    const isChecked = line.startsWith('- [x]');
                    return (
                      <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-[#1a1c35]">
                        <input type="checkbox" checked={isChecked} readOnly className="rounded text-blue-600" />
                        <span className={isChecked ? 'line-through text-slate-400' : ''}>{line.replace(/^-\s*\[[ x]\]\s*/, '')}</span>
                      </div>
                    );
                  }
                  if (line.startsWith('- ') || line.startsWith('* ')) {
                    return (
                      <li key={idx} className="text-xs text-[#2b2e4a] ml-4 list-disc">
                        {line.substring(2)}
                      </li>
                    );
                  }
                  if (line.trim() === '') {
                    return <div key={idx} className="h-2" />;
                  }
                  return <p key={idx} className="text-xs text-[#2b2e4a] leading-relaxed">{line}</p>;
                })}
              </div>
            ) : (
              <p className="text-xs italic text-slate-400">Empty note preview. Click edit to start typing.</p>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            placeholder="Write task notes, specifications, meeting bullet points, or markdown checklists (- [ ] task)..."
            className="w-full h-[400px] bg-transparent resize-y border-none focus:outline-none text-xs sm:text-sm font-mono text-[#1a1c35] leading-relaxed placeholder:text-slate-400"
          />
        )}
      </div>
