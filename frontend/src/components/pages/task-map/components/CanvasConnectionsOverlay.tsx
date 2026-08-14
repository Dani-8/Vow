import React from 'react';
import { TaskMapNode, TaskMapConnection, RelationshipType } from '../types';

interface CanvasConnectionsOverlayProps {
    nodes: TaskMapNode[];
    connections: TaskMapConnection[];
    onSelectConnection?: (connId: string) => void;
    onDeleteConnection?: (connId: string) => void;
}

const REL_STYLE: Record<
    RelationshipType,
    { stroke: string; dashArray?: string; badgeBg: string; textBg: string }
> = {
    'Depends On': {
        stroke: '#e11d48',
        dashArray: '5 5',
        badgeBg: 'bg-rose-100 border border-rose-300 text-rose-700',
        textBg: 'text-rose-700',
    },
    Supports: {
        stroke: '#10b981',
        dashArray: '5 5',
        badgeBg: 'bg-emerald-100 border border-emerald-300 text-emerald-700',
        textBg: 'text-emerald-700',
    },
    Blocks: {
        stroke: '#f59e0b',
        dashArray: '5 5',
        badgeBg: 'bg-amber-100 border border-amber-300 text-amber-800',
        textBg: 'text-amber-800',
    },
    'Related To': {
        stroke: '#549acb',
        dashArray: '5 5',
        badgeBg: 'bg-sky-100 border border-sky-300 text-sky-800',
        textBg: 'text-sky-800',
    },
    'Leads To': {
        stroke: '#8b5cf6',
        dashArray: '5 5',
        badgeBg: 'bg-purple-100 border border-purple-300 text-purple-800',
        textBg: 'text-purple-800',
    },
    Enables: {
        stroke: '#10b981',
        badgeBg: 'bg-emerald-100 border border-emerald-300 text-emerald-800',
        textBg: 'text-emerald-800',
    },
};

export const CanvasConnectionsOverlay: React.FC<CanvasConnectionsOverlayProps> = ({
    nodes,
    connections,
    onSelectConnection,
    onDeleteConnection,
}) => {
    const nodeMap = new Map<string, TaskMapNode>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full min-h-[1200px] min-w-[1600px]">
                <defs>
                    <marker
                        id="arrow-rose"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#e11d48" />
                    </marker>
                    <marker
                        id="arrow-emerald"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                    </marker>
                    <marker
                        id="arrow-amber"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                    </marker>
                    <marker
                        id="arrow-sky"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#549acb" />
                    </marker>
                    <marker
                        id="arrow-purple"
                        viewBox="0 0 10 10"
                        refX="6"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
                    </marker>
                </defs>

                {connections.map((conn) => {
                    const fromNode = nodeMap.get(conn.fromNodeId);
                    const toNode = nodeMap.get(conn.toNodeId);
                    if (!fromNode || !toNode) return null;

                    // Compute card centers
                    const x1 = fromNode.x + 140;
                    const y1 = fromNode.y + 50;
                    const x2 = toNode.x + 140;
                    const y2 = toNode.y + 50;

                    // Bezier control points
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const cp1x = x1 + dx * 0.4;
                    const cp1y = y1 + dy * 0.1;
                    const cp2x = x2 - dx * 0.4;
                    const cp2y = y2 - dy * 0.1;

                    const pathD = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;

                    // Midpoint for label badge
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;

                    const style = REL_STYLE[conn.relationship] || REL_STYLE['Related To'];

                    let markerId = 'arrow-sky';
                    if (conn.relationship === 'Depends On' || conn.isCritical) markerId = 'arrow-rose';
                    if (conn.relationship === 'Supports' || conn.relationship === 'Enables')
                        markerId = 'arrow-emerald';
                    if (conn.relationship === 'Blocks') markerId = 'arrow-amber';
                    if (conn.relationship === 'Leads To') markerId = 'arrow-purple';

                    return (
                        <g key={conn.id} className="group cursor-pointer pointer-events-auto">
                            {/* Connection Curved Line */}
                            <path
                                d={pathD}
                                fill="none"
                                stroke={conn.isCritical ? '#e11d48' : style.stroke}
                                strokeWidth={conn.isCritical ? '2.5' : '2'}
                                strokeDasharray={conn.isCritical ? '6 4' : style.dashArray}
                                markerEnd={`url(#${markerId})`}
                                className="transition-all hover:stroke-width-3"
                            />

                            {/* Relationship Label Pill along curve */}
                            <foreignObject
                                x={midX - 60}
                                y={midY - 14}
                                width="120"
                                height="28"
                                className="overflow-visible"
                            >
                                <div
                                    onClick={() => onSelectConnection?.(conn.id)}
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black text-center shadow-md border ${conn.isCritical
                                            ? 'bg-rose-500 text-white border-rose-600'
                                            : style.badgeBg
                                        } flex items-center justify-center space-x-1 cursor-pointer hover:scale-105 transition-transform`}
                                >
                                    <span>{conn.relationship}</span>
                                    {conn.isCritical && (
                                        <span className="text-[8px] bg-white text-rose-600 px-1 rounded font-extrabold">
                                            Critical
                                        </span>
                                    )}
                                </div>
                            </foreignObject>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
