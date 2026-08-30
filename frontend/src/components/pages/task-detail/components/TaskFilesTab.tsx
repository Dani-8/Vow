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
import { TaskAttachment } from '../../../../types';

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
