import React, { useState } from 'react';
import { Play, Timer, Sparkles, X, Clock, Check } from 'lucide-react';

interface StartFocusSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    onStart: (minutes: number) => void;
}

const PRESET_DURATIONS = [
    { label: '15m Sprint', minutes: 15, desc: 'Quick laser focus' },
    { label: '25m Pomodoro', minutes: 25, desc: 'Standard deep work block' },
    { label: '45m Power', minutes: 45, desc: 'Substantial milestone focus' },
    { label: '60m Deep', minutes: 60, desc: 'Extended deep dive' },
];

export const StartFocusSessionModal: React.FC<StartFocusSessionModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    onStart,
}) => {
    const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
    const [customHours, setCustomHours] = useState<string>('');
    const [customMinutes, setCustomMinutes] = useState<string>('');
    const [isCustom, setIsCustom] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        let finalMinutes = selectedMinutes;
        if (isCustom) {
            const hrs = Math.max(0, parseInt(customHours, 10) || 0);
            const mins = Math.max(0, parseInt(customMinutes, 10) || 0);
            const combined = hrs * 60 + mins;
            // Cap between 1 min and 12 hours (720 min)
            finalMinutes = Math.max(1, Math.min(720, combined || 25));
        }
        onStart(finalMinutes);
        onClose();
    };