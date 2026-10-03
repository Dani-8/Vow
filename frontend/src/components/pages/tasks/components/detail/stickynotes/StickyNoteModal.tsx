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
    Edit3,
    Copy,
    CheckCheck,
    HelpCircle,
} from 'lucide-react';
import { TaskStickyNote, SubTask } from '../../../../../../types';
import { NoteColor, STICKY_COLOR_THEMES } from './stickyNoteConstants';
import { StickyNoteColorPicker } from './StickyNoteColorPicker';
import { StickyNoteSubtaskConverter } from './StickyNoteSubtaskConverter';

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

    const currentTheme = STICKY_COLOR_THEMES[color] || STICKY_COLOR_THEMES.yellow;

    const handleCopyNote = () => {
        const textToCopy = `${title ? title + '\n\n' : ''}${content}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
