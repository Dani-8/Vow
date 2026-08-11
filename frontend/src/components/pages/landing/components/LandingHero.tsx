import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, CheckCircle2, Lock, Bot } from 'lucide-react';

interface LandingHeroProps {
  onEnterApp: () => void;
  onBypassAuth: () => void;
}

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
          Track daily tasks, build non-punitive streak momentum, safeguard confidential targets with independent PIN encryption, and overcome burnout using Gemini AI micro-steps.
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
          <div className="neu-inset p-3.5 rounded-2xl text-center">
            <span className="text-lg font-black text-[#1a1c35] block">15k+</span>
            <span className="text-xs text-[#717699] font-bold">Active Goals</span>
          </div>
          <div className="neu-inset p-3.5 rounded-2xl text-center">
            <span className="text-lg font-black text-[#549acb] block">99%</span>
            <span className="text-xs text-[#717699] font-bold">Streak Retention</span>
          </div>
          <div className="neu-inset p-3.5 rounded-2xl text-center">
            <span className="text-lg font-black text-purple-600 block">100%</span>
            <span className="text-xs text-[#717699] font-bold">PIN Security</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 relative">
        <div className="neu-card p-6 sm:p-8 bg-gradient-to-br from-[#E0E5EC] via-sky-50/50 to-purple-50/50 rounded-3xl space-y-6 relative overflow-hidden border-2 border-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/60 pb-3">
            <div className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-[#549acb]" />
              <span className="text-sm font-black text-[#1a1c35]">Master Streak Engine</span>
            </div>
            <span className="text-xs font-black text-[#549acb] neu-inset px-2.5 py-1 rounded-xl">
              14 Days Record
            </span>
          </div>

          <div className="neu-card p-4 space-y-2 bg-[#E0E5EC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#1a1c35]">Daily Shift Checkup Vow</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] text-[#717699]">Completed today • Personal Best 14d maintained</p>
          </div>

          <div className="neu-card p-4 space-y-2 bg-[#E0E5EC] border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#1a1c35]">Executive Strategy Log</span>
              <span className="text-[10px] font-extrabold text-purple-600 flex items-center space-x-1 neu-inset px-2 py-0.5 rounded-lg">
                <Lock className="w-3 h-3" />
                <span>Vault Sealed</span>
              </span>
            </div>
            <p className="text-[11px] text-[#717699]">Encrypted behind secondary 4-digit PIN</p>
          </div>

          <div className="neu-inset p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#549acb]">
              <Bot className="w-4 h-4" />
              <span>Gemini AI Task Coach Response</span>
            </div>
            <p className="text-[11px] text-[#44476A] italic leading-relaxed">
              "Here is your 10-minute micro-step: Spend 3 minutes listing priorities, then 7 minutes reviewing safety protocols."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
