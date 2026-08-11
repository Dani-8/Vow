import React from 'react';
import { Flame, CheckCircle2, Unlock, Bot } from 'lucide-react';

interface PreviewStat {
  value: string;
  label: string;
  color: string;
}

const PREVIEW_STATS: PreviewStat[] = [
  { value: '15k+', label: 'Active Goals', color: 'text-[#1a1c35]' },
  { value: '99%', label: 'Retention Rate', color: 'text-[#549acb]' },
  { value: '100%', label: 'PIN Privacy', color: 'text-purple-600' },
];

export const AuthPreviewCard: React.FC = () => {
  return (
    <div className="lg:col-span-6 hidden lg:flex flex-col space-y-6 pl-4">
      <div className="neu-card p-8 bg-gradient-to-br from-[#E0E5EC]/80 via-sky-50/60 to-purple-50/60 backdrop-blur-xl border border-white/80 shadow-2xl rounded-3xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#549acb] text-white flex items-center justify-center font-bold text-xs shadow">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#1a1c35]">2M+ Streak Days</h4>
              <p className="text-[10px] text-[#717699] font-bold">Consistent progress globally</p>
            </div>
          </div>

          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Non-Punitive Active
          </span>
        </div>

        <div className="neu-card p-6 bg-[#E0E5EC] rounded-2xl space-y-4 shadow-xl border-2 border-[#549acb]/20 max-w-sm mx-auto transform hover:rotate-1 transition-transform">
          <div className="flex items-center justify-between border-b border-white/60 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#549acb] text-white flex items-center justify-center font-bold text-xs">
                V
              </div>
              <span className="text-xs font-black text-[#1a1c35]">Vow Workspace</span>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg neu-inset text-[#549acb]">
              🔥 14d Master
            </span>
          </div>

          <div className="neu-card p-3.5 space-y-1.5 bg-[#E0E5EC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1a1c35]">Morning Inspection Routine</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[10px] text-[#717699]">5 of 5 daily checklists completed</p>
          </div>

          <div className="neu-card p-3.5 space-y-1.5 bg-[#E0E5EC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1a1c35]">Executive Strategy Vow</span>
              <span className="text-[9px] font-extrabold text-purple-600 flex items-center space-x-0.5">
                <Unlock className="w-3 h-3" />
                <span>PIN Vault</span>
              </span>
            </div>
            <p className="text-[10px] text-[#717699]">Confidential growth targets locked</p>
          </div>

          <div className="neu-inset p-3 rounded-xl flex items-center justify-between text-[11px] font-bold text-[#549acb]">
            <div className="flex items-center space-x-1.5">
              <Bot className="w-4 h-4 text-[#549acb]" />
              <span>Gemini AI Task Coach</span>
            </div>
            <span className="text-[9px] text-[#717699]">Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {PREVIEW_STATS.map((stat) => (
            <div key={stat.label} className="neu-inset p-3 rounded-2xl text-center">
              <span className={`text-xs font-black ${stat.color} block`}>{stat.value}</span>
              <span className="text-[10px] text-[#717699] font-bold">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
