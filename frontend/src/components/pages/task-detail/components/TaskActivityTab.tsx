
                                        {onDeleteActivity && (
                                            <button
                                                onClick={() => onDeleteActivity(item.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 rounded neu-button text-slate-400 hover:text-rose-600 transition-all text-xs"
                                                title="Delete log entry"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-xs text-[#2b2e4a] leading-relaxed font-medium">
                                        {item.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 space-y-2">
                        <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-[#1a1c35]">No activity logged yet</p>
                        <p className="text-[11px] text-slate-400">All check-ins, edits, and subtask completions will appear here automatically.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
