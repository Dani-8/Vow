import React, { useState } from 'react';
import {
    Network,
    CheckSquare,
    GitFork,
    AlertTriangle,
    Search,
    Filter,
    Plus,
    LayoutGrid,
    List,
    MoreVertical,
    Briefcase,
    Target,
    BookOpen,
    GraduationCap,
    Lightbulb,
    Clock,
    Sparkles,
} from 'lucide-react';
import { TaskMap } from '../types';

interface SavedMapsViewProps {
    maps: TaskMap[];
    onOpenMap: (mapId: string) => void;
    onCreateMap: () => void;
    onDeleteMap?: (mapId: string) => void;
}

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; iconBg: string }> = {
    purple: {
        border: 'border-l-purple-500',
        bg: 'bg-purple-500/10',
        text: 'text-purple-600',
        iconBg: 'bg-purple-100 text-purple-600',
    },
    emerald: {
        border: 'border-l-emerald-500',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600',
        iconBg: 'bg-emerald-100 text-emerald-600',
    },
    amber: {
        border: 'border-l-amber-500',
        bg: 'bg-amber-500/10',
        text: 'text-amber-600',
        iconBg: 'bg-amber-100 text-amber-600',
    },
    rose: {
        border: 'border-l-rose-500',
        bg: 'bg-rose-500/10',
        text: 'text-rose-600',
        iconBg: 'bg-rose-100 text-rose-600',
    },
    sky: {
        border: 'border-l-[#549acb]',
        bg: 'bg-[#549acb]/10',
        text: 'text-[#549acb]',
        iconBg: 'bg-sky-100 text-[#549acb]',
    },
    indigo: {
        border: 'border-l-indigo-500',
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-600',
        iconBg: 'bg-indigo-100 text-indigo-600',
    },
};

const getMapIcon = (index: number) => {
    switch (index % 4) {
        case 0:
            return <Network className="w-6 h-6 text-purple-600" />;
        case 1:
            return <Target className="w-6 h-6 text-emerald-600" />;
        case 2:
            return <BookOpen className="w-6 h-6 text-amber-600" />;
        default:
            return <GraduationCap className="w-6 h-6 text-rose-600" />;
    }
};

