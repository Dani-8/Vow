
    const setSubTaskStatus = (id: string, status: SubTask['status']) => {
        const updated = subTasks.map((st) => {
            if (st.id === id) {
                return {
                    ...st,
                    status,
                    timeLeft: status === 'completed' ? 'Completed' : st.timeLeft || 'In progress',
                };
            }
            return st;
        });
        saveAndSetSubTasks(updated);
    };

    const deleteSubTask = (id: string) => {
        const updated = subTasks.filter((st) => st.id !== id);
        saveAndSetSubTasks(updated);
    };

    const reorderSubTasks = (newOrder: SubTask[]) => {
        saveAndSetSubTasks(newOrder);
    };

    const completedCount = subTasks.filter((st) => st.status === 'completed').length;
    const totalCount = subTasks.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
        subTasks,
        addSubTask,
        updateSubTask,
        toggleSubTaskStatus,
        setSubTaskStatus,
        deleteSubTask,
        reorderSubTasks,
        completedCount,
        totalCount,
        progressPercent,
    };
}
