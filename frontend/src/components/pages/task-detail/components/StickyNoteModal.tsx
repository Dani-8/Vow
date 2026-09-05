
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
