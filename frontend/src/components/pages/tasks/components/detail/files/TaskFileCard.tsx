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

                <div className="flex items-center space-x-1">
                    {attachment.url && attachment.url !== '#' && (
                        <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg neu-button text-slate-500 hover:text-indigo-600"
                            title="Open resource"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}
                    <button
                        onClick={() => onDeleteAttachment(attachment.id)}
                        className="p-1.5 rounded-lg neu-button text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete attachment"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Image Preview if applicable */}
            {attachment.type === 'image' && attachment.previewUrl && (
                <div className="h-28 w-full rounded-xl overflow-hidden neu-inset bg-slate-900/10">
                    <img
                        src={attachment.previewUrl}
                        alt={attachment.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Meta */}
            <div>
                <h4 className="text-xs font-bold text-[#1a1c35] line-clamp-1" title={attachment.name}>
                    {attachment.name}
                </h4>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-medium">
                    <span>{attachment.size || 'Web link'}</span>
                    <span>
                        {new Date(attachment.uploadedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};
