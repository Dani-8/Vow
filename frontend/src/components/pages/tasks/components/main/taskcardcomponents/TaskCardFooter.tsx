import React from 'react';
import { Flame, Trophy, AlertCircle, Clock } from 'lucide-react';

interface TaskCardFooterProps {
    currentStreak: number;
    bestStreak: number;
    isCompleted: boolean;
    timeLeftStr: string | null;
    isStruggling: boolean;
}