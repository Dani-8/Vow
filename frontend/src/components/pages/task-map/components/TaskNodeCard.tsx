import React, { useState } from 'react';
import {
    CheckCircle2,
    Circle,
    Clock,
    MoreVertical,
    Trash2,
    Link2,
    Calendar,
    Check,
    ChevronRight,
    SlidersHorizontal,
} from 'lucide-react';
import { TaskNodeCardProps } from './nodeCardTypes';

export const TaskNodeCard: React.FC<TaskNodeCardProps> = ({
    node,
    task,
    subTask,
    isSelected,
    isMenuOpen: controlledIsMenuOpen,
    onToggleMenu,
    zoom = 1,
    onSelect,
    onPositionChange,
    onDeleteNode,
    onStartConnect,
    onStatusChange,
}) => {
    const [internalIsMenuOpen, setInternalIsMenuOpen] = useState(false);
    const [isStatusSubmenuOpen, setIsStatusSubmenuOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const isMenuOpen = controlledIsMenuOpen !== undefined ? controlledIsMenuOpen : internalIsMenuOpen;
    const setMenuOpen = (open: boolean) => {
        if (onToggleMenu) {
            onToggleMenu(open);
        } else {
            setInternalIsMenuOpen(open);
        }
    };

    const title = node.customTitle || subTask?.title || task?.title || 'Untitled Milestone';
    const status = node.customStatus || subTask?.status || task?.status || 'todo';

    // Exact date from task or subtask
    const exactDate = subTask?.dateLabel || subTask?.dueDate || task?.endTime || null;

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only drag if left click
        if (e.button !== 0) return;

        // Do not initiate node dragging when clicking interactive children (buttons, inputs, menus)
        const target = e.target as HTMLElement;
        if (
            target.closest('button') ||
            target.closest('a') ||
            target.closest('select') ||
            target.closest('input') ||
            target.closest('.node-action-menu')
        ) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        onSelect();
        setIsDragging(true);

        const startX = e.clientX;
        const startY = e.clientY;
        const initialNodeX = node.x;
        const initialNodeY = node.y;
        const currentZoom = zoom || 1;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = (moveEvent.clientX - startX) / currentZoom;
            const deltaY = (moveEvent.clientY - startY) / currentZoom;

            const newX = Math.max(10, Math.round(initialNodeX + deltaX));
            const newY = Math.max(10, Math.round(initialNodeY + deltaY));

            onPositionChange(node.id, newX, newY);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleSetStatus = (e: React.MouseEvent, newStatus: 'todo' | 'in_progress' | 'completed') => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);
        setIsStatusSubmenuOpen(false);
        if (onStatusChange) {
            onStatusChange(node.id, newStatus);
        }
    };

    // Status badge styling
    let statusBadge = (
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-gray-200/80 text-[#717699] flex items-center space-x-1.5 w-fit">
            <Circle className="w-3 h-3 text-[#717699] shrink-0" />
            <span>To Do</span>
        </span>
    );

    if (status === 'completed') {
        statusBadge = (
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center space-x-1.5 w-fit shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Completed</span>
            </span>
        );
    } else if (status === 'in_progress') {
        statusBadge = (
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-sky-100/90 text-sky-800 flex items-center space-x-1.5 w-fit shadow-xs">
                <Clock className="w-3 h-3 text-[#549acb] shrink-0" />
                <span>In Progress</span>
            </span>
        );
    }

    const parentTrackName = task?.title || (node.taskId ? 'Core Track' : null);

    return (
        <div
            style={{ left: `${node.x}px`, top: `${node.y}px` }}
            onMouseDown={handleMouseDown}
            className={`absolute w-64 sm:w-72 neu-card p-4 rounded-2xl cursor-grab active:cursor-grabbing transition-all select-none z-10 ${isDragging ? 'shadow-2xl z-30 opacity-90 scale-[1.02]' : ''
                } ${isSelected ? 'ring-2 ring-[#549acb] shadow-2xl scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
        >
            <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="min-w-0 flex-1">
                    {/* Milestone Title (Bold) */}
                    <h4 className="text-xs sm:text-sm font-black text-[#1a1c35] leading-snug line-clamp-2">
                        {title}
                    </h4>

                    {/* Parent Track Label */}
                    {parentTrackName && (
                        <span className="text-[10px] font-bold text-purple-600/90 block mt-1 truncate">
                            Part of: {parentTrackName}
                        </span>
                    )}
                </div>

                {/* Options Button */}
                <div
                    className="relative shrink-0 ml-1 node-action-menu"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const nextState = !isMenuOpen;
                            setMenuOpen(nextState);
                            if (!nextState) setIsStatusSubmenuOpen(false);
                        }}
                        className="p-1 rounded-lg neu-button text-[#717699] hover:text-[#1a1c35]"
                        title="Options"
                    >
                        <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {isMenuOpen && (
                        <div
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-6 w-48 neu-card p-2 rounded-xl shadow-2xl z-50 bg-[#E0E5EC] space-y-1 text-xs font-bold border border-white"
                        >
                            {/* Button 1: Add Connection */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    setIsStatusSubmenuOpen(false);
                                    onStartConnect(node.id);
                                }}
                                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#549acb]/15 text-[#549acb] flex items-center space-x-2 transition-colors cursor-pointer"
                            >
                                <Link2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Add Connection</span>
                            </button>

                            {/* Button 2: Hoverable Status Dropdown Trigger */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsStatusSubmenuOpen(true)}
                                onMouseLeave={() => setIsStatusSubmenuOpen(false)}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsStatusSubmenuOpen(!isStatusSubmenuOpen);
                                    }}
                                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-purple-100/70 text-purple-700 flex items-center justify-between transition-colors cursor-pointer"
                                >
                                    <span className="flex items-center space-x-2">
                                        <SlidersHorizontal className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                                        <span>Change Status</span>
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                </button>

                                {/* Submenu Dropdown on Hover */}
                                {isStatusSubmenuOpen && (
                                    <div
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="absolute right-0 top-0 sm:right-full sm:top-0 sm:mr-1 w-44 neu-card p-1.5 rounded-xl shadow-2xl z-50 bg-[#E0E5EC] space-y-1 text-xs font-bold border border-white animate-in fade-in duration-150"
                                    >
                                        <button
                                            type="button"
                                            onClick={(e) => handleSetStatus(e, 'completed')}
                                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer ${status === 'completed' ? 'bg-emerald-100/90 font-black' : ''
                                                }`}
                                        >
                                            <span className="flex items-center space-x-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>Completed</span>
                                            </span>
                                            {status === 'completed' && <Check className="w-3 h-3 text-emerald-700" />}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => handleSetStatus(e, 'in_progress')}
                                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer ${status === 'in_progress' ? 'bg-sky-100/90 font-black' : ''
                                                }`}
                                        >
                                            <span className="flex items-center space-x-1.5">
                                                <Clock className="w-3.5 h-3.5 text-[#549acb]" />
                                                <span>In Progress</span>
                                            </span>
                                            {status === 'in_progress' && <Check className="w-3 h-3 text-sky-700" />}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => handleSetStatus(e, 'todo')}
                                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-gray-700 hover:bg-gray-200/80 transition-colors cursor-pointer ${status === 'todo' ? 'bg-gray-200/80 font-black' : ''
                                                }`}
                                        >
                                            <span className="flex items-center space-x-1.5">
                                                <Circle className="w-3.5 h-3.5 text-[#717699]" />
                                                <span>To Do</span>
                                            </span>
                                            {status === 'todo' && <Check className="w-3 h-3 text-gray-700" />}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Button 3: Remove Node */}
                            <div className="border-t border-gray-300/60 pt-1">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setMenuOpen(false);
                                        setIsStatusSubmenuOpen(false);
                                        onDeleteNode(node.id);
                                    }}
                                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-rose-100 text-rose-600 flex items-center space-x-2 transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                    <span>Remove Node</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Clean Status Badge & Due Date Footer */}
            <div className="pt-2.5 border-t border-white/60 flex items-center justify-between gap-2">
                {statusBadge}

                {exactDate && (
                    <div
                        className="neu-inset px-2.5 py-1 rounded-xl text-[10px] font-bold text-[#717699] flex items-center space-x-1 shrink-0 bg-[#E0E5EC]"
                        title={`Due Date: ${exactDate}`}
                    >
                        <Calendar className="w-3 h-3 text-[#549acb]" />
                        <span className="truncate max-w-[90px]">{exactDate}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

