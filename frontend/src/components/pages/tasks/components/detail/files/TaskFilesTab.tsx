import React, { useState, useRef } from 'react';
import {
    Link2,
    Search,
} from 'lucide-react';
import { TaskAttachment } from '../../../../../../types';
import { FileUploadZone } from './FileUploadZone';
import { AddLinkModal } from './AddLinkModal';
import { TaskFileCard } from './TaskFileCard';

interface TaskFilesTabProps {
    taskId: string;
    attachments: TaskAttachment[];
    onAddAttachment: (attachment: Omit<TaskAttachment, 'id' | 'uploadedAt'>) => void;
    onDeleteAttachment: (attachmentId: string) => void;
}

export const TaskFilesTab: React.FC<TaskFilesTabProps> = ({
    taskId,
    attachments,
    onAddAttachment,
    onDeleteAttachment,
}) => {
    const [filterType, setFilterType] = useState<'all' | 'doc' | 'image' | 'link'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkName, setLinkName] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter attachments
    const filteredAttachments = attachments.filter((att) => {
        const matchesSearch = att.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (filterType === 'all') return true;
        if (filterType === 'link') return att.type === 'link';
        if (filterType === 'image') return att.type === 'image';
        if (filterType === 'doc') return att.type === 'doc' || att.type === 'pdf' || att.type === 'file';
        return true;
    });