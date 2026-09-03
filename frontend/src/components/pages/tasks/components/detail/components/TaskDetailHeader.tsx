import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft,
    MoreHorizontal,
    Tag,
    Flame,
    Calendar,
    Clock,
    CheckCircle2,
    Circle,
    PlayCircle,
    Lock,
    Unlock,
    Edit3,
    Trash2,
} from 'lucide-react';
import { Task } from '../../../../../../types';

interface TaskDetailHeaderProps {
    task: Task;
    onBack: () => void;
    onToggleComplete: (task: Task) => void;
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    onTogglePrivate?: (task: Task) => void;
    onEditTask?: (task: Task) => void;
    onDeleteTask?: (task: Task) => void;
}