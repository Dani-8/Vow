import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  Trash2,
  Link2,
} from 'lucide-react';
import { TaskNodeCardProps } from './nodeCardTypes';

export const TaskNodeCard: React.FC<TaskNodeCardProps> = ({
  node,
  task,
  subTask,
  isSelected,
  zoom = 1,
  onSelect,
  onPositionChange,
  onDeleteNode,
  onStartConnect,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const title = subTask?.title || task?.title || node.customTitle || 'Untitled Task';
  const status = subTask?.status || task?.status || node.customStatus || 'todo';

  let progress = 0;
  if (status === 'completed') progress = 100;
  else if (status === 'in_progress') progress = node.customProgress || 50;

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if left click
    if (e.button !== 0) return;

    // Do not initiate node dragging when clicking interactive children (buttons, inputs, etc.)
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('select') || target.closest('input')) {
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

  // Status badge styling
  let statusBadge = (
    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-gray-200/70 text-[#717699]">
      Not Started
    </span>
  );
  let statusDot = <Circle className="w-4 h-4 text-[#717699] shrink-0" />;
  let progressBarColor = 'bg-gray-300';

  if (status === 'completed') {
    statusBadge = (
      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
        Completed
      </span>
    );
    statusDot = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    progressBarColor = 'bg-emerald-500';
  } else if (status === 'in_progress') {
    statusBadge = (
      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-800">
        In Progress
      </span>
    );
    statusDot = <Clock className="w-4 h-4 text-[#549acb] shrink-0" />;
    progressBarColor = 'bg-[#549acb]';
  }

  return (
    <div
      style={{ left: `${node.x}px`, top: `${node.y}px` }}
      onMouseDown={handleMouseDown}
      className={`absolute w-64 sm:w-72 neu-card p-4 rounded-2xl cursor-grab active:cursor-grabbing transition-all select-none z-10 ${
        isDragging ? 'shadow-2xl z-30 opacity-90 scale-[1.02]' : ''
      } ${
        isSelected ? 'ring-2 ring-[#549acb] shadow-2xl scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start space-x-2.5 min-w-0">
          <div className="mt-0.5">{statusDot}</div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-[#1a1c35] leading-snug line-clamp-2">
              {title}
            </h4>
            {subTask && (
              <span className="text-[9px] font-bold text-purple-600 block mt-0.5 truncate">
                Sub-Task: {task?.title}
              </span>
            )}
          </div>
        </div>

        {/* Options Button */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1 rounded-lg neu-button text-[#717699] hover:text-[#1a1c35]"
            title="Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {isMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-6 w-36 neu-card p-2 rounded-xl shadow-2xl z-50 bg-[#E0E5EC] space-y-1 text-xs font-bold border border-white"
            >
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onStartConnect(node.id);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#549acb]/10 text-[#549acb] flex items-center space-x-1.5"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Add Connection</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onDeleteNode(node.id);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-100 text-rose-600 flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Node</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-200/80 rounded-full overflow-hidden my-2.5">
        <div
          className={`h-full ${progressBarColor} transition-all duration-500 rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Footer status and progress row */}
      <div className="flex items-center justify-between pt-1 border-t border-white/50">
        {statusBadge}
        <span className="text-xs font-extrabold text-[#717699]">{progress}%</span>
      </div>
    </div>
  );
};
