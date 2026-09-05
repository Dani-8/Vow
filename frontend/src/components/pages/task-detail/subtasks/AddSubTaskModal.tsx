
        e.preventDefault();
        if (!title.trim()) return;

        if (editingSubTask && onUpdate) {
            onUpdate({
                ...editingSubTask,
                title: title.trim(),
                dateLabel,
                dueDate,
                timeLeft,
                priority,
                description: description.trim(),
            });
        } else {
            onSave({
                title: title.trim(),
                dateLabel,
                dueDate,
                timeLeft,
                status: 'pending',
                priority,
                description: description.trim(),
                assignee: { name: 'Alex Rivera', email: 'demo@vow.app' },
                masterStreak: '4 Days',
            });
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="neu-card w-full max-w-lg p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#c8d0e0]/60 pb-4">
                    <h3 className="text-xl font-extrabold text-[#1a1c35]">
                        {editingSubTask ? 'Edit Sub-Task' : 'Add New Sub-Task'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="neu-button w-9 h-9 rounded-2xl flex items-center justify-center text-[#717699] hover:text-[#1a1c35]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Sub-Task Title */}
                    <div>
                        <label className="block text-xs font-bold text-[#717699] uppercase tracking-wider mb-2">
                            Sub-Task Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Define main 3 goals"
                            className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                        />
                    </div>

                    {/* Date Label & Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#717699] uppercase tracking-wider mb-2">
                                Timeline Label (e.g. Aug 17)
                            </label>
                            <input
                                type="text"
                                value={dateLabel}
                                onChange={(e) => setDateLabel(e.target.value)}
                                placeholder="Aug 17"
                                className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#717699] uppercase tracking-wider mb-2">
                                Due Date
                            </label>
                            <input
                                type="text"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                placeholder="Aug 17, 2026"
                                className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Time Left & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#717699] uppercase tracking-wider mb-2">
                                Time Left
                            </label>
                            <input
                                type="text"
                                value={timeLeft}
                                onChange={(e) => setTimeLeft(e.target.value)}
                                placeholder="Today / 2 Days Left"
                                className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#717699] uppercase tracking-wider mb-2">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                                className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                            >
                                <option value="High">🔥 High</option>
                                <option value="Medium">⚡ Medium</option>
                                <option value="Low">🌱 Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-[#717699] uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add key milestones, habits or requirements..."
                            className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#c8d0e0]/60">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl neu-button text-xs font-bold text-[#717699]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl neu-button-primary text-xs font-bold flex items-center space-x-2"
                        >
                            {editingSubTask ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            <span>{editingSubTask ? 'Update Sub-Task' : 'Create Sub-Task'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
