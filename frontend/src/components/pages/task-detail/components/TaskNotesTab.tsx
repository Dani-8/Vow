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
import { TaskStickyNote, SubTask } from '../../../../types';
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
                                ? 'neu-inset text-indigo-700 font-black'
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

                        return (
                            <div
                                key={note.id}
                                onClick={() => handleOpenEdit(note)}
                                className={`group relative rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between min-h-[220px] cursor-pointer ${colorCfg.paperBg} ${colorCfg.border} ${colorCfg.shadow} hover:-translate-y-1 hover:shadow-xl`}
                                style={{
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                                }}
                            >
                                {/* Paper Tape accent */}
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 rounded-xs bg-white/40 backdrop-blur-2xs shadow-2xs border-b border-black/10 opacity-80 rotate-[-1deg]" />

                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-3 pt-1">
                                    <div className="flex items-center space-x-2">
                                        {note.isPinned && (
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 ${colorCfg.pinBg}`}>
                                                <Pin className="w-3 h-3 fill-current" />
                                                <span>Pinned</span>
                                            </span>
                                        )}
                                        {note.title && (
                                            <h4 className={`text-sm font-black tracking-tight ${colorCfg.textColor} line-clamp-1`}>
                                                {note.title}
                                            </h4>
                                        )}
                                    </div>

                                    {/* Actions Bar on card */}
                                    <div
                                        className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => onUpdateStickyNote(note.id, { isPinned: !note.isPinned })}
                                            className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-slate-700 transition-colors"
                                            title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                                        >
                                            {note.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                                        </button>

                                        <button
                                            onClick={() => handleOpenEdit(note)}
                                            className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-slate-700 transition-colors"
                                            title="Open full note modal"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                            onClick={() => onDeleteStickyNote(note.id)}
                                            className="p-1.5 rounded-lg bg-black/5 hover:bg-rose-500/20 text-rose-700 transition-colors"
                                            title="Delete note"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content Body (Render line items) */}
                                <div className={`text-xs ${colorCfg.textColor} leading-relaxed font-sans flex-1 overflow-hidden space-y-1.5`}>
                                    {note.content.split('\n').slice(0, 8).map((line, idx) => {
                                        if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
                                            const isChecked = line.startsWith('- [x]');
                                            return (
                                                <div key={idx} className="flex items-center space-x-1.5 font-medium">
                                                    <input type="checkbox" checked={isChecked} readOnly className="rounded text-indigo-600 w-3.5 h-3.5" />
                                                    <span className={isChecked ? 'line-through opacity-60' : ''}>
                                                        {line.replace(/^-\s*\[[ x]\]\s*/, '')}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
                                            return (
                                                <li key={idx} className="ml-4 list-disc">
                                                    {line.replace(/^[-*•]\s*/, '')}
                                                </li>
                                            );
                                        }
                                        if (line.startsWith('> ')) {
                                            return (
                                                <p key={idx} className="italic opacity-80 pl-2 border-l-2 border-slate-400">
                                                    {line.substring(2)}
                                                </p>
                                            );
                                        }
                                        if (line.trim() === '') return <div key={idx} className="h-1" />;
                                        return <p key={idx} className="line-clamp-2">{line}</p>;
                                    })}
                                </div>

                                {/* Bottom Footer */}
                                <div className={`pt-3 mt-2 border-t ${colorCfg.lineBorder} flex items-center justify-between text-[10px] opacity-75 font-medium`}>
                                    <span>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    <span className="capitalize">{colorCfg.name.split(' ')[0]}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="neu-card p-10 bg-[#E0E5EC] text-center space-y-3">
                    <StickyNote className="w-10 h-10 text-amber-500/80 mx-auto" />
                    <p className="text-sm font-black text-[#1a1c35]">No sticky notes pinned yet</p>
                    <p className="text-xs text-[#717699] max-w-md mx-auto">
                        Pin paper notes for guidelines, research findings, vocabulary, or quick thoughts. Choose custom paper colors and pin your highest priority notes to the top.
                    </p>
                    <button
                        onClick={handleOpenAdd}
                        className="px-4 py-2 rounded-xl neu-button-primary text-xs font-bold text-white inline-flex items-center space-x-1.5 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create First Note</span>
                    </button>
                </div>
            )}

            {/* Extracted Dedicated Modal */}
            <StickyNoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                note={editingNote}
                taskId={taskId}
                onSave={handleSaveModal}
                onDelete={onDeleteStickyNote}
                onAddSubTask={onAddSubTask}
            />
        </div>
    );
};
