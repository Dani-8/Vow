import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, CheckCircle2, Lock, Bot, Network, ListTodo } from 'lucide-react';

interface LandingHeroProps {
  onEnterApp: () => void;
  onBypassAuth: () => void;
}

const STATS = [
  { value: '15k+', label: 'Active Goals', color: 'text-[#1a1c35]' },
  { value: '99%', label: 'Streak Retention', color: 'text-[#549acb]' },
  { value: '100%', label: 'PIN Security', color: 'text-purple-600' },
];

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterApp,
  onBypassAuth,
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center space-x-2 neu-inset px-4 py-1.5 rounded-full text-xs font-extrabold text-[#549acb] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#549acb]" />
          <span>Non-Punitive Habit & Task Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a1c35] tracking-tight leading-[1.15]">
          One platform for every industry.
        </h1>

        <p className="text-base sm:text-lg text-[#717699] font-medium leading-relaxed max-w-2xl">
          Visual interactive task maps, sub-task timelines, non-punitive streak momentum, independent PIN-encrypted vaults, and Gemini AI micro-step breakdowns — built for consistent, burnout-free execution.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onEnterApp}
            className="neu-button-primary px-8 py-4 rounded-2xl text-sm font-extrabold flex items-center space-x-2 shadow-xl hover:scale-105 transition-transform"
          >
            <span>Enter Live Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onBypassAuth}
            className="neu-button px-6 py-4 rounded-2xl text-sm font-extrabold text-emerald-700 flex items-center space-x-2 border border-emerald-300/60 hover:bg-emerald-50"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Instant Dev Bypass</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 max-w-md">
          {STATS.map((stat) => (
            <div key={stat.label} className="neu-inset p-3.5 rounded-2xl text-center">
              <span className={`text-lg font-black ${stat.color} block`}>{stat.value}</span>
              <span className="text-xs text-[#717699] font-bold">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 relative">
        <div className="neu-card p-6 sm:p-8 bg-gradient-to-br from-[#E0E5EC] via-sky-50/50 to-purple-50/50 rounded-3xl space-y-4 relative overflow-hidden border-2 border-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/60 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#549acb]" />
              <span className="text-sm font-black text-[#1a1c35]">Vow Workspace Highlights</span>
            </div>
            <span className="text-xs font-black text-[#549acb] neu-inset px-2.5 py-1 rounded-xl">
              v2.4 Engine
            </span>
          </div>

          {/* Interactive Task Map Teaser */}
          <div className="neu-card p-3.5 space-y-2 bg-[#E0E5EC] border-l-4 border-[#549acb]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-[#549acb]" />
                <span className="text-xs font-extrabold text-[#1a1c35]">Task Map Canvas</span>
              </div>
              <span className="text-[10px] font-black text-[#549acb] neu-inset px-2 py-0.5 rounded-lg uppercase">
                Interactive Nodes
              </span>
            </div>
            <p className="text-[11px] text-[#717699] font-medium">
              Map dependencies & critical path bottlenecks on a drag-and-drop canvas.
            </p>
          </div>

          {/* Sub-Task Timeline Teaser */}
          <div className="neu-card p-3.5 space-y-2 bg-[#E0E5EC] border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ListTodo className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-extrabold text-[#1a1c35]">Sub-Task Timelines</span>
              </div>
              <span className="text-[10px] font-black text-emerald-600 neu-inset px-2 py-0.5 rounded-lg">
                75% Complete
              </span>
            </div>
            <p className="text-[11px] text-[#717699] font-medium">
              Break macro goals into micro action items with real-time progress bars.
            </p>
          </div>

          {/* Streak & Vault Teaser */}
          <div className="grid grid-cols-2 gap-3">
            <div className="neu-inset p-3 rounded-2xl space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-amber-600">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>Master Streak</span>
              </div>
              <p className="text-[10px] text-[#717699] font-bold">14 Days Record</p>
            </div>

            <div className="neu-inset p-3 rounded-2xl space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-purple-600">
                <Lock className="w-3.5 h-3.5" />
                <span>PIN Vault</span>
              </div>
              <p className="text-[10px] text-[#717699] font-bold">Sealed & Private</p>
            </div>
          </div>

          {/* Gemini AI Coach Teaser */}
          <div className="neu-inset p-3.5 rounded-2xl space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#549acb]">
              <Bot className="w-4 h-4" />
              <span>Gemini AI Task Coach</span>
            </div>
            <p className="text-[11px] text-[#44476A] italic leading-relaxed">
              "Here is your 10-minute micro-step plan to tackle this goal efficiently."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

