import React, { useState, useMemo } from 'react';
import { Target, Flame, Trophy, Search, CheckCircle2, Lock, ListFilter, ArrowUpDown } from 'lucide-react';
import { Task } from '../../../../types';
import { getCategoryIconComponent } from '../../../common/categoryIcons';
import { calculateTaskSubTaskProgress } from '../../../../utils/subtaskStorage';

interface StatsLeaderboardProps {
    tasks: Task[];
}