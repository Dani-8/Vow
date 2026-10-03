import React from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadZoneProps {
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onBrowseClick: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onBrowseClick,
    fileInputRef,
    onFileInputChange,
}) => {
    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={onBrowseClick}
            className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2.5 ${isDragging
                ? 'border-[#549acb] bg-indigo-50/50 scale-[1.01]'
                : 'border-[#c8d0e0] hover:border-[#549acb] bg-[#E0E5EC] neu-inset'
                }`}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={onFileInputChange}
            />
            <div className="p-3 rounded-2xl neu-button !text-[#549acb]">
                <UploadCloud className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs sm:text-sm font-bold text-[#1a1c35]">
                    Drop files here, or <span className="text-[#549acb] underline">browse device</span>
                </p>
                <p className="text-[11px] text-slate-400">
                    Supports PDFs, Images, Word Docs, Sheets &amp; Diagrams
                </p>
            </div>
        </div>
    );
};
