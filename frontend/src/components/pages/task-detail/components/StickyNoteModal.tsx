

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
