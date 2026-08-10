import React, { useState, useEffect, FormEvent } from 'react';
import { Task } from '../types';

interface UseTaskFormProps {
    editingTask?: Task | null;
    isOpen: boolean;
    defaultIsPrivate?: boolean;
    onSubmit: (taskData: {
        title: string;
        description?: string;
        tags?: string[];
        startTime?: string | null;
        endTime?: string | null;
        isPrivate?: boolean;
        isHabit?: boolean;
    }) => Promise<void>;
    onClose: () => void;
}

export function useTaskForm({
    editingTask,
    isOpen,
    defaultIsPrivate = false,
    onSubmit,
    onClose,
}: UseTaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isHabit, setIsHabit] = useState(false);
    const [isPrivate, setIsPrivate] = useState(defaultIsPrivate);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description || '');
            setTagsInput(editingTask.tags ? editingTask.tags.join(', ') : '');
            setIsHabit(editingTask.isHabit);
            setIsPrivate(editingTask.isPrivate);
            if (editingTask.endTime) {
                const d = new Date(editingTask.endTime);
                const isoStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16);
                setEndTime(isoStr);
            } else {
                setEndTime('');
            }
        } else {
            setTitle('');
            setDescription('');
            setTagsInput('');
            setEndTime('');
            setIsHabit(false);
            setIsPrivate(defaultIsPrivate);
        }
        setError(null);
    }, [editingTask, isOpen, defaultIsPrivate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const tags = tagsInput
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                tags,
                endTime: endTime ? new Date(endTime).toISOString() : null,
                isHabit,
                isPrivate,
            });

            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
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
    };
}
