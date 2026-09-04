import React, { useState, useEffect, FormEvent } from 'react';
import { Task } from '../../../../types';

interface UseTaskFormProps {
    editingTask?: Task | null;
    isOpen: boolean;
    defaultIsPrivate?: boolean;
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
    const [consequenceOfSkipping, setConsequenceOfSkipping] = useState('');
    const [consequencesOfSkipping, setConsequencesOfSkipping] = useState<string[]>([]);
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
            const rawConsequences = Array.isArray(editingTask.consequencesOfSkipping) && editingTask.consequencesOfSkipping.length > 0
                ? editingTask.consequencesOfSkipping
                : (editingTask.consequenceOfSkipping ? editingTask.consequenceOfSkipping.split('\n').map((s) => s.trim()).filter(Boolean) : []);
            setConsequencesOfSkipping(rawConsequences);
            setConsequenceOfSkipping(editingTask.consequenceOfSkipping || rawConsequences.join('\n') || '');
            setTagsInput(editing