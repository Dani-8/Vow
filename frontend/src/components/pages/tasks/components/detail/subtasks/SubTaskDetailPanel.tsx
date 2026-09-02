import React from 'react';
import {
    X,
    Calendar,
    Clock,
    User as UserIcon,
    Flame,
    FileText,
    Download,
    CheckCircle,
    Edit2,
    Trash2,
    PlayCircle,
} from 'lucide-react';
import { SubTask } from '../../../../../../types';

interface SubTaskDetailPanelProps {
    subTask: SubTask;
    onClose: () => void;
    onToggleStatus: (id: string) => void;
    onSetStatus?: (id: string, status: SubTask['status']) => void;
    onEdit: (subTask: SubTask) => void;
    onDelete: (id: string) => void;
}