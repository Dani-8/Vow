import React, { useState } from 'react';
import {
  Hand,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
  Compass,
} from 'lucide-react';
import { TaskMapNode } from '../types';

interface CanvasFooterProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isPanMode: boolean;
  onTogglePanMode: () => void;
  nodes: TaskMapNode[];
}

export const CanvasFooter: React.FC<CanvasFooterProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isPanMode,
  onTogglePanMode,
  nodes,
}) => {
  const [showMinimap, setShowMinimap] = useState(true);

  return (
    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-20">
      {/* Zoom and Pan Controls Bar */}
      <div className="neu-card px-3 py-2 rounded-2xl flex items-center space-x-2 pointer-events-auto shadow-xl bg-[#E0E5EC]/95 backdrop-blur-md border border-white">
        <button
          onClick={onTogglePanMode}
          className={`p-2 rounded-xl text-xs font-bold transition-all ${
            isPanMode ? 'neu-inset text-[#549acb]' : 'neu-button text-[#717699]'
          }`}
          title="Toggle Pan Tool"
        >
          <Hand className="w-4 h-4" />
        </button>

        <button
          onClick={onResetZoom}
          className="p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#717699]/30 my-auto" />

        <button
          onClick={onZoomOut}
          className="p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-black text-[#1a1c35] px-2 w-12 text-center select-none">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={onZoomIn}
          className="p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Minimap / Overview Box */}
      {showMinimap && (
        <div className="neu-card p-2.5 rounded-2xl w-44 h-32 pointer-events-auto shadow-2xl bg-[#E0E5EC]/90 backdrop-blur-md border border-white flex flex-col justify-between relative group">
          <div className="flex items-center justify-between pb-1 border-b border-white/50">
            <span className="text-[9px] font-extrabold text-[#717699] uppercase tracking-wider flex items-center space-x-1">
              <Compass className="w-3 h-3 text-[#549acb]" />
              <span>Map Overview</span>
            </span>
            <button
              onClick={() => setShowMinimap(false)}
              className="p-0.5 rounded-md hover:bg-rose-100 text-[#717699] hover:text-rose-600 transition-colors"
              title="Close Minimap"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Miniature nodes map representation */}
          <div className="relative w-full h-20 rounded-xl neu-inset overflow-hidden bg-[#E0E5EC] flex items-center justify-center p-1">
            {nodes.map((node) => {
              const miniX = Math.min(Math.max((node.x / 1000) * 100, 5), 85);
              const miniY = Math.min(Math.max((node.y / 600) * 100, 10), 80);

              let miniBg = 'bg-[#549acb]';
              if (node.customStatus === 'completed') miniBg = 'bg-emerald-500';
              if (node.customStatus === 'todo') miniBg = 'bg-purple-500';

              return (
                <div
                  key={node.id}
                  style={{ left: `${miniX}%`, top: `${miniY}%` }}
                  className={`absolute w-3.5 h-2 rounded-sm ${miniBg} opacity-80 shadow-xs`}
                />
              );
            })}

            {/* Viewport frame inside minimap */}
            <div className="absolute inset-2 border-2 border-[#549acb] rounded-lg pointer-events-none opacity-60" />
          </div>
        </div>
      )}
    </div>
  );
};
