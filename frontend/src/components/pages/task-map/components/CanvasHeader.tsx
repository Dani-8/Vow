import React from 'react';
import {
    ArrowLeft,
    Search,
    Plus,
    ChevronDown,
    AlertTriangle,
    GitFork,
    Briefcase,
} from 'lucide-react';
import { TaskMap } from '../types';

interface CanvasHeaderProps {
    currentMap: TaskMap;
    maps: TaskMap[];
    onSelectMap: (mapId: string) => void;
    onBackToMaps: () => void;
    onOpenAddTasksModal: () => void;
    onCreateNewMap?: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
    currentMap,
    maps,
    onSelectMap,
    onBackToMaps,
    onOpenAddTasksModal,
    searchQuery,
    onSearchChange,
}) => {
    const taskCount = currentMap.nodes.length;
    const connectionCount = currentMap.connections.length;
    const criticalCount = currentMap.connections.filter((c) => c.isCritical).length;

    return (
        <div className="w-full flex flex-col gap-3 pb-4 border-b border-white/60">
            {/* Top Title & Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                    <button
                        onClick={onBackToMaps}
                        className="neu-button px-3.5 py-2 rounded-2xl text-xs font-extrabold text-[#717699] hover:text-[#1a1c35] flex items-center space-x-2 backdrop-blur-md bg-white/40 shrink-0"
                        title="Back to Task Maps Overview"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#549acb]" />
                        <span>Back to Maps</span>
                    </button>

                    <div className="h-6 w-[1px] bg-slate-300/80 shrink-0" />

                    <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-lg sm:text-xl font-black text-[#1a1c35] truncate">
                                {currentMap.name}
                            </h1>
                            <span className="hidden sm:inline-flex text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase neu-badge text-[#549acb]">
                                {currentMap.color}
                            </span>
                        </div>
                        {currentMap.description && (
                            <p className="text-xs text-[#717699] font-medium truncate max-w-md sm:max-w-xl">
                                {currentMap.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Map Switcher & Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                    <div className="relative">
                        <select
                            value={currentMap.id}
                            onChange={(e) => onSelectMap(e.target.value)}
                            className="neu-button px-3.5 py-2 rounded-2xl text-xs font-black text-[#1a1c35] appearance-none pr-8 cursor-pointer bg-[#E0E5EC] focus:outline-none"
                        >
                            {maps.map((m) => (
                                <option key={m.id} value={m.id}>
                                    Switch Map: {m.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#717699] absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>

                    <button
                        onClick={onOpenAddTasksModal}
                        className="neu-button-primary px-3.5 py-2 rounded-2xl text-xs font-black text-white flex items-center space-x-1.5 shadow-md hover:scale-105 transition-transform"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Tasks</span>
                    </button>
                </div>
            </div>

            {/* Sub Bar: Stats, Search, Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Stats Pills */}
                <div className="flex items-center space-x-2 text-xs font-bold">
                    <span className="neu-inset px-3 py-1.5 rounded-xl text-[#717699] flex items-center space-x-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#549acb]" />
                        <span>{taskCount} Tasks</span>
                    </span>

                    <span className="neu-inset px-3 py-1.5 rounded-xl text-[#717699] flex items-center space-x-1.5">
                        <GitFork className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{connectionCount} Connections</span>
                    </span>

                    <span className="neu-inset px-3 py-1.5 rounded-xl text-rose-600 font-extrabold flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span>{criticalCount} Critical Path</span>
                    </span>
                </div>

                {/* Search & Legend */}
                <div className="flex items-center space-x-2">
                    <div className="hidden lg:flex items-center space-x-2 neu-inset px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#717699]">
                        <span className="text-[#1a1c35]">Legend:</span>
                        <span className="w-4 h-0.5 bg-[#549acb]" title="Enables / Primary" />
                        <span className="w-4 h-0.5 bg-emerald-500 border-t border-dashed border-emerald-500" title="Supports" />
                        <span className="w-4 h-0.5 bg-amber-500 border-t border-dashed border-amber-500" title="Blocks" />
                        <span className="w-4 h-0.5 bg-purple-500 border-t border-dashed border-purple-500" title="Leads To" />
                        <span className="w-4 h-0.5 bg-rose-500 border-t border-dashed border-rose-500" title="Critical Path" />
                    </div>

                    <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#717699] absolute left-3 top-2.5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search in map..."
                            className="pl-8 pr-3 py-1.5 rounded-xl neu-input text-xs font-medium w-40 sm:w-48"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
