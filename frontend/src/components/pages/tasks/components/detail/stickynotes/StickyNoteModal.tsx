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

                        {/* Note Content Textarea & Formatting Guide */}
                        <div className="space-y-1 relative">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black uppercase tracking-wider opacity-75 text-slate-700">
                                    Note Content &amp; Rules *
                                </label>

                                <div className="relative group/guide">
                                    <button
                                        type="button"
                                        className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-black/5 hover:bg-black/10 text-slate-700 text-[11px] font-bold transition-colors cursor-help"
                                        title="View formatting syntax & usecases"
                                    >
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        <span>Formatting Guide</span>
                                    </button>

                                    <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200/80 z-30 opacity-0 invisible group-hover/guide:opacity-100 group-hover/guide:visible transition-all duration-200 pointer-events-none group-hover/guide:pointer-events-auto text-left">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                                            <span className="text-xs font-black text-slate-800">Supported Note Formats</span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Click to insert</span>
                                        </div>

                                        <div className="space-y-2 text-[11px]">
                                            <button
                                                type="button"
                                                onClick={() => setContent((prev) => prev ? `${prev}\n- [ ] New checklist item` : '- [ ] New checklist item')}
                                                className="w-full p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 text-left transition-colors flex items-start space-x-2 group/item"
                                            >
                                                <span className="w-4 h-4 rounded border border-slate-400 bg-white flex items-center justify-center text-[10px] text-indigo-600 shrink-0 mt-0.5 group-hover/item:border-indigo-500">✓</span>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-800 flex items-center justify-between">
                                                        <span>Checklist Items</span>
                                                        <code className="text-[10px] text-indigo-600 font-mono bg-white px-1 py-0.5 rounded border border-slate-200">- [ ]</code>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Interactive checkboxes in paper view. Can be extracted directly into subtasks!</p>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setContent((prev) => prev ? `${prev}\n- Bullet point note` : '- Bullet point note')}
                                                className="w-full p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 text-left transition-colors flex items-start space-x-2 group/item"
                                            >
                                                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 group-hover/item:bg-indigo-200 group-hover/item:text-indigo-800">•</span>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-800 flex items-center justify-between">
                                                        <span>Bullet Lists</span>
                                                        <code className="text-[10px] text-indigo-600 font-mono bg-white px-1 py-0.5 rounded border border-slate-200">- item</code>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Clean indented bullet points for ideas, grammar rules, and lists.</p>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setContent((prev) => prev ? `${prev}\n> "Key insight or motivational quote"` : '> "Key insight or motivational quote"')}
                                                className="w-full p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 text-left transition-colors flex items-start space-x-2 group/item"
                                            >
                                                <span className="w-4 h-4 rounded border-l-2 border-slate-600 bg-slate-100 flex items-center justify-center text-[10px] italic font-serif shrink-0 mt-0.5 group-hover/item:border-indigo-600">“</span>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-800 flex items-center justify-between">
                                                        <span>Quotes &amp; Insights</span>
                                                        <code className="text-[10px] text-indigo-600 font-mono bg-white px-1 py-0.5 rounded border border-slate-200">&gt; quote</code>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Highlights key insights, quotes, and warnings in styled blockquote callouts.</p>
                                                </div>
                                            </button>

                                            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-left flex items-start space-x-2">
                                                <span className="w-4 h-4 rounded bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">¶</span>
                                                <div className="flex-1">
                                                    <div className="font-bold text-slate-800">Freeform Paragraphs</div>
                                                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Regular text automatically lines up with the notebook paper rules.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <textarea
                                required
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Type your notes, formulas, vocabulary, or thoughts here...&#10;- [ ] Checklist item&#10;- Bullet point&#10;> Quote or reflection"
                                className={`w-full p-3.5 rounded-xl text-xs font-mono leading-relaxed focus:outline-none border ${currentTheme.lineBorder} bg-white/70 ${currentTheme.textColor} placeholder:text-slate-400 resize-none`}
                            />
                        </div>

                        {/* Pin to Top Checkbox */}
                        <label className="flex items-center space-x-2.5 cursor-pointer pt-0.5">
                            <input
                                type="checkbox"
                                checked={isPinned}
                                onChange={(e) => setIsPinned(e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-0 w-4 h-4"
                            />
                            <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                                <Pin className="w-3.5 h-3.5 text-amber-600" />
                                <span>Pin this note to the top of the board</span>
                            </span>
                        </label>

                        {/* Actions Bar */}
                        <div className="flex items-center justify-between pt-2 border-t border-black/10">
                            {note ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold text-slate-700"
                                >
                                    Cancel
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold text-slate-700"
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={!content.trim()}
                                className="px-5 py-2 rounded-xl neu-button-primary text-xs font-bold text-white flex items-center space-x-1.5 disabled:opacity-50 shadow-md ml-auto"
                            >
                                <Check className="w-3.5 h-3.5" />
                                <span>{note ? 'Save Changes' : 'Pin Note'}</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* MODE 3: SUBTASK EXTRACTION SUB-VIEW */}
                {extractMode && (
                    <StickyNoteSubtaskConverter
                        detectedTasks={detectedTasks}
                        selectedToImport={selectedToImport}
                        onToggleSelect={(item) => {
                            if (selectedToImport.includes(item)) {
                                setSelectedToImport(selectedToImport.filter((t) => t !== item));
                            } else {
                                setSelectedToImport([...selectedToImport, item]);
                            }
                        }}
                        onBackToNote={() => setExtractMode(false)}
                        onImport={handleImportSubtasks}
                    />
                )}
            </div>
        </div>
    );
};
