import React, { useState } from 'react';
import {
  Activity,
  MessageSquare,
  CheckCircle2,
  Paperclip,
  Clock,
  Sparkles,
  Send,
  AlertTriangle,
  Flame,
  FileText,
  Trash2,
  Target,
  TrendingUp,
  ShieldAlert,
  Tag
} from 'lucide-react';
import { TaskActivityItem } from '../../../../../../types';

interface TaskActivityTabProps {
  taskId: string;
  activities: TaskActivityItem[];
  onAddComment: (message: string, commentType?: string) => void;
  onDeleteActivity?: (activityId: string) => void;
}