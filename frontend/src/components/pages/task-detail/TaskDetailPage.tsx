
                        });
                        setActivities(getTaskActivities(task._id));
                    }}
                />
            )}

            {activeTab === 'files' && (
                <TaskFilesTab
                    taskId={task._id}
                    attachments={attachments}
                    onAddAttachment={handleAddAttachment}
                    onDeleteAttachment={handleDeleteAttachment}
                />
            )}

            {activeTab === 'activity' && (
                <TaskActivityTab
                    taskId={task._id}
                    activities={activities}
                    onAddComment={handleAddComment}
                    onDeleteActivity={handleDeleteActivity}
                />
            )}

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
