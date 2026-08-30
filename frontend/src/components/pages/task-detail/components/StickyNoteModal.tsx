import React, { useState, useEffect } from 'react';
import {
  StickyNote,
  Pin,
  Palette,
  Sparkles,
  ListPlus,
  Trash2,
  X,
  Check,
  Calendar,
  Clock,
  ArrowRight,
  Edit3,
  Copy,
  CheckCheck
} from 'lucide-react';
import { TaskStickyNote, SubTask } from '../../../../types';

interface StickyNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: TaskStickyNote | null; // null means creating a new note
  initialEditMode?: boolean;
  taskId: string;
  onSave: (noteData: {
    title?: string;
    content: string;
    color: TaskStickyNote['color'];
    isPinned?: boolean;
  }) => void;
  onDelete?: (noteId: string) => void;
  onAddSubTask?: (subTask: Omit<SubTask, 'id'>) => void;
}

type NoteColor = TaskStickyNote['color'];

export const STICKY_COLOR_THEMES: Record<
  NoteColor,
  {
    name: string;
    paperBg: string;
    headerBg: string;
    border: string;
    textColor: string;
    bodyTextColor: string;
    tapeBg: string;
    pinBg: string;
    accentDot: string;
    shadow: string;
    lineBorder: string;
    ruledLineColor: string;
  }
> = {
  yellow: {
    name: 'Canary Yellow',
    paperBg: 'bg-[#fff9db]',
    headerBg: 'bg-[#ffec99]/60',
    border: 'border-[#f59f00]/30',
    textColor: 'text-[#493905]',
    bodyTextColor: 'text-[#5c4813]',
    tapeBg: 'bg-[#ffe066]/70',
    pinBg: 'bg-[#fcc419] text-[#493905]',
    accentDot: 'bg-[#fcc419]',
    shadow: 'shadow-[0_20px_40px_rgba(245,159,0,0.18)]',
    lineBorder: 'border-[#f0d879]/50',
    ruledLineColor: 'rgba(245, 159, 0, 0.15)',
  },
  green: {
    name: 'Sage Mint',
    paperBg: 'bg-[#ebfbee]',
    headerBg: 'bg-[#d3f9d8]/60',
    border: 'border-[#40c057]/30',
    textColor: 'text-[#15471d]',
    bodyTextColor: 'text-[#1b5e20]',
    tapeBg: 'bg-[#b2f2bb]/70',
    pinBg: 'bg-[#51cf66] text-[#15471d]',
    accentDot: 'bg-[#51cf66]',
    shadow: 'shadow-[0_20px_40px_rgba(64,192,87,0.18)]',
    lineBorder: 'border-[#b2f2bb]/50',
    ruledLineColor: 'rgba(64, 192, 87, 0.15)',
  },
  blue: {
    name: 'Sky Azure',
    paperBg: 'bg-[#e7f5ff]',
    headerBg: 'bg-[#d0ebff]/60',
    border: 'border-[#228be6]/30',
    textColor: 'text-[#0d3b66]',
    bodyTextColor: 'text-[#184e77]',
    tapeBg: 'bg-[#a5d8ff]/70',
    pinBg: 'bg-[#339af0] text-white',
    accentDot: 'bg-[#339af0]',
    shadow: 'shadow-[0_20px_40px_rgba(34,139,230,0.18)]',
    lineBorder: 'border-[#a5d8ff]/50',
    ruledLineColor: 'rgba(34, 139, 230, 0.15)',
  },
  purple: {
    name: 'Lilac Lavender',
    paperBg: 'bg-[#f3f0ff]',
    headerBg: 'bg-[#e5dbff]/60',
    border: 'border-[#7950f2]/30',
    textColor: 'text-[#3b1f80]',
    bodyTextColor: 'text-[#4c2889]',
    tapeBg: 'bg-[#d0bfff]/70',
    pinBg: 'bg-[#845ef7] text-white',
    accentDot: 'bg-[#845ef7]',
    shadow: 'shadow-[0_20px_40px_rgba(121,80,242,0.18)]',
    lineBorder: 'border-[#d0bfff]/50',
    ruledLineColor: 'rgba(121, 80, 242, 0.15)',
  },
  rose: {
    name: 'Warm Coral',
    paperBg: 'bg-[#fff0f6]',
    headerBg: 'bg-[#ffdeeb]/60',
    border: 'border-[#e64980]/30',
    textColor: 'text-[#610a30]',
    bodyTextColor: 'text-[#7d1d3f]',
    tapeBg: 'bg-[#fcc2d7]/70',
    pinBg: 'bg-[#f06595] text-white',
    accentDot: 'bg-[#f06595]',
    shadow: 'shadow-[0_20px_40px_rgba(230,73,128,0.18)]',
    lineBorder: 'border-[#fcc2d7]/50',
    ruledLineColor: 'rgba(230, 73, 128, 0.15)',
  },
  gray: {
    name: 'Clean Kraft / Slate',
    paperBg: 'bg-[#f8f9fa]',
    headerBg: 'bg-[#e9ecef]/60',
    border: 'border-[#868e96]/30',
    textColor: 'text-[#212529]',
    bodyTextColor: 'text-[#343a40]',
    tapeBg: 'bg-[#dee2e6]/70',
    pinBg: 'bg-[#adb5bd] text-[#212529]',
    accentDot: 'bg-[#868e96]',
    shadow: 'shadow-[0_20px_40px_rgba(73,80,87,0.15)]',
    lineBorder: 'border-[#ced4da]/50',
    ruledLineColor: 'rgba(108, 117, 125, 0.15)',
  },
};

export const StickyNoteModal: React.FC<StickyNoteModalProps> = ({
  isOpen,
  onClose,
  note,
  initialEditMode = false,
  taskId,
  onSave,
  onDelete,
  onAddSubTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [isPinned, setIsPinned] = useState(false);
  const [copied, setCopied] = useState(false);

  // Subtask extraction state inside modal
  const [extractMode, setExtractMode] = useState(false);
  const [detectedTasks, setDetectedTasks] = useState<string[]>([]);
  const [selectedToImport, setSelectedToImport] = useState<string[]>([]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setColor(note.color || 'yellow');
      setIsPinned(!!note.isPinned);
      setIsEditing(initialEditMode);
    } else {
      // Creating a new note -> always start in edit mode
      setTitle('');
      setContent('');
      setColor('yellow');
      setIsPinned(false);
      setIsEditing(true);
    }
    setExtractMode(false);
    setDetectedTasks([]);
    setSelectedToImport([]);
    setCopied(false);
  }, [note, isOpen, initialEditMode]);

  if (!isOpen) return null;