export const SavedMapsView: React.FC<SavedMapsViewProps> = ({
    maps,
    onOpenMap,
    onCreateMap,
    onDeleteMap,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'updated' | 'tasks' | 'name'>('updated');

    const totalMaps = maps.length;
    const totalTasks = maps.reduce((acc, m) => acc + m.nodes.length, 0);
    const totalConnections = maps.reduce((acc, m) => acc + m.connections.length, 0);
    const totalCriticalPaths = maps.reduce(
        (acc, m) => acc + m.connections.filter((c) => c.isCritical).length,
        0
    );

    const filteredMaps = maps.filter((m) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="neu-card p-4 flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-purple-600 bg-purple-50/50 shrink-0">
                        <Network className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold text-[#717699] uppercase block">
                            Total Maps
                        </span>
                        <span className="text-xl font-black text-purple-600">{totalMaps}</span>
                    </div>
                </div>

                <div className="neu-card p-4 flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-[#549acb] bg-sky-50/50 shrink-0">
                        <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold text-[#717699] uppercase block">
                            Total Tasks
                        </span>
                        <span className="text-xl font-black text-[#1a1c35]">{totalTasks}</span>
                    </div>
                </div>

                <div className="neu-card p-4 flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-emerald-600 bg-emerald-50/50 shrink-0">
                        <GitFork className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold text-[#717699] uppercase block">
                            Total Connections
                        </span>
                        <span className="text-xl font-black text-emerald-600">{totalConnections}</span>
                    </div>
                </div>

                <div className="neu-card p-4 flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-rose-600 bg-rose-50/50 shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold text-[#717699] uppercase block">
                            Critical Paths
                        </span>
                        <span className="text-xl font-black text-rose-600">{totalCriticalPaths}</span>
                    </div>
                </div>
            </div>

            {/* Controls Header Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-[#717699] absolute left-3.5 top-3" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search maps..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl neu-input text-xs font-medium"
                    />
                </div>

                {/* Filters & View Toggles */}
                <div className="flex items-center space-x-2 shrink-0">
                    <div className="neu-inset px-3 py-1.5 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#717699]">
                        <span className="text-[11px] text-[#717699]">Sort by</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-transparent text-[#1a1c35] font-bold focus:outline-none cursor-pointer"
                        >
                            <option value="updated">Last Updated</option>
                            <option value="tasks">Most Tasks</option>
                            <option value="name">Map Name</option>
                        </select>
                    </div>

                    <div className="flex neu-inset p-1 rounded-2xl space-x-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-xl transition-all ${viewMode === 'grid' ? 'neu-button text-[#549acb]' : 'text-[#717699]'
                                }`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-xl transition-all ${viewMode === 'list' ? 'neu-button text-[#549acb]' : 'text-[#717699]'
                                }`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={onCreateMap}
                        className="neu-button-primary px-4 py-2.5 rounded-2xl font-extrabold text-xs text-white shadow-md flex items-center space-x-2 hover:scale-105 transition-transform"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Map</span>
                    </button>
                </div>
            </div>

            {/* Map Cards Grid / List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredMaps.map((map, idx) => {
                        const theme = COLOR_MAP[map.color] || COLOR_MAP.purple;
                        const criticalCount = map.connections.filter((c) => c.isCritical).length;

                        return (
                            <div
                                key={map.id}
                                onClick={() => onOpenMap(map.id)}
                                className={`neu-card p-6 rounded-3xl border-l-4 ${theme.border} cursor-pointer hover:scale-[1.01] transition-all space-y-4 group relative overflow-hidden`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 rounded-2xl neu-inset p-2.5 flex items-center justify-center bg-[#E0E5EC] shrink-0 group-hover:scale-105 transition-transform">
                                            {getMapIcon(idx)}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${theme.bg}`} />
                                                <h3 className="text-base font-black text-[#1a1c35] group-hover:text-[#549acb] transition-colors">
                                                    {map.name}
                                                </h3>
                                                {map.isPrimary && (
                                                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-[#717699] line-clamp-2 font-medium">
                                                {map.description}
                                            </p>
                                        </div>
                                    </div>

                                    {onDeleteMap && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Delete map "${map.name}"?`)) onDeleteMap(map.id);
                                            }}
                                            className="p-1.5 rounded-xl neu-button text-[#717699] hover:text-rose-600 opacity-60 hover:opacity-100"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-white/60 grid grid-cols-4 gap-2 text-center text-xs">
                                    <div className="neu-inset p-2 rounded-xl">
                                        <span className="text-[10px] text-[#717699] font-bold block flex items-center justify-center space-x-1">
                                            <Briefcase className="w-3 h-3 text-[#549acb]" />
                                            <span>Tasks</span>
                                        </span>
                                        <span className="text-xs font-extrabold text-[#1a1c35]">
                                            {map.nodes.length}
                                        </span>
                                    </div>

                                    <div className="neu-inset p-2 rounded-xl">
                                        <span className="text-[10px] text-[#717699] font-bold block flex items-center justify-center space-x-1">
                                            <GitFork className="w-3 h-3 text-emerald-600" />
                                            <span>Connections</span>
                                        </span>
                                        <span className="text-xs font-extrabold text-emerald-600">
                                            {map.connections.length}
                                        </span>
                                    </div>

                                    <div className="neu-inset p-2 rounded-xl">
                                        <span className="text-[10px] text-[#717699] font-bold block flex items-center justify-center space-x-1">
                                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                                            <span>Critical</span>
                                        </span>
                                        <span className="text-xs font-extrabold text-rose-600">
                                            {criticalCount}
                                        </span>
                                    </div>

                                    <div className="neu-inset p-2 rounded-xl">
                                        <span className="text-[10px] text-[#717699] font-bold block flex items-center justify-center space-x-1">
                                            <Clock className="w-3 h-3 text-[#717699]" />
                                            <span>Updated</span>
                                        </span>
                                        <span className="text-[11px] font-bold text-[#1a1c35]">
                                            {map.updatedAt}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredMaps.map((map, idx) => {
                        const theme = COLOR_MAP[map.color] || COLOR_MAP.purple;
                        return (
                            <div
                                key={map.id}
                                onClick={() => onOpenMap(map.id)}
                                className={`neu-card p-4 rounded-2xl border-l-4 ${theme.border} cursor-pointer hover:scale-[1.005] transition-all flex items-center justify-between gap-4`}
                            >
                                <div className="flex items-center space-x-3 min-w-0">
                                    <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center shrink-0">
                                        {getMapIcon(idx)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-black text-[#1a1c35] truncate">{map.name}</h4>
                                        <p className="text-xs text-[#717699] truncate font-medium">{map.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6 text-xs font-extrabold shrink-0">
                                    <span className="text-[#1a1c35]">{map.nodes.length} tasks</span>
                                    <span className="text-emerald-600">{map.connections.length} connections</span>
                                    <span className="text-[#717699] text-[11px]">{map.updatedAt}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Tip Pill */}
            <div className="w-full flex justify-center pt-2">
                <div className="neu-inset px-6 py-3 rounded-full text-xs font-bold text-[#549acb] flex items-center space-x-2 border border-sky-200/50 bg-sky-50/40">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Click on any map to open it and start visualizing your tasks and connections.</span>
                </div>
            </div>
        </div>
    );
};
