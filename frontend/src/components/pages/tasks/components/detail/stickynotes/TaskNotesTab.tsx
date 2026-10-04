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

    return (
        <div className="space-y-6 animate-fadeIn max-w-6xl">
            {/* Top Controls Toolbar */}
            <div className="neu-card p-4 bg-[#E0E5EC] flex flex-wrap items-center justify-between gap-3">
                {/* Left: Search & Filter */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl neu-inset bg-[#dbe2ee]/60 w-48 sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search sticky notes..."
                            className="bg-transparent border-none text-xs focus:outline-none w-full text-[#1a1c35]"
                        />
                    </div>

                    {/* Color Filter Dots */}
                    <div className="flex items-center space-x-1.5 pl-1">
                        <button
                            onClick={() => setColorFilter('all')}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                                colorFilter === 'all'
                                    ? 'neu-button text-[#1a1c35] font-black'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            All ({stickyNotes.length})
                        </button>

                        {COLOR_KEYS.map((c) => {
                            const count = stickyNotes.filter((n) => n.color === c).length;
                            const theme = STICKY_COLOR_THEMES[c];
                            if (count === 0 && colorFilter !== c) return null;
                            return (
                                <button
                                    key={c}
                                    onClick={() => setColorFilter(colorFilter === c ? 'all' : c)}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${theme.accentDot} ${
                                        colorFilter === c
                                            ? 'ring-2 ring-[#549acb] ring-offset-2 scale-110 shadow-sm'
                                            : 'opacity-70 hover:opacity-100'
                                    }`}
                                    title={`Filter by ${theme.name} (${count})`}
                                >
                                    <span className="text-[9px] font-bold text-white/90">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Add Note CTA */}
                <button
                    onClick={handleOpenAdd}
                    className="neu-button-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center space-x-1.5 shadow-md hover:scale-102 transition-transform"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Sticky Note</span>
                </button>
            </div>
