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