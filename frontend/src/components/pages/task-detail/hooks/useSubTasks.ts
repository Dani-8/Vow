

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
