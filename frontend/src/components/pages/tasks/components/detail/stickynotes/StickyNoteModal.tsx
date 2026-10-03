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

        onSave({
            title: title.trim() || undefined,
            content: content.trim(),
            color,
            isPinned,
        });
        setIsEditing(false);
    };

    // Toggle interactive checkboxes directly in view mode
    const handleToggleCheckbox = (lineIdx: number) => {
        const lines = content.split('\n');
        const targetLine = lines[lineIdx];
        if (targetLine.startsWith('- [ ]')) {
            lines[lineIdx] = targetLine.replace('- [ ]', '- [x]');
        } else if (targetLine.startsWith('- [x]')) {
            lines[lineIdx] = targetLine.replace('- [x]', '- [ ]');
        }
        const updatedContent = lines.join('\n');
        setContent(updatedContent);

        onSave({
            title: title.trim() || undefined,
            content: updatedContent,
            color,
            isPinned,
        });
    };

    // Detect checklist items or bullet lines in content
    const handleOpenExtract = () => {
        const lines = content.split('\n');
        const detected: string[] = [];

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]') || trimmed.startsWith('* [ ]')) {
                const text = trimmed.replace(/^[-*]\s*\[[ x]\]\s*/, '').trim();
                if (text.length > 1) detected.push(text);
            } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s+/.test(trimmed)) {
                const text = trimmed.replace(/^[-*]|\d+\.\s*/, '').trim();
                if (text.length > 1 && !text.startsWith('#')) detected.push(text);
            }
        });

        const unique = Array.from(new Set(detected));
        setDetectedTasks(unique);
        setSelectedToImport(unique);
        setExtractMode(true);
    };
