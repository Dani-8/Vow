import React from 'react';
import { Flame, Lock, Bot } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="space-y-8 pt-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold text-[#549acb] uppercase tracking-wider">Engine Architecture</span>
        <h2 className="text-3xl font-black text-[#1a1c35]">Why Teams & Professionals Trust Vow</h2>
        <p className="text-xs text-[#717699] font-medium">
          Designed for consistent daily execution without shame, data loss, or privacy breaches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="neu-card p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-[#549acb] bg-[#E0E5EC]">
            <Flame className="w-6 h-6 fill-[#549acb]" />
          </div>
          <h3 className="text-lg font-black text-[#1a1c35]">1. Non-Punitive Master Streaks</h3>
          <p className="text-xs text-[#717699] leading-relaxed font-medium">
            Missing a day quietly resets your current count to 0, but your <strong>Personal Best Record</strong> remains permanently celebrated. You never lose your milestone history.
          </p>
        </div>

        <div id="vault" className="neu-card p-8 space-y-4 border-l-4 border-purple-500">
          <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-purple-600 bg-[#E0E5EC]">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-black text-[#1a1c35]">2. Growth Vault (PIN Protected)</h3>
          <p className="text-xs text-[#717699] leading-relaxed font-medium">
            Keep sensitive business targets, medical shift notes, or personal vows locked behind an independent 4-digit PIN vault separate from public lists.
          </p>
        </div>

        <div id="ai-coach" className="neu-card p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-indigo-600 bg-[#E0E5EC]">
            <Bot className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-black text-[#1a1c35]">3. Gemini AI Task Coach</h3>
          <p className="text-xs text-[#717699] leading-relaxed font-medium">
            Stuck on a massive task? Click the AI Help button to receive instant 10-minute micro-step breakdowns and tailored encouragement.
          </p>
        </div>
      </div>
    </section>
  );
};
