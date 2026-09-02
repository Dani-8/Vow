import React, { useState } from 'react';
import {
    Check,
    Plus,
    GripVertical,
    ChevronUp,
    ChevronDown,
    Filter,
} from 'lucide-react';
import { SubTask } from '../../../../../../types';

type FilterStatus = 'all' | 'in_progress' | 'completed' | 'pending';

interface SubTaskTimelineProps {
    subTasks: SubTask[];
    selectedSubTaskId: string | null;
    onSelectSubTask: (subTask: SubTask) => void;
    onOpenAddModal: () => void;
    onReorderSubTasks?: (newOrder: SubTask[]) => void;
    onToggleStatus?: (id: string) => void;
}