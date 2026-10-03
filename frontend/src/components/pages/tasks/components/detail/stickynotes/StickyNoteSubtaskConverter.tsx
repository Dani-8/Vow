import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SubTask } from '../../../../../../types';

interface StickyNoteSubtaskConverterProps {
    detectedTasks: string[];
    selectedToImport: string[];
    onToggleSelect: (item: string) => void;
    onBackToNote: () => void;
    onImport: () => void;
}

export const StickyNoteSubtaskConverter: React.FC<StickyNoteSubtaskConverterProps> = ({
    detectedTasks,
    selectedToImport,
    onToggleSelect,
    onBackToNote,
    onImport,
}) => {
    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-black uppercase text-indigo-900">
                        Detected Checklist Items ({detectedTasks.length})
                    </h4>
                </div>
                <button
                    type="button"
                    onClick={onBackToNote}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                    Back to Note
                </button>
            </div>

            <p className="text-xs text-slate-700 font-medium">
                Select items from this note to automatically create active Subtasks on your task timeline:
            </p>
