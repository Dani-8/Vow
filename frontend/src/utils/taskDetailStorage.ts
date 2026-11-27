      localStorage.setItem(key, JSON.stringify(DEFAULT_TASK_ACTIVITIES[seedKey]));
    } catch {
      // ignore
    }
    return DEFAULT_TASK_ACTIVITIES[seedKey];
  }

  // Generic created fallback
  return [
    {
      id: `act_init_${taskId}`,
      type: 'created',
      message: 'Task initiated and organized in workspace',
      user: 'Alex Rivera',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];
}

export function saveTaskActivities(taskId: string, activities: TaskActivityItem[]): void {
  if (!taskId) return;
  const key = `vow_task_activities_${taskId}`;
  try {
    localStorage.setItem(key, JSON.stringify(activities));
  } catch (e) {
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
