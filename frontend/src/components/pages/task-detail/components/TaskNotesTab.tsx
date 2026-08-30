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

