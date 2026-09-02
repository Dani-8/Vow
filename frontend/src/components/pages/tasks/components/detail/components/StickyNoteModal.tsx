import React, { useState, useEffect, useRef } from 'react';
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
    CheckCheck,
    HelpCircle
} from 'lucide-react';
import { TaskStickyNote, SubTask } from '../../../../../../types';

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
    blue: {
        name: 'Sky Azure',
        paperBg: 'bg-[#e7f5ff]',
        headerBg: 'bg-[#d0ebff]/60',
        border: 'border-[#228be6]/30',
        textColor: 'text-[#0d3b66]',
        bodyTextColor: 'text-[#184e77]',
        tapeBg: 'bg-[#a5d8ff]/70',
        pinBg: 'bg-[#339af0] text-white',
        accentDot: 'bg-[#339af0]',
        shadow: 'shadow-[0_20px_40px_rgba(34,139,230,0.18)]',
        lineBorder: 'border-[#a5d8ff]/50',
        ruledLineColor: 'rgba(34, 139, 230, 0.15)',
    },
    purple: {
        name: 'Lilac Lavender',
        paperBg: 'bg-[#f3f0ff]',
        headerBg: 'bg-[#e5dbff]/60',
        border: 'border-[#7950f2]/30',
        textColor: 'text-[#3b1f80]',
        bodyTextColor: 'text-[#4c2889]',
        tapeBg: 'bg-[#d0bfff]/70',
        pinBg: 'bg-[#845ef7] text-white',
        accentDot: 'bg-[#845ef7]',
        shadow: 'shadow-[0_20px_40px_rgba(121,80,242,0.18)]',
        lineBorder: 'border-[#d0bfff]/50',
        ruledLineColor: 'rgba(121, 80, 242, 0.15)',
    },
    rose: {
        name: 'Warm Coral',
        paperBg: 'bg-[#fff0f6]',
        headerBg: 'bg-[#ffdeeb]/60',
        border: 'border-[#e64980]/30',
        textColor: 'text-[#610a30]',
        bodyTextColor: 'text-[#7d1d3f]',
        tapeBg: 'bg-[#fcc2d7]/70',
        pinBg: 'bg-[#f06595] text-white',
        accentDot: 'bg-[#f06595]',
        shadow: 'shadow-[0_20px_40px_rgba(230,73,128,0.18)]',
        lineBorder: 'border-[#fcc2d7]/50',
        ruledLineColor: 'rgba(230, 73, 128, 0.15)',
    },
    gray: {
        name: 'Clean Kraft / Slate',
        paperBg: 'bg-[#f8f9fa]',
        headerBg: 'bg-[#e9ecef]/60',
        border: 'border-[#868e96]/30',
        textColor: 'text-[#212529]',
        bodyTextColor: 'text-[#343a40]',
        tapeBg: 'bg-[#dee2e6]/70',
        pinBg: 'bg-[#adb5bd] text-[#212529]',
        accentDot: 'bg-[#868e96]',
        shadow: 'shadow-[0_20px_40px_rgba(73,80,87,0.15)]',
        lineBorder: 'border-[#ced4da]/50',
        ruledLineColor: 'rgba(108, 117, 125, 0.15)',
    },
};

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
            // Creating a new note -> always start in edit mode
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

    const handleImportSubtasks = () => {
        if (!onAddSubTask || selectedToImport.length === 0) {
            setExtractMode(false);
            return;
        }

        selectedToImport.forEach((taskTitle) => {
            onAddSubTask({
                taskId,
                title: taskTitle,
                dateLabel: title || 'From Sticky Note',
                status: 'pending',
                priority: 'Medium',
            });
        });

        setExtractMode(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            {/* Outer Paper Card Container */}
            <div
                className={`relative w-full max-w-xl rounded-2xl border-2 transition-all duration-300 ${currentTheme.paperBg} ${currentTheme.border} ${currentTheme.shadow} flex flex-col overflow-visible`}
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
                }}
            >
                {/* Paper Mask Tape Accent at top center */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 rounded-b-md backdrop-blur-xs shadow-xs z-10 opacity-80 rotate-[-1deg] border-b border-black/10 flex items-center justify-center bg-white/50" />

                {/* Modal Top Bar */}
                <div className={`px-6 pt-5 pb-3.5 border-b ${currentTheme.lineBorder} flex items-center justify-between`}>
                    <div className="flex items-center space-x-2.5">
                        <div className={`p-2 rounded-xl shadow-xs ${currentTheme.pinBg}`}>
                            <StickyNote className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
                                    {isEditing ? 'Editing Note' : 'Paper Sticky Note'}
                                </span>
                                {isPinned && (
                                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider flex items-center space-x-0.5 ${currentTheme.pinBg}`}>
                                        <Pin className="w-2.5 h-2.5 fill-current" />
                                        <span>Pinned</span>
                                    </span>
                                )}
                            </div>
                            <h3 className={`text-base font-black tracking-tight ${currentTheme.textColor} truncate max-w-xs`}>
                                {title || (isEditing ? 'Untitled Note' : 'Sticky Note')}
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                        {/* If in view mode, show Edit button & Copy button */}
                        {!isEditing && !extractMode && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCopyNote}
                                    className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 transition-colors"
                                    title="Copy note text"
                                >
                                    {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-3 py-1.5 rounded-xl bg-black/10 hover:bg-black/15 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                                    title="Edit note content & colors"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </button>
                            </>
                        )}

                        {/* If in edit mode and editing existing note, allow switching back to view mode */}
                        {isEditing && note && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 text-xs font-bold transition-colors"
                            >
                                View
                            </button>
                        )}

                        {/* Close modal */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* MODE 1: CLEAN PAPER NOTE VIEW (Default when clicking a note) */}
                {!isEditing && !extractMode && (
                    <div className="p-6 space-y-6">
                        {/* Note Body (Rendered with lined paper look and feel) */}
                        <div
                            className="min-h-[200px] max-h-[360px] overflow-y-auto pr-2 space-y-3 font-sans"
                            style={{
                                backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${currentTheme.ruledLineColor} 28px)`,
                                lineHeight: '28px',
                            }}
                        >
                            {content.split('\n').map((line, idx) => {
                                if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
                                    const isChecked = line.startsWith('- [x]');
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => handleToggleCheckbox(idx)}
                                            className="flex items-center space-x-2.5 text-xs font-medium cursor-pointer group/check select-none"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                readOnly
                                                className="rounded text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                                            />
                                            <span
                                                className={`${currentTheme.bodyTextColor} leading-snug transition-all ${isChecked ? 'line-through opacity-50' : 'group-hover/check:opacity-80'
                                                    }`}
                                            >
                                                {line.replace(/^-\s*\[[ x]\]\s*/, '')}
                                            </span>
                                        </div>
                                    );
                                }

                                if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
                                    return (
                                        <li key={idx} className={`ml-4 list-disc text-xs ${currentTheme.bodyTextColor} font-medium leading-relaxed`}>
                                            {line.replace(/^[-*•]\s*/, '')}
                                        </li>
                                    );
                                }

                                if (/^\d+\.\s+/.test(line)) {
                                    return (
                                        <div key={idx} className={`ml-2 flex items-start space-x-2 text-xs ${currentTheme.bodyTextColor} font-medium leading-relaxed`}>
                                            <span className="font-bold opacity-75">{line.match(/^\d+\./)?.[0]}</span>
                                            <span>{line.replace(/^\d+\.\s*/, '')}</span>
                                        </div>
                                    );
                                }

                                if (line.startsWith('> ')) {
                                    return (
                                        <blockquote
                                            key={idx}
                                            className="p-2.5 rounded-lg bg-black/5 border-l-4 border-black/20 italic text-xs font-medium opacity-90 my-1"
                                        >
                                            {line.substring(2)}
                                        </blockquote>
                                    );
                                }

                                if (line.trim() === '') {
                                    return <div key={idx} className="h-4" />;
                                }

                                return (
                                    <p key={idx} className={`text-xs ${currentTheme.bodyTextColor} font-medium leading-relaxed`}>
                                        {line}
                                    </p>
                                );
                            })}
                        </div>

                        {/* Bottom Footer Details & Actions */}
                        <div className={`pt-4 border-t ${currentTheme.lineBorder} flex flex-wrap items-center justify-between gap-3 text-xs`}>
                            <div className="flex items-center space-x-3 text-[11px] opacity-75 font-medium">
                                <span className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{note?.updatedAt ? new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}</span>
                                </span>
                                <span>•</span>
                                <span className="capitalize">{currentTheme.name}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                {onAddSubTask && (
                                    <button
                                        type="button"
                                        onClick={handleOpenExtract}
                                        className="px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                                        title="Extract checkboxes/bullets to task timeline"
                                    >
                                        <ListPlus className="w-3.5 h-3.5" />
                                        <span>Extract to Subtasks</span>
                                    </button>
                                )}

                                {note && onDelete && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onDelete(note.id);
                                            onClose();
                                        }}
                                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 transition-colors"
                                        title="Delete note"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODE 2: EDIT / COMPOSE FORM (Triggered by Edit button or when creating a new note) */}
                {isEditing && !extractMode && (
                    <form onSubmit={handleSaveSubmit} className="p-6 space-y-4">
                        {/* Note Title Input */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-black uppercase tracking-wider opacity-75 text-slate-700">
                                Note Heading / Topic (Optional)
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Grammar Exceptions, Action Checklist, Figma link..."
                                className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold focus:outline-none border ${currentTheme.lineBorder} bg-white/70 ${currentTheme.textColor} placeholder:text-slate-400`}
                            />
                        </div>

                        {/* Color Palette Selector */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-wider opacity-75 text-slate-700 flex items-center space-x-1">
                                <Palette className="w-3.5 h-3.5" />
                                <span>Paper Color Theme</span>
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {(['yellow', 'green', 'blue', 'purple', 'rose', 'gray'] as NoteColor[]).map((c) => {
                                    const theme = STICKY_COLOR_THEMES[c];
                                    const isSelected = color === c;
                                    return (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setColor(c)}
                                            className={`p-2 rounded-xl border text-center flex flex-col items-center space-y-1 transition-all ${theme.paperBg} ${theme.border} ${isSelected
                                                ? 'ring-2 ring-indigo-600 ring-offset-1 scale-105 shadow-sm font-black'
                                                : 'opacity-70 hover:opacity-100 hover:scale-102'
                                                }`}
                                        >
                                            <span className={`w-3.5 h-3.5 rounded-full ${theme.accentDot} shadow-xs`} />
                                            <span className="text-[10px] text-slate-800 font-semibold">{theme.name.split(' ')[0]}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>