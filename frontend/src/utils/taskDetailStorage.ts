    console.error(`Error saving activities for task ${taskId}:`, e);
  }

  notifyTaskDetailUpdated(taskId, 'activity');
}

export function addTaskActivity(
  taskId: string,
  activityData: Omit<TaskActivityItem, 'id' | 'timestamp'>
): TaskActivityItem {
  const current = getTaskActivities(taskId);
  const newActivity: TaskActivityItem = {
    ...activityData,
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  const updated = [newActivity, ...current];
  saveTaskActivities(taskId, updated);
  return newActivity;
}

export function deleteTaskActivity(taskId: string, activityId: string): void {
  const current = getTaskActivities(taskId);
  const updated = current.filter((a) => a.id !== activityId);
  saveTaskActivities(taskId, updated);
}

function notifyTaskDetailUpdated(taskId: string, updateType: 'note' | 'attachments' | 'activity'): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(TASK_DETAIL_UPDATED_EVENT, {
        detail: { taskId, updateType },
      })
    );
  }
}
