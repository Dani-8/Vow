import React from 'react';
import { Calendar } from 'lucide-react';

export const UpcomingDeadlinesCard: React.FC = () => {
  return (
    <div className="neu-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#549acb]" />
            <h3 className="text-sm font-extrabold text-[#1a1c35]">Upcoming Deadlines</h3>
          </div>
        </div>
        <p className="text-[11px] text-[#717699] font-medium mb-3">Next important due dates</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs p-2 rounded-xl neu-inset">
            <span className="font-bold text-[#1a1c35] truncate max-w-[150px]">
              Design System & Components
            </span>
            <span className="text-[10px] font-extrabold text-[#549acb] shrink-0">
              May 19, 2026
            </span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 rounded-xl neu-inset">
            <span className="font-bold text-[#1a1c35] truncate max-w-[150px]">
              Build Portfolio Website
            </span>
            <span className="text-[10px] font-extrabold text-[#549acb] shrink-0">
              May 23, 2026
            </span>
          </div>
          <div className="flex items-center justify-between text-xs p-2 rounded-xl neu-inset">
            <span className="font-bold text-[#1a1c35] truncate max-w-[150px]">
              Final Review & Polish
            </span>
            <span className="text-[10px] font-extrabold text-[#549acb] shrink-0">
              May 25, 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
