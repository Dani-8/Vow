import React, { useState } from 'react';
import { Network, Plus, HelpCircle, Sparkles, AlertCircle } from 'lucide-react';
import { TaskMap, TaskMapNode, TaskMapConnection, MapAccentColor, RelationshipType } from '../types';
import { Task } from '../../../../types';
import { CanvasHeader } from './CanvasHeader';
import { CanvasFooter } from './CanvasFooter';
import { TaskNodeCard } from './TaskNodeCard';
import { CanvasConnectionsOverlay } from './CanvasConnectionsOverlay';
import { AddTasksToMapModal } from '../modals/AddTasksToMapModal';
import { AddConnectionModal } from '../modals/AddConnectionModal';
import { CreateMapModal } from '../modals/CreateMapModal';

interface TaskMapCanvasViewProps {
  currentMap: TaskMap;
  maps: TaskMap[];
  tasks: Task[];
  onSelectMap: (mapId: string) => void;
  onBackToMaps: () => void;
  onCreateNewMap: () => void;
  onUpdateMap: (updatedMap: TaskMap) => void;
}

export const TaskMapCanvasView: React.FC<TaskMapCanvasViewProps> = ({
  currentMap,
  maps,
  tasks,
  onSelectMap,
  onBackToMaps,
  onCreateNewMap,
  onUpdateMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isPanMode, setIsPanMode] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Modal triggers
  const [isAddTasksOpen, setIsAddTasksOpen] = useState(false);
  const [isAddConnectionOpen, setIsAddConnectionOpen] = useState(false);
  const [isCreateMapOpen, setIsCreateMapOpen] = useState(false);
  const [connectFromNodeId, setConnectFromNodeId] = useState<string | undefined>(undefined);

  const taskMapById = new Map<string, Task>();
  tasks.forEach((t) => taskMapById.set(t._id, t));

  // Node position update
  const handlePositionChange = (nodeId: string, newX: number, newY: number) => {
    const updatedNodes = currentMap.nodes.map((n) =>
      n.id === nodeId ? { ...n, x: newX, y: newY } : n
    );
    onUpdateMap({ ...currentMap, nodes: updatedNodes, updatedAt: 'Just now' });
  };

  // Delete Node
  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = currentMap.nodes.filter((n) => n.id !== nodeId);
    const updatedConnections = currentMap.connections.filter(
      (c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId
    );
    onUpdateMap({
      ...currentMap,
      nodes: updatedNodes,
      connections: updatedConnections,
      updatedAt: 'Just now',
    });
  };

  // Import Tasks
  const handleImportTasks = (selectedItems: { taskId: string; subTaskId?: string }[]) => {
    const existingIds = new Set(currentMap.nodes.map((n) => n.id));
    const newNodes: TaskMapNode[] = [...currentMap.nodes];

    let startX = 200 + (currentMap.nodes.length % 3) * 280;
    let startY = 150 + Math.floor(currentMap.nodes.length / 3) * 180;

    selectedItems.forEach((item, index) => {
      const nodeKey = item.subTaskId ? `node-sub-${item.subTaskId}` : `node-${item.taskId}`;
      if (existingIds.has(nodeKey)) return;

      const mainTask = taskMapById.get(item.taskId);
      const subTask = item.subTaskId
        ? mainTask?.subTasks?.find((s) => s.id === item.subTaskId)
        : undefined;

      newNodes.push({
        id: nodeKey,
        taskId: item.taskId,
        subTaskId: item.subTaskId,
        x: startX + (index % 3) * 300,
        y: startY + Math.floor(index / 3) * 200,
        customTitle: subTask?.title || mainTask?.title || 'Imported Goal',
        customStatus: (subTask?.status as any) || mainTask?.status || 'todo',
        customProgress: mainTask?.status === 'completed' ? 100 : 50,
      });
    });

    onUpdateMap({ ...currentMap, nodes: newNodes, updatedAt: 'Just now' });
  };

  // Add Connection
  const handleAddConnection = (
    fromNodeId: string,
    toNodeId: string,
    relationship: RelationshipType,
    isCritical: boolean
  ) => {
    const newConn: TaskMapConnection = {
      id: `conn-${Date.now()}`,
      fromNodeId,
      toNodeId,
      relationship,
      isCritical,
    };
    onUpdateMap({
      ...currentMap,
      connections: [...currentMap.connections, newConn],
      updatedAt: 'Just now',
    });
  };

  const existingNodeTaskIds = new Set(currentMap.nodes.map((n) => n.taskId));
  const filteredNodes = currentMap.nodes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const t = taskMapById.get(n.taskId);
    return (
      n.customTitle?.toLowerCase().includes(q) ||
      t?.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full h-full flex flex-col space-y-4 animate-in fade-in duration-300">
      {/* Canvas Workspace Top Toolbar */}
      <CanvasHeader
        currentMap={currentMap}
        maps={maps}
        onSelectMap={onSelectMap}
        onBackToMaps={onBackToMaps}
        onOpenAddTasksModal={() => setIsAddTasksOpen(true)}
        onCreateNewMap={onCreateNewMap}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Canvas Stage Box */}
      <div className="relative flex-1 min-h-[600px] w-full neu-card rounded-3xl overflow-hidden bg-gradient-to-br from-[#E0E5EC] via-[#E6EAEE] to-[#D5DCFA]/30 border border-white/80 shadow-2xl flex flex-col justify-between">
        {/* Canvas Dot Pattern Background */}
        <div className="absolute inset-0 canvas-dot-grid pointer-events-none opacity-40" />

        {/* State 3 — Inside Map, Empty Canvas */}
        {currentMap.nodes.length === 0 ? (
          <div className="relative z-10 my-auto flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-48 h-48 rounded-3xl neu-card p-4 bg-white/50 backdrop-blur-md flex items-center justify-center border border-white shadow-xl relative">
              <div className="w-16 h-16 rounded-2xl neu-button bg-[#549acb] text-white flex items-center justify-center">
                <Network className="w-8 h-8" />
              </div>

              <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-emerald-200 border border-emerald-300" />
              <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-purple-200 border border-purple-300" />
              <div className="absolute bottom-3 left-3 w-8 h-8 rounded-lg bg-amber-200 border border-amber-300" />
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-sky-200 border border-sky-300" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-black text-[#1a1c35]">
                No tasks in this map yet
              </h3>
              <p className="text-xs text-[#717699] font-medium leading-relaxed">
                Add tasks and milestones to start visualizing how they connect and depend on each other.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 pt-2">
              <button
                onClick={() => setIsAddTasksOpen(true)}
                className="neu-button-primary px-8 py-3 rounded-2xl font-extrabold text-xs text-white shadow-lg flex items-center space-x-2 hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tasks to Map</span>
              </button>

              <span className="text-[11px] font-bold text-[#717699]">or</span>

              <button
                onClick={onCreateNewMap}
                className="text-xs font-bold text-[#549acb] hover:underline"
              >
                Create a new map
              </button>
            </div>
          </div>
        ) : (
          /* State 4 — Inside Map, Active Canvas Workspace */
          <div
            onMouseDown={(e) => {
              if (isPanMode || e.button === 1) {
                e.preventDefault();
                const startX = e.clientX - panOffset.x;
                const startY = e.clientY - panOffset.y;

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  setPanOffset({
                    x: moveEvent.clientX - startX,
                    y: moveEvent.clientY - startY,
                  });
                };

                const handleMouseUp = () => {
                  window.removeEventListener('mousemove', handleMouseMove);
                  window.removeEventListener('mouseup', handleMouseUp);
                };

                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
              }
            }}
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: 'top left',
            }}
            className={`relative w-full h-full min-h-[600px] transition-transform duration-75 ${
              isPanMode ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          >
            {/* SVG Connections Overlay */}
            <CanvasConnectionsOverlay
              nodes={currentMap.nodes}
              connections={currentMap.connections}
              onSelectConnection={(connId) => {
                if (confirm('Delete this connection?')) {
                  onUpdateMap({
                    ...currentMap,
                    connections: currentMap.connections.filter((c) => c.id !== connId),
                    updatedAt: 'Just now',
                  });
                }
              }}
            />

            {/* Task Nodes Grid */}
            {filteredNodes.map((node) => {
              const mainTask = taskMapById.get(node.taskId);
              const subTask = node.subTaskId
                ? mainTask?.subTasks?.find((s) => s.id === node.subTaskId)
                : undefined;

              return (
                <TaskNodeCard
                  key={node.id}
                  node={node}
                  task={mainTask}
                  subTask={subTask}
                  isSelected={selectedNodeId === node.id}
                  zoom={zoom}
                  onSelect={() => setSelectedNodeId(node.id)}
                  onPositionChange={handlePositionChange}
                  onDeleteNode={handleDeleteNode}
                  onStartConnect={(fromId) => {
                    setConnectFromNodeId(fromId);
                    setIsAddConnectionOpen(true);
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Footer Canvas Controls (Zoom, Pan, Minimap) */}
        <CanvasFooter
          zoom={zoom}
          onZoomIn={() => setZoom((z) => Math.min(z + 0.15, 2))}
          onZoomOut={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
          onResetZoom={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          isPanMode={isPanMode}
          onTogglePanMode={() => setIsPanMode(!isPanMode)}
          nodes={currentMap.nodes}
        />
      </div>

      {/* Modals */}
      <AddTasksToMapModal
        isOpen={isAddTasksOpen}
        onClose={() => setIsAddTasksOpen(false)}
        tasks={tasks}
        existingNodeTaskIds={existingNodeTaskIds}
        onImportTasks={handleImportTasks}
      />

      <AddConnectionModal
        isOpen={isAddConnectionOpen}
        onClose={() => setIsAddConnectionOpen(false)}
        nodes={currentMap.nodes}
        initialFromNodeId={connectFromNodeId}
        onAddConnection={handleAddConnection}
      />

      <CreateMapModal
        isOpen={isCreateMapOpen}
        onClose={() => setIsCreateMapOpen(false)}
        onCreateMap={(name, description, color) => {
          onCreateNewMap();
        }}
      />
    </div>
  );
};
