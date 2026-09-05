
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
