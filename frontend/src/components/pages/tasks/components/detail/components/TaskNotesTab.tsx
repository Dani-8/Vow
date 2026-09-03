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
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${colorFilter === 'all'
                                ? 'neu-inset text-[#549acb] font-black'
                                : 'neu-button text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            All
                        </button>
                        {(['yellow', 'green', 'blue', 'purple', 'rose', 'gray'] as NoteColor[]).map((c) => {
                            const theme = STICKY_COLOR_THEMES[c];
                            return (
                                <button
                                    key={c}
                                    onClick={() => setColorFilter(c)}
                                    className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${theme.accentDot} ${colorFilter === c ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#E0E5EC]' : 'hover:scale-110 opacity-80 hover:opacity-100'
                                        }`}
                                    title={`Filter ${theme.name}`}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Right: Add Note Button */}
                <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 rounded-xl neu-button-primary text-xs font-bold text-white flex items-center space-x-1.5 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Pin Sticky Note</span>
                </button>
            </div>

            {/* Sticky Notes Corkboard Grid */}
            {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredNotes.map((note) => {
                        const colorCfg = STICKY_COLOR_THEMES[note.color || 'yellow'] || STICKY_COLOR_THEMES.yellow;