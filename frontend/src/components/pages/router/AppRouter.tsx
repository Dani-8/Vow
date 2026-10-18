import React from 'react';
import { Location, NavigateFunction } from 'react-router-dom';
import { Unlock } from 'lucide-react';
import { clearStoredPin } from '../../../api';
import { Task, User, MasterStreakStats, ActiveView } from '../../../types';

export const getTaskSlug = (task: Task): string => {
  const shortId = task._id ? task._id.replace(/^task_/, '').slice(-5) : '';
  if (!task.title) return task._id;
  const slug = task.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? (shortId ? `${slug}-${shortId}` : slug) : task._id;
};
