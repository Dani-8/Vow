
                                <div className="flex flex-col items-center justify-center -space-y-0.5 shrink-0 text-[#94a3b8] group-hover:text-[#54597d] transition-colors">
                                    <button
                                        disabled={indexInFullList === 0}
                                        onClick={(e) => handleMove(indexInFullList, 'up', e)}
                                        className="p-0.5 hover:text-[#2563eb] hover:bg-white/80 rounded transition-all disabled:opacity-20 disabled:hover:bg-transparent"
                                        title="Move Up"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        disabled={indexInFullList === subTasks.length - 1}
                                        onClick={(e) => handleMove(indexInFullList, 'down', e)}
                                        className="p-0.5 hover:text-[#2563eb] hover:bg-white/80 rounded transition-all disabled:opacity-20 disabled:hover:bg-transparent"
                                        title="Move Down"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* 2. Date Label */}
                                <div className="w-14 sm:w-16 text-right text-xs font-extrabold text-[#717699] flex-shrink-0">
                                    {st.dateLabel}
                                </div>

                                {/* 3. Timeline Indicator Node (with toggle on click) */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onToggleStatus) {
                                            onToggleStatus(st.id);
                                        } else if (onSelectSubTask) {
                                            onSelectSubTask(st);
                                        }
                                    }}
                                    className="relative z-1 flex-shrink-0 flex items-center justify-center ml-1 sm:ml-2 mr-1 cursor-pointer group/node"
                                    title="Click to toggle status (Pending -> Completed)"
                                >
                                    {isCompleted ? (
                                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                                            <Check className="w-4 h-4 stroke-[3]" />
                                        </div>
                                    ) : isInProgress ? (
                                        <div className="w-7 h-7 rounded-full bg-white border-2 border-[#2563eb] flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                                            <div className="w-3 h-3 rounded-full bg-[#2563eb]" />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-[#E0E5EC] border-2 border-[#a0aec0] flex items-center justify-center hover:scale-110 transition-transform">
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
