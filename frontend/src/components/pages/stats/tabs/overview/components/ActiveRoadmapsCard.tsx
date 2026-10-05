import React from 'react';
import { Compass, ChevronRight, Layers, CheckCircle2 } from 'lucide-react';
import { TaskMap } from '../../../../task-map/types';
import { getMapSlug } from '../../../../task-map/TaskMapPage';

interface ActiveRoadmapsCardProps {
    taskMaps: TaskMap[];
    onNavigateToView?: (
        view: 'home' | 'landing' | 'visible' | 'private' | 'stats' | 'auth' | 'task-map' | 'challenges' | 'challenge-detail',
        param?: string
    ) => void;
}

export const ActiveRoadmapsCard: React.FC<ActiveRoadmapsCardProps> = ({
    taskMaps,
    onNavigateToView,
}) => {
    const primaryMaps = taskMaps.slice(0, 3);

    return (
        <div className="neu-card p-6 rounded-3xl space-y-4 border border-white/60 flex flex-col justify-between">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                            <Compass className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-[#1a1c35]">Visual Roadmaps & Blueprints</h3>
                            <p className="text-xs text-[#717699] font-medium">Strategic multi-stage architectures</p>
                        </div>
                    </div>

                    {onNavigateToView && (
                        <button
                            onClick={() => onNavigateToView('task-map')}
                            className="text-xs font-bold text-[#549acb] hover:text-[#44476A] flex items-center space-x-1"
                        >
                            <span>Map Hub</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {primaryMaps.length === 0 ? (
                    <div className="neu-inset p-6 rounded-2xl text-center space-y-3 border border-dashed border-slate-300">
                        <div className="w-12 h-12 mx-auto rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
                            <Compass className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-[#1a1c35]">No Roadmaps Initialized</h4>
                            <p className="text-[11px] font-medium text-[#717699] max-w-xs mx-auto">
                                Transform multi-step goals into interactive visual blueprints in the Task Map module.
                            </p>
                        </div>
                        {onNavigateToView && (
                            <button
                                onClick={() => onNavigateToView('task-map')}
                                className="px-4 py-2 rounded-2xl neu-button text-xs font-black text-[#549acb] bg-[#E0E5EC] hover:scale-105 transition-all shadow-sm"
                            >
                                Open Task Maps
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {primaryMaps.map((map) => {
                            const totalNodes = (map.nodes || []).length;
                            const completedNodes = (map.nodes || []).filter((n) => n.status === 'completed').length;
                            const percent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
                            const mapSlug = getMapSlug(map);

                            return (
                                <div
                                    key={map._id || map.id}
                                    onClick={() => onNavigateToView?.('task-map', mapSlug)}
                                    className="neu-inset p-4 rounded-2xl flex flex-col space-y-2.5 cursor-pointer hover:border-[#549acb]/40 border border-transparent transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <div className="w-9 h-9 rounded-xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC] shrink-0 group-hover:scale-105 transition-transform">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-xs font-black text-[#1a1c35] group-hover:text-[#549acb] transition-colors truncate">
                                                    {map.title}
                                                </h4>
                                                <div className="flex items-center space-x-1.5 text-[10px] font-bold text-[#717699]">
                                                    <span>{map.category || 'Roadmap'}</span>
                                                    <span>•</span>
                                                    <span className="text-[#549acb]">
                                                        {completedNodes}/{totalNodes} Milestones
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="px-2 py-0.5 rounded-full neu-inset text-[10px] font-extrabold text-[#44476A] shrink-0">
                                            {percent}%
                                        </span>
                                    </div>

