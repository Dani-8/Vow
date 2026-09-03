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
        <div className="space-y-6 animate-fadeIn max-w-5xl">
            {/* Upload Zone & Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Drag & Drop Card */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`md:col-span-2 p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2.5 ${isDragging
                        ? 'border-[#549acb] bg-indigo-50/50 scale-[1.01]'
                        : 'border-[#c8d0e0] hover:border-[#549acb] bg-[#E0E5EC] neu-inset'
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <div className="p-3 rounded-2xl neu-button !text-[#549acb]">
                        <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-bold text-[#1a1c35]">
                            Drop files here, or <span className="text-[#549acb] underline">browse device</span>
                        </p>
                        <p className="text-[11px] text-slate-400">Supports PDFs, Images, Word Docs, Sheets &amp; Diagrams</p>
                    </div>
                </div>

                {/* Add Link / Bookmark Card */}
                <div
                    onClick={() => setIsLinkModalOpen(true)}
                    className="p-6 rounded-2xl neu-card bg-[#E0E5EC] hover:scale-[1.01] transition-transform cursor-pointer flex flex-col items-center justify-center text-center space-y-2.5"
                >
                    <div className="p-3 rounded-2xl neu-button text-sky-600">
                        <Link2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-bold text-[#1a1c35]">
                            Bookmark Reference URL
                        </p>
                        <p className="text-[11px] text-slate-400">Save Figma specs, GitHub PRs, Google Docs &amp; articles</p>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="neu-card p-4 bg-[#E0E5EC] flex flex-wrap items-center justify-between gap-3">
                {/* Search */}
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl neu-inset bg-[#dbe2ee]/60 max-w-xs w-full">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search attachments..."
                        className="bg-transparent border-none text-xs focus:outline-none w-full text-[#1a1c35]"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center space-x-1.5">
                    {(
                        [
                            { id: 'all', label: 'All' },
                            { id: 'doc', label: 'Documents' },
                            { id: 'image', label: 'Images' },
                            { id: 'link', label: 'Links' },
                        ] as const
                    ).map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setFilterType(t.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterType === t.id
                                ? 'neu-inset text-[#549acb] font-black'
                                : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Files Grid */}
            {filteredAttachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAttachments.map((att) => (
                        <div
                            key={att.id}
                            className="neu-card p-4 bg-[#E0E5EC] space-y-3 hover:scale-[1.01] transition-transform relative group"
                        >
                            {/* Top Row */}
                            <div className="flex items-start justify-between">
                                <div className="p-2.5 rounded-xl neu-inset bg-[#dbe2ee]/70 shrink-0">
                                    {getAttachmentIcon(att)}
                                </div>

                                <div className="flex items-center space-x-1">
                                    {att.url && att.url !== '#' && (
                                        <a
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg neu-button text-slate-500 hover:text-indigo-600"
                                            title="Open resource"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => onDeleteAttachment(att.id)}
                                        className="p-1.5 rounded-lg neu-button text-slate-400 hover:text-rose-600 transition-colors"
                                        title="Delete attachment"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Image Preview if applicable */}
                            {att.type === 'image' && att.previewUrl && (
                                <div className="h-28 w-full rounded-xl overflow-hidden neu-inset bg-slate-900/10">
                                    <img
                                        src={att.previewUrl}
                                        alt={att.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}