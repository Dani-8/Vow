
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onTogglePrivate={onTogglePrivate}
          onOpenAIAssist={onOpenAIAssist}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
