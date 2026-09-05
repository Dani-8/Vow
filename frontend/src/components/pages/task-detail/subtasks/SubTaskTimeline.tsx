
export const SubTaskTimeline: React.FC<SubTaskTimelineProps> = ({
    subTasks,
    selectedSubTaskId,
    onSelectSubTask,
    onOpenAddModal,
    onReorderSubTasks,
    onToggleStatus,
}) => {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Status counts
    const allCount = subTasks.length;
    const inProgressCount = subTasks.filter((st) => st.status === 'in_progress').length;
    const completedCount = subTasks.filter((st) => st.status === 'completed').length;
    const pendingCount = subTasks.filter((st) => st.status === 'pending').length;

    // Filtered list
    const filteredSubTasks = subTasks.filter((st) => {
        if (statusFilter === 'all') return true;
        return st.status === statusFilter;
    });

    // Reorder Handler (Move Up / Move Down)
    const handleMove = (indexInFullList: number, direction: 'up' | 'down', e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onReorderSubTasks) return;

        const targetIndex = direction === 'up' ? indexInFullList - 1 : indexInFullList + 1;
        if (targetIndex < 0 || targetIndex >= subTasks.length) return;

        const updated = [...subTasks];
        const [moved] = updated.splice(indexInFullList, 1);
        updated.splice(targetIndex, 0, moved);
        onReorderSubTasks(updated);
    };

    // Drag and Drop Handlers
    const handleDragStart = (indexInFullList: number, e: React.DragEvent) => {
        setDraggedIndex(indexInFullList);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (indexInFullList: number, e: React.DragEvent) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== indexInFullList) {
            setDragOverIndex(indexInFullList);
        }
    };

    const handleDrop = (indexInFullList: number, e: React.DragEvent) => {
        e.preventDefault();
        if (draggedIndex === null || !onReorderSubTasks) return;

        if (draggedIndex !== indexInFullList) {
            const updated = [...subTasks];
            const [moved] = updated.splice(draggedIndex, 1);
            updated.splice(indexInFullList, 0, moved);
            onReorderSubTasks(updated);
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 neu-card p-3 rounded-2xl">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#717699] px-2">
                    <Filter className="w-3.5 h-3.5 text-[#549acb]" />
                    <span>Filter:</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {/* All */}
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'all'
                            ? 'neu-inset text-[#2563eb] bg-[#eef4f9]'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        All <span className="ml-1 opacity-75">({allCount})</span>
                    </button>

                    {/* In Progress */}
                    <button
                        onClick={() => setStatusFilter('in_progress')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'in_progress'
                            ? 'neu-inset text-blue-600 bg-blue-50'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        In Progress <span className="ml-1 opacity-75">({inProgressCount})</span>
                    </button>

                    {/* Completed */}
                    <button
                        onClick={() => setStatusFilter('completed')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'completed'
                            ? 'neu-inset text-emerald-600 bg-emerald-50'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        Completed <span className="ml-1 opacity-75">({completedCount})</span>
                    </button>

                    {/* Pending */}
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${statusFilter === 'pending'
                            ? 'neu-inset text-purple-600 bg-purple-50'
                            : 'text-[#717699] hover:text-[#1a1c35]'
                            }`}
                    >
                        Pending <span className="ml-1 opacity-75">({pendingCount})</span>
                    </button>
                </div>
            </div>

            {/* Timeline List */}
            <div className="relative pl-1 sm:pl-2 space-y-3">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[118px] sm:left-[134px] top-6 bottom-8 w-[2px] bg-[#cbd5e1] pointer-events-none" />

                {filteredSubTasks.length === 0 ? (
                    <div className="neu-card p-8 text-center text-xs font-bold text-[#717699]">
                        No sub-tasks found matching the selected filter.
                    </div>
                ) : (
                    filteredSubTasks.map((st) => {
                        const indexInFullList = subTasks.findIndex((item) => item.id === st.id);
                        const isSelected = selectedSubTaskId === st.id;
                        const isCompleted = st.status === 'completed';
                        const isInProgress = st.status === 'in_progress';
                        const isDragOver = dragOverIndex === indexInFullList;
                        const isDragging = draggedIndex === indexInFullList;

                        return (
                            <div
                                key={st.id}
                                draggable
                                onDragStart={(e) => handleDragStart(indexInFullList, e)}
                                onDragOver={(e) => handleDragOver(indexInFullList, e)}
                                onDrop={(e) => handleDrop(indexInFullList, e)}
                                onDragEnd={handleDragEnd}
                                onClick={() => onSelectSubTask(st)}
                                className={`group flex items-center space-x-2 sm:space-x-3 p-3 rounded-2xl cursor-pointer transition-all ${isDragging
                                    ? 'opacity-40 scale-98 bg-gray-200 border-2 border-dashed border-blue-400'
                                    : isDragOver
                                        ? 'border-2 border-blue-500 bg-blue-50/50'
                                        : isSelected
                                            ? 'neu-card bg-[#eef4f9] shadow-md border-l-4 border-l-[#2563eb]'
                                            : 'hover:bg-[#e6ebf2]/60'
                                    }`}
                            >
                                {/* 1. Arrow Reordering (Up / Down) */}
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
