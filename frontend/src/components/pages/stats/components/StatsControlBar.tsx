import React, { useState, useRef, useEffect } from 'react';
import {
    Calendar,
    ChevronDown,
    X,
    Filter,
    Layers,
    RotateCcw,
    Check,
} from 'lucide-react';

export type TimeRangeOption = '7d' | '14d' | '30d' | '90d' | 'custom';
export type DayOfWeekOption = 'all' | 'weekdays' | 'weekends' | 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ExecutionTypeOption = 'all' | 'challenges' | 'tasks';