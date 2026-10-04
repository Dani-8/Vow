import React, { useState } from 'react';
import {
    StickyNote,
    Plus,
    Search,
    Palette,
} from 'lucide-react';
import { TaskStickyNote, SubTask } from '../../../../../../types';
import { NoteColor, STICKY_COLOR_THEMES, COLOR_KEYS } from './stickyNoteConstants';
import { StickyNoteCard } from './StickyNoteCard';
import { StickyNoteModal } from './StickyNoteModal';

interface TaskNotesTabProps {
    taskId: string;
    stickyNotes: TaskStickyNote[];
    onAddStickyNote: (note: Omit<TaskStickyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onUpdateStickyNote: (noteId: string, updates: Partial<Omit<TaskStickyNote, 'id' | 'createdAt'>>) => void;
    onDeleteStickyNote: (noteId: string) => void;
    onAddSubTask?: (subTask: Omit<SubTask, 'id'>) => void;
}

export const TaskNotesTab: React.FC<TaskNotesTabProps> = ({
    taskId,
    stickyNotes,
    onAddStickyNote,
    onUpdateStickyNote,
    onDeleteStickyNote,
    onAddSubTask,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [colorFilter, setColorFilter] = useState<NoteColor | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<TaskStickyNote | null>(null);

    // Open modal to add a new note
    const handleOpenAdd = () => {
        setEditingNote(null);
        setIsModalOpen(true);
    };

    // Open modal to view/edit existing note
    const handleOpenEdit = (note: TaskStickyNote) => {
        setEditingNote(note);
        setIsModalOpen(true);
    };

    // Save handler passed into modal
    const handleSaveModal = (data: {
        title?: string;
        content: string;
        color: NoteColor;
        isPinned?: boolean;
    }) => {
        if (editingNote) {
            onUpdateStickyNote(editingNote.id, data);
        } else {
            onAddStickyNote(data);
        }
    };

    // Filter and sort notes (Pinned first)
    const filteredNotes = stickyNotes
        .filter((n) => {
            const matchesColor = colorFilter === 'all' || n.color === colorFilter;
            const matchesSearch =
                (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                n.content.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesColor && matchesSearch;
        })
        .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });