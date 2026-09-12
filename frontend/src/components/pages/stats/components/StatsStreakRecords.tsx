import React, { useState, useMemo } from 'react';
import { Target, Flame, Trophy, Search, Lock, Award, Sparkles, Star, Medal } from 'lucide-react';
import { Task, MasterStreakStats } from '../../../../types';
import { getCategoryIconComponent } from '../../../common/categoryIcons';
import { calculateTaskSubTaskProgress } from '../../../../utils/subtaskStorage';

interface StatsStreakRecordsProps {
    tasks: Task[];
    stats: MasterStreakStats | null;
}