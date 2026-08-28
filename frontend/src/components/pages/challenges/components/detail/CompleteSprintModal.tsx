import React, { useState } from 'react';
import { X, Award, Star, CheckCircle2 } from 'lucide-react';
import { ChallengeSprint, SprintRetrospective } from '../../../../../types';

interface CompleteSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    sprint: ChallengeSprint;
    accentColor: string;
    onConfirmComplete: (retrospective: SprintRetrospective) => Promise<void>;
    onStartNextSprintPrompt: () => void;
}

export const CompleteSprintModal: React.FC<CompleteSprintModalProps> = ({
    isOpen,
    onClose,
    sprint,
    accentColor,
    onConfirmComplete,
    onStartNextSprintPrompt,
}) => {
    const [summary, setSummary] = useState('');
    const [score, setScore] = useState<number>(5);
    const [keyLearnings, setKeyLearnings] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const completedDaysCount = (sprint.logs || []).filter((l) => l.status === 'completed').length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!summary.trim()) {
            setError('Please write a brief summary of what you achieved during this sprint.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await onConfirmComplete({
                completedAt: new Date().toISOString().split('T')[0],
                summary: summary.trim(),
                score,
                keyLearnings: keyLearnings.trim() || undefined,
            });
            onClose();
            onStartNextSprintPrompt();
        } catch (err: any) {