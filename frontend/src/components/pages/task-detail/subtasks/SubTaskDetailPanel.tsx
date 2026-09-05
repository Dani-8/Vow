
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
