 transition-transform">
                                            <div className="w-2 h-2 rounded-full bg-[#a0aec0]" />
                                        </div>
                                    )}
                                </button>

                                {/* 4. Sub-Task Title */}
                                <div className="flex-1 min-w-0">
                                    <h4
                                        className={`text-sm sm:text-base font-bold truncate transition-colors ${isSelected
                                            ? 'text-[#1a1c35]'
                                            : isCompleted
                                                ? 'text-[#717699] line-through'
                                                : 'text-[#2d3748] group-hover:text-[#1a1c35]'
                                            }`}
                                    >
                                        {st.title}
                                    </h4>
                                </div>

                                {/* 5. Drag & Drop Handle (at the very end on the right) */}
                                <div
                                    className="p-1.5 rounded-xl hover:bg-white/80 text-[#94a3b8] group-hover:text-[#54597d] cursor-grab active:cursor-grabbing transition-colors shrink-0 ml-1 sm:ml-2"
                                    title="Drag to reorder"
                                >
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
