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