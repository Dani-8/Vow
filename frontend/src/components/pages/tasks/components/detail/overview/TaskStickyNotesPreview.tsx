import React from 'react';
import { StickyNote, ArrowUpRight, Pin } from 'lucide-react';
import { TaskStickyNote } from '../../../../../../types';
import { TaskTabType } from '../components/TaskDetailTabs';

interface TaskStickyNotesPreviewProps {
    stickyNotes: TaskStickyNote[];
    onTabChange: (tab: TaskTabType) => void;
}

export const TaskStickyNotesPreview: React.FC<TaskStickyNotesPreviewProps> = ({
    stickyNotes,
    onTabChange,
}) => {
    return (
        <div className="neu-card p-6 bg-[#E0E5EC] space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl neu-button text-amber-600">
                        <StickyNote className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[#1a1c35]">Sticky Notes &amp; Guidelines</h3>
                        <span className="text-[11px] font-medium text-[#717699]">{stickyNotes.length} pinned paper notes</span>
                    </div>
                </div>

                <button
                    onClick={() => onTabChange('notes')}
                    className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center space-x-1"
                >
                    <span>Open Sticky Board</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
            </div>

            {stickyNotes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {stickyNotes.slice(0, 4).map((note) => {
                        const bgMap: Record<string, string> = {
                            yellow: 'bg-amber-100/90 border-amber-300 text-amber-950',
                            green: 'bg-emerald-100/90 border-emerald-300 text-emerald-950',
                            blue: 'bg-sky-100/90 border-sky-300 text-sky-950',
                            purple: 'bg-purple-100/90 border-purple-300 text-purple-950',
                            rose: 'bg-rose-100/90 border-rose-300 text-rose-950',
                            gray: 'bg-slate-100/90 border-slate-300 text-slate-900',
                        };
                        const style = bgMap[note.color || 'yellow'] || bgMap.yellow;

                        return (
                            <div
                                key={note.id}
                                onClick={() => onTabChange('notes')}
                                className={`p-4 rounded-xl border shadow-xs hover:shadow-md cursor-pointer transition-all ${style} space-y-2`}
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black truncate">{note.title || 'Sticky Note'}</h4>
                                    {note.isPinned && <Pin className="w-3 h-3 fill-current opacity-70" />}
                                </div>
                                <p className="text-[11px] leading-relaxed line-clamp-3 font-medium opacity-90">
                                    {note.content}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div
                    onClick={() => onTabChange('notes')}
                    className="p-5 rounded-xl border border-dashed border-[#c8d0e0] text-center cursor-pointer hover:bg-slate-200/30 transition-all space-y-1"
                >
                    <p className="text-xs font-bold text-[#4a4e69]">No sticky notes pinned yet.</p>
                    <p className="text-[11px] text-slate-400">Click to pin multi-colored cards for research, checklists, and rules.</p>
                </div>
            )}
        </div>
    );
};
