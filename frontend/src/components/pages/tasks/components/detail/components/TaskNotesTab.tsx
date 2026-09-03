import React, { useState } from 'react';
import {
    StickyNote,
    Plus,
    Pin,
    PinOff,
    Trash2,
    Edit3,
    Search,
    ListPlus,
    Palette
} from 'lucide-react';
import { TaskStickyNote, SubTask } from '../../../../../../types';
import { StickyNoteModal, STICKY_COLOR_THEMES } from './StickyNoteModal';

interface TaskNotesTabProps {
    taskId: string;
    stickyNotes: TaskStickyNote[];
    onAddStickyNote: (note: Omit<TaskStickyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onUpdateStickyNote: (noteId: string, updates: Partial<Omit<TaskStickyNote, 'id' | 'createdAt'>>) => void;
    onDeleteStickyNote: (noteId: string) => void;
    onAddSubTask?: (subTask: Omit<SubTask, 'id'>) => void;
}

type NoteColor = TaskStickyNote['color'];

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