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

import { TaskDetailPage } from '../tasks/TaskDetailPage';
import { TasksPage } from '../tasks/TasksPage';
import { StatsView } from '../stats/StatsView';
import { HomeView } from '../home/HomeView';
import { TaskMapPage } from '../task-map/TaskMapPage';
import { ChallengesPage } from '../challenges/ChallengesPage';
import { ChallengeDetailPage } from '../challenges/ChallengeDetailPage';

import { FilterCategory } from '../tasks/components/main/TaskControlsBar';
import { Challenge } from '../../../types';