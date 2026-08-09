import React from 'react';
import { Zap, Plus, Check, Sparkles } from 'lucide-react';

interface QuickActionsCardProps {
  onOpenCreateModal: () => void;
  onCheckInToday: () => void;
  onOpenAIAssist: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onOpenCreateModal,
  onCheckInToday,
  onOpenAIAssist,
}) => {
  return (
    <div className="neu-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <Zap className="w-4 h-4 text-[#549acb]" />
          <h3 className="text-sm font-extrabold text-[#1a1c35]">Quick Actions</h3>
        </div>
        <p className="text-[11px] text-[#717699] font-medium mb-4">Common actions</p>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onOpenCreateModal}
            className="neu-button p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-1">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-[#1a1c35]">New Task</span>
          </button>

          <button
            onClick={onCheckInToday}
            className="neu-button p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-[10px] font-extrabold text-[#1a1c35]">Check In</span>
          </button>

          <button
            onClick={onOpenAIAssist}
            className="neu-button p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-[#1a1c35]">Focus Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
