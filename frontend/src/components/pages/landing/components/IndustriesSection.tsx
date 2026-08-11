import React from 'react';
import { Building2, Stethoscope, Croissant, Wrench, HardHat, LucideIcon } from 'lucide-react';

interface IndustryItem {
    icon: LucideIcon;
    iconColor: string;
    title: string;
    description: string;
}

const INDUSTRIES: IndustryItem[] = [
    {
        icon: Building2,
        iconColor: 'text-[#549acb]',
        title: 'Corporate Offices',
        description: 'Sprint deliverables, team handoffs, and executive focus habits.',
    },
    {
        icon: Stethoscope,
        iconColor: 'text-rose-500',
        title: 'Hospitals & Clinics',
        description: 'Patient checkup routines, hygiene vows, and staff shift handovers.',
    },
    {
        icon: Croissant,
        iconColor: 'text-amber-500',
        title: 'Bakeries & Shops',
        description: 'Early morning prep checklists, fresh inventory habits, and opening routines.',
    },
    {
        icon: Wrench,
        iconColor: 'text-emerald-600',
        title: 'Home Services',
        description: 'Client dispatch follow-ups, tool safety checkups, and job site logs.',
    },
    {
        icon: HardHat,
        iconColor: 'text-indigo-600',
        title: 'Construction Sites',
        description: 'OSHA compliance habits, heavy machinery inspection streaks.',
    },
];

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
                {INDUSTRIES.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.title} className="neu-card p-5 space-y-3 hover:scale-[1.02] transition-transform">
                            <div className={`w-11 h-11 rounded-2xl neu-button flex items-center justify-center ${item.iconColor}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-black text-[#1a1c35]">{item.title}</h3>
                            <p className="text-xs text-[#717699] font-medium leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
