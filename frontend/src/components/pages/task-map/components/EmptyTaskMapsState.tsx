import React from 'react';
import { Network, Plus, HelpCircle } from 'lucide-react';

interface EmptyTaskMapsStateProps {
  onCreateFirstMap: () => void;
  onOpenLearnModal: () => void;
}

export const EmptyTaskMapsState: React.FC<EmptyTaskMapsStateProps> = ({
  onCreateFirstMap,
  onOpenLearnModal,
}) => {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Soft 3D Neumorphic Illustration Container */}
        <div className="relative w-64 h-64 mx-auto neu-card p-6 rounded-3xl flex items-center justify-center bg-gradient-to-br from-white/70 via-[#E0E5EC] to-sky-50/50 shadow-2xl border border-white">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border border-dashed border-[#549acb]/30 animate-pulse" />
          </div>

          {/* Central node & surrounding nodes diagram */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Center Node */}
            <div className="w-16 h-16 rounded-2xl neu-button bg-[#549acb] text-white flex items-center justify-center shadow-lg z-10">
              <Network className="w-8 h-8" />
            </div>

            {/* Top Left Node */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-emerald-200 border border-emerald-300 shadow-md flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>

            {/* Top Right Node */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-purple-200 border border-purple-300 shadow-md flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
            </div>

            {/* Bottom Left Node */}
            <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-amber-200 border border-amber-300 shadow-md flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
            </div>

            {/* Bottom Right Node */}
            <div className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-sky-200 border border-sky-300 shadow-md flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-sky-500" />
            </div>

            {/* Connecting soft lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#549acb]/40 stroke-2">
              <line x1="25%" y1="25%" x2="50%" y2="50%" strokeDasharray="3 3" />
              <line x1="75%" y1="25%" x2="50%" y2="50%" strokeDasharray="3 3" />
              <line x1="25%" y1="75%" x2="50%" y2="50%" strokeDasharray="3 3" />
              <line x1="75%" y1="75%" x2="50%" y2="50%" strokeDasharray="3 3" />
            </svg>
          </div>
        </div>

        {/* Text and Actions */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1a1c35] tracking-tight">
            No Task Maps Yet
          </h2>
          <p className="text-xs sm:text-sm text-[#717699] max-w-md mx-auto leading-relaxed font-medium">
            Create your first task map to visualize relationships, dependencies, and how everything connects.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 pt-2">
          <button
            onClick={onCreateFirstMap}
            className="neu-button-primary px-8 py-3.5 rounded-2xl font-extrabold text-xs text-white shadow-xl flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Map</span>
          </button>

          <div className="flex items-center space-x-3 w-48 my-2">
            <div className="h-px bg-[#717699]/20 flex-1" />
            <span className="text-[11px] font-bold text-[#717699]">or</span>
            <div className="h-px bg-[#717699]/20 flex-1" />
          </div>

          <button
            onClick={onOpenLearnModal}
            className="text-xs font-bold text-[#549acb] hover:underline flex items-center space-x-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Learn how Task Map works</span>
          </button>
        </div>
      </div>
    </div>
  );
};
