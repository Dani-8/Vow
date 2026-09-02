import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, MoreVertical, Lock, Unlock, Edit3, Trash2 } from 'lucide-react';
import { Task } from '../../../../../../types';

interface TaskCardMenuProps {
    task: Task;
    isStruggling: boolean;
    onOpenAIAssist: (task: Task) => void;
    onTogglePrivate: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}