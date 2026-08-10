import React from 'react';
import {
  Sparkles,
  Flame,
  Lock,
  Building2,
  Stethoscope,
  Croissant,
  Wrench,
  HardHat,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bot,
  LogIn,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
  onBypassAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenAuth,
  onBypassAuth,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#E0E5EC] text-[#44476A] font-sans selection:bg-[#549acb]/30">
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between z-30 relative">
        <div
          onClick={onEnterApp}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white shadow-md group-hover:scale-105 transition-transform">
            <span className="font-black text-xl italic">V</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1a1c35] tracking-tight">Vow</h1>
            <p className="text-[10px] font-bold text-[#717699] uppercase tracking-wider">Growth & Task Operations</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 neu-inset px-6 py-2 rounded-2xl">
          <a href="#features" className="text-xs font-bold text-[#717699] hover:text-[#549acb] transition-colors">
            Core Features
          </a>
          <a href="#industries" className="text-xs font-bold text-[#717699] hover:text-[#549acb] transition-colors">
            Industries
          </a>
          <a href="#ai-coach" className="text-xs font-bold text-[#717699] hover:text-[#549acb] transition-colors">
            Gemini AI
          </a>
          <a href="#vault" className="text-xs font-bold text-[#717699] hover:text-[#549acb] transition-colors">
            PIN Vault
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBypassAuth}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300/60 hover:bg-emerald-200 transition-colors shadow-sm"
            title="Instant Dev Bypass for testing"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dev Bypass</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="neu-button px-4 py-2 rounded-xl text-xs font-extrabold text-[#549acb] hover:text-[#1a1c35] flex items-center space-x-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onEnterApp}
            className="neu-button-primary px-5 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pt-4 pb-20">
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

        <section id="industries" className="space-y-6 pt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-white/60 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#549acb] uppercase tracking-wider block">Targeted Workflows</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1a1c35]">Built for Every Operational Domain</h2>
            </div>
            <p className="text-xs text-[#717699] font-medium max-w-md">
              From high-stakes hospitals to busy retail bakeries and job sites, Vow adapts to your specific team routine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="neu-card p-5 space-y-3 hover:scale-[1.02] transition-transform">
              <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-[#549acb]">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#1a1c35]">Corporate Offices</h3>
              <p className="text-xs text-[#717699] font-medium leading-relaxed">
                Sprint deliverables, team handoffs, and executive focus habits.
              </p>
            </div>

            <div className="neu-card p-5 space-y-3 hover:scale-[1.02] transition-transform">
              <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-rose-500">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#1a1c35]">Hospitals & Clinics</h3>
              <p className="text-xs text-[#717699] font-medium leading-relaxed">
                Patient checkup routines, hygiene vows, and staff shift handovers.
              </p>
            </div>

            <div className="neu-card p-5 space-y-3 hover:scale-[1.02] transition-transform">
              <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-amber-500">
                <Croissant className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#1a1c35]">Bakeries & Shops</h3>
              <p className="text-xs text-[#717699] font-medium leading-relaxed">
                Early morning prep checklists, fresh inventory habits, and opening routines.
              </p>
            </div>

            <div className="neu-card p-5 space-y-3 hover:scale-[1.02] transition-transform">
              <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-emerald-600">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#1a1c35]">Home Services</h3>
              <p className="text-xs text-[#717699] font-medium leading-relaxed">
                Client dispatch follow-ups, tool safety checkups, and job site logs.
              </p>
            </div>

            <div className="neu-card p-5 space-y-3 hover:scale-[1.02] transition-transform">
              <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-indigo-600">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[#1a1c35]">Construction Sites</h3>
              <p className="text-xs text-[#717699] font-medium leading-relaxed">
                OSHA compliance habits, heavy machinery inspection streaks.
              </p>
            </div>
          </div>
        </section>

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

        <section className="neu-card p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 bg-gradient-to-r from-sky-50/50 via-[#E0E5EC] to-indigo-50/50">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a1c35] tracking-tight">
            Ready to experience non-punitive streak tracking?
          </h2>
          <p className="text-xs sm:text-sm text-[#717699] font-medium max-w-xl mx-auto">
            Test the live app immediately with one-click Dev Bypass or register your free account today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onEnterApp}
              className="neu-button-primary px-8 py-3.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 shadow-lg"
            >
              <span>Launch Live App</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBypassAuth}
              className="neu-button px-6 py-3.5 rounded-2xl text-xs font-extrabold text-emerald-700 flex items-center space-x-2 border border-emerald-300"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instant Dev Bypass</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-white/60 py-8 text-center bg-[#E0E5EC]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl neu-button flex items-center justify-center bg-[#549acb] text-white font-bold text-xs italic">
              V
            </div>
            <span className="text-sm font-black text-[#1a1c35]">Vow Task & Streak Platform</span>
          </div>

          <p className="text-xs text-[#717699] font-medium">
            © {new Date().getFullYear()} Vow Inc. • Powered by Gemini AI & Non-Punitive Streak Engine
          </p>
        </div>
      </footer>
    </div>
  );
};
