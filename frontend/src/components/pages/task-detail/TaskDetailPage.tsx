

            {/* Add / Edit Sub-Task Modal */}
            <AddSubTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={(newSt) => {
                    addSubTask(newSt);
                    addTaskActivity(task._id, {
                        type: 'subtask_add',
                        message: `Added new subtask: "${newSt.title}"`,
                        user: 'Alex Rivera',
                    });
                    setActivities(getTaskActivities(task._id));
                }}
                editingSubTask={editingSubTask}
                onUpdate={updateSubTask}
            />
        </div>
    );
};
