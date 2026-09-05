
            {/* Attachments Section */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-[#717699] uppercase tracking-wider">
                    Attachments
                </label>
                <div className="neu-card p-3 rounded-2xl flex items-center justify-between bg-white/60">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                            PDF
                        </div>
                        <div>
                            <div className="text-xs font-bold text-[#1a1c35]">
                                {subTask.attachments?.[0]?.name || 'roadmap.pdf'}
                            </div>
                            <div className="text-[10px] text-[#717699]">
                                {subTask.attachments?.[0]?.size || '1.2 MB'}
                            </div>
                        </div>
                    </div>
                    <button className="neu-button p-2 rounded-xl text-[#717699] hover:text-[#1a1c35]">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Actions Row */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
                {/* Mark as Complete Button */}
                <button
                    onClick={() => onToggleStatus(subTask.id)}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
                </button>

                {/* Edit Sub-Task Button */}
                <button
                    onClick={() => onEdit(subTask)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 flex items-center justify-center space-x-1.5"
                >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                </button>

                {/* Delete Sub-Task Button */}
                <button
                    onClick={() => onDelete(subTask.id)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 flex items-center justify-center space-x-1.5"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};
