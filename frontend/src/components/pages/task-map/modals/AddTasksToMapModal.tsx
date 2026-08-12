import React, { useState } from 'react';
import { X, Check, Search, ChevronDown, ChevronRight, Briefcase, Plus } from 'lucide-react';
import { Task } from '../../../../types';

interface AddTasksToMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: Task[];
    existingNodeTaskIds: Set<string>;
    onImportTasks: (selectedItems: { taskId: string; subTaskId?: string }[]) => void;
}

export const AddTasksToMapModal: React.FC<AddTasksToMapModalProps> = ({
    isOpen,
    onClose,
    tasks,
    existingNodeTaskIds,
    onImportTasks,
}) => {
    const [search, setSearch] = useState('');
    const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
    const [selectedTaskMap, setSelectedTaskMap] = useState<Record<string, boolean>>({});

    if (!isOpen) return null;

    const toggleExpand = (taskId: string) => {
        setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const toggleSelect = (key: string) => {
        setSelectedTaskMap((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleImport = () => {
        const itemsToImport: { taskId: string; subTaskId?: string }[] = [];

        Object.entries(selectedTaskMap).forEach(([key, isSelected]) => {
            if (!isSelected) return;
            if (key.includes('::')) {
                const [taskId, subTaskId] = key.split('::');
                itemsToImport.push({ taskId, subTaskId });
            } else {
                itemsToImport.push({ taskId: key });
            }
        });

        if (itemsToImport.length > 0) {
            onImportTasks(itemsToImport);
        }
        onClose();
    };

    const filteredTasks = tasks.filter((t) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            t.title.toLowerCase().includes(q) ||
            t.subTasks?.some((s) => s.title.toLowerCase().includes(q))
        );
    });

    const selectedCount = Object.values(selectedTaskMap).filter(Boolean).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl neu-card p-6 rounded-3xl bg-[#E0E5EC] border border-white shadow-2xl space-y-5 relative max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/60 shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#1a1c35]">Add Tasks & Sub-Tasks to Map</h3>
                            <p className="text-xs text-[#717699] font-medium">
                                Import existing goals to visualize relationships
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl neu-button text-[#717699] hover:text-rose-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative shrink-0">
                    <Search className="w-4 h-4 text-[#717699] absolute left-3.5 top-3" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search main tasks & sub-tasks..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-input text-xs font-medium"
                    />
                </div>

                {/* Task Selection List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[250px]">
                    {filteredTasks.length === 0 ? (
                        <p className="text-xs text-[#717699] text-center py-10 italic">
                            No matching tasks found.
                        </p>
                    ) : (
                        filteredTasks.map((task) => {
                            const isMainSelected = !!selectedTaskMap[task._id];
                            const isAlreadyInMap = existingNodeTaskIds.has(task._id);
                            const hasSubtasks = task.subTasks && task.subTasks.length > 0;
                            const isExpanded = !!expandedTasks[task._id];

                            return (
                                <div
                                    key={task._id}
                                    className="neu-inset p-3.5 rounded-2xl bg-[#E0E5EC] space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <button
                                                onClick={() => toggleSelect(task._id)}
                                                className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${isMainSelected
                                                    ? 'bg-[#549acb] border-[#549acb] text-white'
                                                    : 'border-[#717699]/40 hover:border-[#549acb]'
                                                    }`}
                                            >
                                                {isMainSelected && <Check className="w-3.5 h-3.5" />}
                                            </button>

                                            <div className="min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs font-bold text-[#1a1c35] truncate">
                                                        {task.title}
                                                    </span>
                                                    {isAlreadyInMap && (
                                                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-sky-100 text-[#549acb]">
                                                            In Map
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-[#717699] font-medium">
                                                    Status: {task.status.replace('_', ' ')} • {task.subTasks?.length || 0} subtasks
                                                </p>
                                            </div>
                                        </div>

                                        {hasSubtasks && (
                                            <button
                                                onClick={() => toggleExpand(task._id)}
                                                className="p-1.5 rounded-xl neu-button text-[#717699] flex items-center space-x-1 text-[11px] font-bold"
                                            >
                                                <span>Subtasks</span>
                                                {isExpanded ? (
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                ) : (
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Subtasks revealed */}
                                    {hasSubtasks && isExpanded && (
                                        <div className="pl-8 pt-2 space-y-2 border-t border-white/40">
                                            {task.subTasks!.map((sub) => {
                                                const subKey = `${task._id}::${sub.id}`;
                                                const isSubSelected = !!selectedTaskMap[subKey];

                                                return (
                                                    <div
                                                        key={sub.id}
                                                        className="flex items-center space-x-3 text-xs font-medium text-[#44476A]"
                                                    >
                                                        <button
                                                            onClick={() => toggleSelect(subKey)}
                                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${isSubSelected
                                                                ? 'bg-purple-600 border-purple-600 text-white'
                                                                : 'border-[#717699]/40 hover:border-purple-600'
                                                                }`}
                                                        >
                                                            {isSubSelected && <Check className="w-3 h-3" />}
                                                        </button>
                                                        <span className="truncate">{sub.title}</span>
                                                        <span className="text-[9px] text-[#717699] font-bold">
                                                            ({sub.status})
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-white/60 flex items-center justify-between shrink-0">
                    <span className="text-xs font-extrabold text-[#717699]">
                        {selectedCount} item(s) selected
                    </span>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-2xl neu-button text-xs font-bold text-[#717699]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={selectedCount === 0}
                            className={`px-6 py-2.5 rounded-2xl font-extrabold text-xs text-white shadow-lg flex items-center space-x-2 ${selectedCount > 0
                                ? 'neu-button-primary'
                                : 'bg-gray-400 cursor-not-allowed opacity-60'
                                }`}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Import to Map</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
