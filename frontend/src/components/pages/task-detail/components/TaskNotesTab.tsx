
-center space-y-3">
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
