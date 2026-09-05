

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
