
            {activeTab === 'overview' && (
                <TaskOverviewTab
                    task={task}
                    subTasks={subTasks}
                    stickyNotes={stickyNotes}
                    attachments={attachments}
                    activities={activities}
                    completedCount={completedCount}
                    totalCount={totalCount}
                    progressPercent={progressPercent}
                    onTabChange={setActiveTab}
                    onToggleComplete={onToggleComplete}
                />
            )}

            {activeTab === 'sub-tasks' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-all">
                    {/* Left / Main Column: Sub-Tasks Timeline */}
                    <div
                        className={`transition-all duration-300 ${activeSelectedSubTask ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl'
                            }`}
                    >
                        <SubTaskTimeline
                            subTasks={subTasks}
                            selectedSubTaskId={activeSelectedSubTask?.id || null}
                            onSelectSubTask={(st) => setSelectedSubTask(st)}
                            onToggleStatus={(id) => {
                                toggleSubTaskStatus(id);
                                const target = subTasks.find((s) => s.id === id);
                                if (target) {
                                    const willBeCompleted = target.status !== 'completed';
                                    addTaskActivity(task._id, {
                                        type: willBeCompleted ? 'subtask_complete' : 'status_change',
                                        message: willBeCompleted
                                            ? `Completed subtask: "${target.title}"`
                                            : `Reopened subtask: "${target.title}"`,
                                        user: 'Alex Rivera',
                                    });
                                    setActivities(getTaskActivities(task._id));
                                }
                            }}
                            onOpenAddModal={() => {
                                setEditingSubTask(null);
                                setIsAddModalOpen(true);
                            }}
                            onReorderSubTasks={reorderSubTasks}
                        />
                    </div>

                    {/* Right Column: Closeable Sub-Task Detail Panel */}
                    {activeSelectedSubTask && (
                        <div className="lg:col-span-5 sticky top-4">
                            <SubTaskDetailPanel
                                subTask={activeSelectedSubTask}
                                onClose={() => setSelectedSubTask(null)}
                                onToggleStatus={toggleSubTaskStatus}
                                onSetStatus={setSubTaskStatus}
                                onEdit={(st) => {
                                    setEditingSubTask(st);
                                    setIsAddModalOpen(true);
                                }}
                                onDelete={(id) => {
                                    deleteSubTask(id);
                                    setSelectedSubTask(null);
                                }}
                            />
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'notes' && (
                <TaskNotesTab
                    taskId={task._id}
                    stickyNotes={stickyNotes}
                    onAddStickyNote={handleAddStickyNote}
                    onUpdateStickyNote={handleUpdateStickyNote}
                    onDeleteStickyNote={handleDeleteStickyNote}
                    onAddSubTask={(newSt) => {
                        addSubTask(newSt);
                        addTaskActivity(task._id, {
                            type: 'subtask_add',
                            message: `Imported subtask from sticky notes: "${newSt.title}"`,
                            user: 'Alex Rivera',
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
