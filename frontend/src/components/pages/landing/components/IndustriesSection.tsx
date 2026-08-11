import React from 'react';
import { Building2, Stethoscope, Croissant, Wrench, HardHat } from 'lucide-react';

export const IndustriesSection: React.FC = () => {
  return (
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
  );
};
