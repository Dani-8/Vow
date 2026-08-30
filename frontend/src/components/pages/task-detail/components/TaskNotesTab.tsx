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
