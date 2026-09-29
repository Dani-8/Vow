import React, { useState } from 'react';
import { Play, Timer, Sparkles, X, Clock } from 'lucide-react';

interface StartFocusSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    onStart: (minutes: number) => void;
}
