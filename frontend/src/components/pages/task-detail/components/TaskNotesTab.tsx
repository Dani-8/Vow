
    {line.replace(/^-\s*\[[ x]\]\s*/, '')}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
                                            return (
                                                <li key={idx} className="ml-4 list-disc">
                                                    {line.replace(/^[-*•]\s*/, '')}
                                                </li>
                                            );
                                        }
                                        if (line.startsWith('> ')) {
                                            return (
                                                <p key={idx} className="italic opacity-80 pl-2 border-l-2 border-slate-400">
                                                    {line.substring(2)}
                                                </p>
                                            );
                                        }
                                        if (line.trim() === '') return <div key={idx} className="h-1" />;
                                        return <p key={idx} className="line-clamp-2">{line}</p>;
                                    })}
                                </div>

                                {/* Bottom Footer */}
                                <div className={`pt-3 mt-2 border-t ${colorCfg.lineBorder} flex items-center justify-between text-[10px] opacity-75 font-medium`}>
                                    <span>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    <span className="capitalize">{colorCfg.name.split(' ')[0]}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="neu-card p-10 bg-[#E0E5EC] text-center space-y-3">
                    <StickyNote className="w-10 h-10 text-amber-500/80 mx-auto" />
                    <p className="text-sm font-black text-[#1a1c35]">No sticky notes pinned yet</p>
                    <p className="text-xs text-[#717699] max-w-md mx-auto">
                        Pin paper notes for guidelines, research findings, vocabulary, or quick thoughts. Choose custom paper colors and pin your highest priority notes to the top.
                    </p>
                    <button
                        onClick={handleOpenAdd}
                        className="px-4 py-2 rounded-xl neu-button-primary text-xs font-bold text-white inline-flex items-center space-x-1.5 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create First Note</span>
                    </button>
                </div>
            )}

            {/* Extracted Dedicated Modal */}
            <StickyNoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                note={editingNote}
                taskId={taskId}
                onSave={handleSaveModal}
                onDelete={onDeleteStickyNote}
                onAddSubTask={onAddSubTask}
            />
        </div>
    );
};
