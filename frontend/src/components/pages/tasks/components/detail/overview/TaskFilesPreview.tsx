import React from 'react';
import { Paperclip, ArrowUpRight, ExternalLink } from 'lucide-react';
import { TaskAttachment } from '../../../../../../types';
import { TaskTabType } from '../components/TaskDetailTabs';

interface TaskFilesPreviewProps {
    attachments: TaskAttachment[];
    onTabChange: (tab: TaskTabType) => void;
}

export const TaskFilesPreview: React.FC<TaskFilesPreviewProps> = ({
    attachments,
    onTabChange,
}) => {
    return (
        <div className="neu-card p-6 bg-[#E0E5EC] space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl neu-button text-indigo-600">
                        <Paperclip className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[#1a1c35]">Resources &amp; Attachments</h3>
                        <span className="text-[11px] font-medium text-[#717699]">{attachments.length} attached items</span>
                    </div>
                </div>

                <button
                    onClick={() => onTabChange('files')}
                    className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                    <span>Vault &amp; Links</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
            </div>

            {attachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachments.slice(0, 4).map((att) => (
                        <div
                            key={att.id}
                            className="p-3 rounded-xl neu-flat bg-[#E0E5EC] flex items-center justify-between hover:scale-[1.01] transition-transform"
                        >
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                                <span className="p-2 rounded-lg neu-inset text-xs font-black uppercase text-indigo-600">
                                    {att.type === 'link' ? '🔗' : att.type === 'pdf' ? '📄' : '📁'}
                                </span>
                                <div className="truncate">
                                    <p className="text-xs font-bold text-[#1a1c35] truncate">{att.name}</p>
                                    <span className="text-[10px] text-slate-400">{att.size || 'Resource link'}</span>
                                </div>
                            </div>

                            {att.url && att.url !== '#' && (
                                <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg neu-button text-slate-500 hover:text-indigo-600 shrink-0 ml-2"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    onClick={() => onTabChange('files')}
                    className="p-5 rounded-xl border border-dashed border-[#c8d0e0] text-center cursor-pointer hover:bg-slate-200/30 transition-all space-y-1"
                >
                    <p className="text-xs font-bold text-[#4a4e69]">No files or links attached yet.</p>
                    <p className="text-[11px] text-slate-400">Click to upload documents, screenshots, or Figma/GitHub bookmarks.</p>
                </div>
            )}
        </div>
    );
};
