import React, { useState } from 'react';
import { Play, Timer, Sparkles, X, Clock } from 'lucide-react';

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