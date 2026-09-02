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

export const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingTask,
    defaultIsPrivate = false,
}) => {
    const {
        title,
        setTitle,
        description,
        setDescription,
        consequenceOfSkipping,
        setConsequenceOfSkipping,
        consequencesOfSkipping,
        setConsequencesOfSkipping,
        tagsInput,
        setTagsInput,
        endTime,
        setEndTime,
        isHabit,
        setIsHabit,
        isPrivate,
        setIsPrivate,
        loading,
        error,
        handleSubmit,
    } = useTaskForm({
        editingTask,
        isOpen,
        defaultIsPrivate,
        onSubmit,
        onClose,
    });

    if (!isOpen) return null;