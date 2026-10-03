import React from 'react';
import {
    Pin,
    PinOff,
    Edit3,
    Trash2,
} from 'lucide-react';
import { TaskStickyNote } from '../../../../../../types';
import { STICKY_COLOR_THEMES } from './stickyNoteConstants';

interface StickyNoteCardProps {
    note: TaskStickyNote;
    onSelectNote: (note: TaskStickyNote) => void;
    onTogglePin: (noteId: string, isPinned: boolean) => void;
    onDeleteNote: (noteId: string) => void;
}

export const StickyNoteCard: React.FC<StickyNoteCardProps> = ({
    note,
    onSelectNote,
    onTogglePin,
    onDeleteNote,
}) => {
    const colorCfg = STICKY_COLOR_THEMES[note.color] || STICKY_COLOR_THEMES.yellow;

    return (
        <div
            onClick={() => onSelectNote(note)}
            className={`relative rounded-2xl p-4 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[190px] ${colorCfg.paperBg} ${colorCfg.border} hover:scale-[1.01]`}
            style={{
                boxShadow: note.isPinned
                    ? '0 12px 28px -6px rgba(0,0,0,0.15), 0 4px 10px -2px rgba(0,0,0,0.08)'
                    : '0 6px 16px -4px rgba(0,0,0,0.08)',
            }}
        >
            {/* Top Tape Strip */}
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
