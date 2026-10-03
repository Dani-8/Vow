import React from 'react';
import {
    Paperclip,
    FileText,
    Image as ImageIcon,
    Globe,
    ExternalLink,
    Trash2,
} from 'lucide-react';
import { TaskAttachment } from '../../../../../../types';

interface TaskFileCardProps {
    attachment: TaskAttachment;
    onDeleteAttachment: (id: string) => void;
}

export const TaskFileCard: React.FC<TaskFileCardProps> = ({
    attachment,
    onDeleteAttachment,
}) => {
    const getAttachmentIcon = (att: TaskAttachment) => {
        switch (att.type) {
            case 'link':
                return <Globe className="w-5 h-5 text-sky-600" />;
            case 'image':
                return <ImageIcon className="w-5 h-5 text-violet-600" />;
            case 'pdf':
            case 'doc':
                return <FileText className="w-5 h-5 text-rose-600" />;
            default:
                return <Paperclip className="w-5 h-5 text-slate-600" />;
        }
    };

    return (
        <div className="neu-card p-4 bg-[#E0E5EC] space-y-3 hover:scale-[1.01] transition-transform relative group">
            {/* Top Row */}
            <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl neu-inset bg-[#dbe2ee]/70 shrink-0">
                    {getAttachmentIcon(attachment)}
                </div>
