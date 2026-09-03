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

    // Handle local file uploads
    const handleFileUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        Array.from(files).forEach((file) => {
            let type: TaskAttachment['type'] = 'file';
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.includes('pdf')) type = 'pdf';
            else if (file.type.includes('word') || file.type.includes('document')) type = 'doc';

            // Format size
            let sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
            if (file.size > 1024 * 1024) {
                sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
            }

            // Create object URL for client preview
            const previewUrl = URL.createObjectURL(file);

            onAddAttachment({
                name: file.name,
                type,
                size: sizeStr,
                url: previewUrl,
                previewUrl: type === 'image' ? previewUrl : undefined,
            });
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const handleAddLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!linkUrl.trim()) return;

        let cleanUrl = linkUrl.trim();
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = `https://${cleanUrl}`;
        }

        const title = linkName.trim() || new URL(cleanUrl).hostname;

        onAddAttachment({
            name: title,
            type: 'link',
            url: cleanUrl,
            size: 'Web Bookmark',
        });

        setLinkUrl('');
        setLinkName('');
        setIsLinkModalOpen(false);
    };