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
                            <h3 className={`text-base font-black tracking-tight ${currentTheme.textColor}`}>
                                {title || (isEditing ? 'Untitled Sticky Note' : 'Quick Thought Note')}
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                        {!isEditing && !extractMode && (
                            <>
                                <button
                                    onClick={handleCopyNote}
                                    className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 transition-colors"
                                    title="Copy note text"
                                >
                                    {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={handleOpenExtract}
                                    className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-indigo-700 transition-colors"
                                    title="Extract checklist items to Subtasks"
                                >
                                    <ListPlus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 transition-colors"
                                    title="Edit Note"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                {onDelete && note && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Delete this sticky note?')) {
                                                onDelete(note.id);
                                                onClose();
                                            }
                                        }}
                                        className="p-2 rounded-xl bg-black/5 hover:bg-rose-500/20 text-rose-700 transition-colors"
                                        title="Delete Note"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-slate-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* MODE 1: READ / PAPER VIEW */}
                {!isEditing && !extractMode && (
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div
                            className={`min-h-[160px] p-5 rounded-2xl border ${currentTheme.lineBorder} bg-white/50 backdrop-blur-2xs shadow-inner space-y-2`}
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
                                            className="flex items-center space-x-2.5 cursor-pointer group/check"
                                            style={{ height: '28px' }}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked
                                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                                : 'border-slate-400 bg-white/80 group-hover/check:border-slate-600'
                                                }`}>
                                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                            </div>
                                            <span className={`text-xs font-semibold select-none ${isChecked
                                                ? 'line-through opacity-50 text-slate-500'
                                                : currentTheme.textColor
                                                }`}>
                                                {line.replace(/^-\s*\[[ x]\]\s*/, '')}
                                            </span>
                                        </div>
                                    );
                                }

                                if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
                                    return (
                                        <li
                                            key={idx}
                                            className={`ml-5 list-disc text-xs font-semibold ${currentTheme.textColor}`}
                                            style={{ height: '28px' }}
                                        >
                                            {line.replace(/^[-*•]\s*/, '')}
                                        </li>
                                    );
                                }

                                if (/^\d+\.\s+/.test(line)) {
                                    return (
                                        <div
                                            key={idx}
                                            className={`ml-2 text-xs font-semibold ${currentTheme.textColor} flex items-center space-x-1.5`}
                                            style={{ height: '28px' }}
                                        >
                                            <span className="font-bold opacity-75">{line.match(/^\d+\./)?.[0]}</span>
                                            <span>{line.replace(/^\d+\.\s*/, '')}</span>
                                        </div>
                                    );
                                }

                                if (line.startsWith('> ')) {
                                    return (
                                        <p
                                            key={idx}
                                            className={`italic pl-3 border-l-2 border-current/40 text-xs font-serif ${currentTheme.textColor}`}
                                            style={{ height: '28px' }}
                                        >
                                            {line.substring(2)}
                                        </p>
                                    );
                                }

                                if (line.trim() === '') {
                                    return <div key={idx} style={{ height: '28px' }} />;
                                }

                                return (
                                    <p
                                        key={idx}
                                        className={`text-xs font-medium ${currentTheme.textColor}`}
                                        style={{ height: '28px' }}
                                    >
                                        {line}
                                    </p>
                                );
                            })}
                        </div>

                        {note && (
                            <div className="flex items-center justify-between pt-2 border-t border-black/5 text-[11px] text-slate-600 font-medium">
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span>Updated: {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </span>
                                </div>
                                <button
                                    onClick={handleOpenExtract}
                                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    <span>Convert to Subtasks</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* MODE 2: EDITING / FORM VIEW */}
                {isEditing && !extractMode && (
                    <form onSubmit={handleSaveSubmit} className="p-6 space-y-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-black uppercase tracking-wider opacity-75 text-slate-700">
                                Note Title (Optional)
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Formula Sheet, Key Rules, Blockers..."
                                className={`w-full p-2.5 rounded-xl text-xs font-bold focus:outline-none border ${currentTheme.lineBorder} bg-white/70 ${currentTheme.textColor} placeholder:text-slate-400`}
                            />
                        </div>

                        {/* Color Selector */}
                        <StickyNoteColorPicker
                            selectedColor={color}
                            onSelectColor={setColor}
                        />
