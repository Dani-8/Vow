
                                    <GripVertical className="w-4 h-4" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Sub-Task Button */}
            <button
                onClick={onOpenAddModal}
                className="w-full py-3.5 px-6 rounded-2xl neu-button text-sm font-bold text-[#2563eb] hover:bg-[#eef4f9] flex items-center justify-center space-x-2 transition-all border border-blue-200/50"
            >
                <Plus className="w-4 h-4" />
                <span>Add Sub-Task</span>
            </button>
        </div>
    );
};
