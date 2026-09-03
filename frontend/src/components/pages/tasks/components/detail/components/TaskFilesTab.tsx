import React, { useState, useRef } from 'react';
import {
    Paperclip,
    UploadCloud,
    Link2,
    FileText,
    Image as ImageIcon,
    FileSpreadsheet,
    FileCode,
    ExternalLink,
    Trash2,
    Download,
    Plus,
    Search,
    Filter,
    CheckCircle2,
    Globe
} from 'lucide-react';
import { TaskAttachment } from '../../../../../../types';

interface TaskFilesTabProps {
    taskId: string;
    attachments: TaskAttachment[];
    onAddAttachment: (attachment: Omit<TaskAttachment, 'id' | 'uploadedAt'>) => void;
    onDeleteAttachment: (attachmentId: string) => void;
}