
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

                        {/* Note Content Textarea & Formatting Guide */}
                        <div className="space-y-1 relative">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black uppercase tracking-wider opacity-75 text-slate-700">
                                    Note Content &amp; Rules *
                                </label>

                                {/* Interactive Formatting Guide Hover/Click Trigger */}
                                <div className="relative group/guide">
                                    <button
                                        type="button"
                                        className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-black/5 hover:bg-black/10 text-slate-700 text-[11px] font-bold transition-colors cursor-help"
                                        title="View formatting syntax & usecases"
                                    >
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        <span>Formatting Guide</span>
                                    </button>

                                    {/* Popover Card */}
                                    <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200/80 z-30 opacity-0 invisible group-hover/guide:opacity-100 group-hover/guide:visible transition-all duration-200 pointer-events-none group-hover/guide:pointer-events-auto text-left">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                                            <div className="flex items-center space-x-1.5">
                                                <span className="text-xs font-black text-slate-800">Supported Note Formats</span>
                                            </div>
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Click to insert</span>
                                        </div>

                                        <div className="space-y-2 text-[11px]">
                                            {/* Case 1: Checklists */}
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

                                            {/* Case 2: Bullet Points */}
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

                                            {/* Case 3: Blockquotes / Quotes */}
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

                                            {/* Case 4: Freeform Lined Paper */}
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
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-black/10">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                                <h4 className="text-xs font-black uppercase text-indigo-900">
                                    Detected Checklist Items ({detectedTasks.length})
                                </h4>
                            </div>
                            <button
                                type="button"
                                onClick={() => setExtractMode(false)}
                                className="text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                                Back to Note
                            </button>
                        </div>

                        <p className="text-xs text-slate-700 font-medium">
                            Select items from this note to automatically create active Subtasks on your task timeline:
                        </p>

                        {detectedTasks.length > 0 ? (
                            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                                {detectedTasks.map((item, idx) => {
                                    const isChecked = selectedToImport.includes(item);
                                    return (
                                        <label
                                            key={idx}
                                            className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${isChecked
                                                ? 'bg-white border-indigo-300 shadow-xs'
                                                : 'bg-white/50 border-black/10 opacity-75'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                    if (isChecked) {
                                                        setSelectedToImport(selectedToImport.filter((t) => t !== item));
                                                    } else {
                                                        setSelectedToImport([...selectedToImport, item]);
                                                    }
                                                }}
                                                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                            />
                                            <span className="text-xs font-bold text-slate-800 flex-1">{item}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs italic text-slate-500 p-4 rounded-xl bg-white/60 text-center border border-black/10">
                                No bullet points or checkbox items found. Write lines starting with <code>- [ ] </code> or <code>- </code> to extract them.
                            </p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-black/10">
                            <button
                                type="button"
                                onClick={() => setExtractMode(false)}
                                className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-bold text-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={selectedToImport.length === 0}
                                onClick={handleImportSubtasks}
                                className="px-5 py-2 rounded-xl neu-button-primary text-xs font-bold text-white flex items-center space-x-1.5 disabled:opacity-50"
                            >
                                <span>Import {selectedToImport.length} Subtasks</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
