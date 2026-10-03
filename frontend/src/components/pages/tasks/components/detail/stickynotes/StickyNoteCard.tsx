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

                {/* Actions Bar */}
                <div
                    className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => onTogglePin(note.id, !note.isPinned)}
                        className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-slate-700 transition-colors"
                        title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                    >
                        {note.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>

                    <button
                        onClick={() => onSelectNote(note)}
                        className="p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-slate-700 transition-colors"
                        title="Open full note modal"
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1.5 rounded-lg bg-black/5 hover:bg-rose-500/20 text-rose-700 transition-colors"
                        title="Delete note"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className={`text-xs ${colorCfg.textColor} leading-relaxed font-sans flex-1 overflow-hidden space-y-1.5`}>
                {note.content.split('\n').slice(0, 8).map((line, idx) => {
                    if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
                        const isChecked = line.startsWith('- [x]');
                        return (
                            <div key={idx} className="flex items-center space-x-1.5 font-medium">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="rounded text-indigo-600 w-3.5 h-3.5"
                                />
                                <span className={isChecked ? 'line-through opacity-60' : ''}>
                                    {line.replace(/^-\s*\[[ x]\]\s*/, '')}
                                </span>
                            </div>
                        );
                    }
                    if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
                        return (
                            <li key={idx} className="ml-4 list-disc font-medium">
                                {line.replace(/^[-*•]\s*/, '')}
                            </li>
                        );
                    }
                    if (/^\d+\.\s+/.test(line)) {
                        return (
                            <div key={idx} className="ml-2 font-medium flex items-start space-x-1.5">
                                <span className="font-bold opacity-75">{line.match(/^\d+\./)?.[0]}</span>
                                <span>{line.replace(/^\d+\.\s*/, '')}</span>
                            </div>
                        );
                    }
                    if (line.startsWith('> ')) {
                        return (
                            <p key={idx} className="italic opacity-85 pl-2.5 border-l-2 border-current/40 my-0.5">
                                {line.substring(2)}
                            </p>
                        );
                    }
                    if (line.trim() === '') return <div key={idx} className="h-1" />;
                    return <p key={idx} className="line-clamp-2 font-medium">{line}</p>;
                })}
            </div>

            {/* Bottom Footer */}
            <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between text-[10px] text-slate-600 font-medium">
                <span>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <span className="font-bold opacity-60 group-hover:opacity-100 transition-opacity">Click to view/edit</span>
            </div>
        </div>
    );
};
