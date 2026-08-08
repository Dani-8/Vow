import { useState } from 'react';
import { Task } from '../types';

export function useModalState() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [isAIAssistOpen, setIsAIAssistOpen] = useState(false);

    const [selectedTaskForAI, setSelectedTaskForAI] = useState<Task | null>(null);
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const openCreateTaskModal = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const openEditTaskModal = (task: Task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const openAIAssistModal = (task: Task) => {
        setSelectedTaskForAI(task);
        setIsAIAssistOpen(true);
    };

    return {
        isAuthModalOpen,
        setIsAuthModalOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        isPinModalOpen,
        setIsPinModalOpen,
        isAIAssistOpen,
        setIsAIAssistOpen,
        selectedTaskForAI,
        setSelectedTaskForAI,
        selectedTaskForDetail,
        setSelectedTaskForDetail,
        editingTask,
        setEditingTask,
        openCreateTaskModal,
        openEditTaskModal,
        openAIAssistModal,
    };
}
