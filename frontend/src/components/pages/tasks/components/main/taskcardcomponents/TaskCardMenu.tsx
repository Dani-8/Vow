import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, MoreVertical, Lock, Unlock, Edit3, Trash2, Timer } from 'lucide-react';
import { Task } from '../../../../../../types';
import { StartFocusSessionModal } from '../../../../../modals/StartFocusSessionModal';
import { useFocusTimer } from '../../../../../../context/FocusTimerContext';

interface TaskCardMenuProps {
    task: Task;
    isStruggling: boolean;
    onOpenAIAssist: (task: Task) => void;
    onTogglePrivate: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}

export const TaskCardMenu: React.FC<TaskCardMenuProps> = ({
    task,
    isStruggling,
    onOpenAIAssist,
    onTogglePrivate,
    onEditTask,
    onDeleteTask,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isFocusModalOpen, setIsFocusModalOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { startSession, activeSession } = useFocusTimer();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const isThisTaskActive = activeSession?.sourceType === 'task' && activeSession.sourceId === task._id;

    return (
        <div className="flex items-center space-x-1.5 shrink-0">
            {/* Quick Timer Launcher Button */}
            {!task.status || task.status !== 'completed' ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFocusModalOpen(true);
                    }}
                    className={`px-2 py-1.5 rounded-xl neu-button flex items-center space-x-1 text-xs font-bold transition-all ${isThisTaskActive
                        ? 'text-emerald-600 bg-emerald-50/80 border border-emerald-300'
                        : 'text-[#549acb] hover:bg-white/40'
                        }`}
                    title={isThisTaskActive ? 'Focus session actively running' : 'Start Focus Timer'}
                >
                    <Timer className={`w-3.5 h-3.5 ${isThisTaskActive ? 'text-emerald-500 animate-spin-slow' : 'text-[#549acb]'}`} />
                    <span className="hidden sm:inline">{isThisTaskActive ? 'Focusing' : 'Focus'}</span>
                </button>
            ) : null}

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenAIAssist(task);
                }}
                className={`px-2.5 py-1.5 rounded-xl neu-button flex items-center space-x-1.5 text-xs font-bold transition-all ${isStruggling
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse border-none shadow-md'
                    : 'text-[#549acb] hover:bg-white/40'
                    }`}
                title="Ask Vow AI coach for micro-step breakdown or rescheduling"
            >
                <Sparkles className={`w-3.5 h-3.5 ${isStruggling ? 'text-white' : 'text-[#549acb]'}`} />
                <span className="hidden sm:inline">AI Help</span>
            </button>

            <div className="relative" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    className="p-1.5 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35] transition-colors"
                    title="More options"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                {isMenuOpen && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-[#E0E5EC] border border-white/60 shadow-xl p-1.5 z-20 animate-in fade-in zoom-in-95 duration-150"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(false);
                                setIsFocusModalOpen(true);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#1a1c35] hover:bg-white/50 flex items-center space-x-2 transition-colors"
                        >
                            <Timer className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Start Focus Session</span>
                        </button>

                        <div className="my-1 border-t border-gray-300/40" />

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(false);
                                onTogglePrivate(task);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#1a1c35] hover:bg-white/50 flex items-center space-x-2 transition-colors"
                        >
                            {task.isPrivate ? (
                                <>
                                    <Unlock className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Make Public</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Move to Growth Vault</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                onEditTask(task);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#1a1c35] hover:bg-white/50 flex items-center space-x-2 transition-colors"
                        >
                            <Edit3 className="w-3.5 h-3.5 text-[#549acb]" />
                            <span>Edit Task</span>
                        </button>

                        <div className="my-1 border-t border-gray-300/40" />

                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                onDeleteTask(task);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/60 flex items-center space-x-2 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Delete Task</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Focus Session Config Modal */}
            <StartFocusSessionModal
                isOpen={isFocusModalOpen}
                onClose={() => setIsFocusModalOpen(false)}
                title={task.title}
                subtitle={task.priority ? `Priority: ${task.priority}` : undefined}
                onStart={(minutes) => {
                    startSession({
                        sourceType: 'task',
                        sourceId: task._id,
                        sourceTitle: task.title,
                        sourceSubtitle: task.priority ? `${task.priority} Priority Task` : undefined,
                        minutes,
                    });
                }}
            />
        </div>
    );
};