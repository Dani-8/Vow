import React from 'react';
import { X, Sparkles, Calendar, Tag, Lock, Unlock, Repeat, Check, Flame } from 'lucide-react';
import { Task } from '../../../../../types';
import { useTaskForm } from '../../hooks/useTaskForm';
import { ConsequenceChipInput } from '../../../../common/ConsequenceChipInput';

export interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: {
        title: string;
        description?: string;
        consequenceOfSkipping?: string;
        consequencesOfSkipping?: string[];
        tags?: string[];
        startTime?: string | null;
        endTime?: string | null;
        isPrivate?: boolean;
        isHabit?: boolean;
    }) => Promise<void>;
    editingTask?: Task | null;
    defaultIsPrivate?: boolean;
}