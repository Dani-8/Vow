import React from 'react';
import { Flame, Lock, Bot, LucideIcon } from 'lucide-react';

interface FeatureItem {
    id?: string;
    icon: LucideIcon;
    iconColor: string;
    iconClass?: string;
    title: string;
    description: React.ReactNode;
    containerClass?: string;
}

const FEATURES: FeatureItem[] = [
    {
        icon: Flame,
        iconColor: 'text-[#549acb]',
        iconClass: 'fill-[#549acb]',
        title: '1. Non-Punitive Master Streaks',
        description: (
            <>
                Missing a day quietly resets your current count to 0, but your{' '}
                <strong>Personal Best Record</strong> remains permanently celebrated. You never lose your milestone history.
            </>
        ),
    },
    {
        id: 'vault',
        icon: Lock,
        iconColor: 'text-purple-600',
        title: '2. Growth Vault (PIN Protected)',
        containerClass: 'border-l-4 border-purple-500',
        description: (
            <>
                Keep sensitive business targets, medical shift notes, or personal vows locked behind an independent 4-digit PIN vault separate from public lists.
            </>
        ),
    },
    {
        id: 'ai-coach',
        icon: Bot,
        iconColor: 'text-indigo-600',
        title: '3. Gemini AI Task Coach',
        description: (
            <>
                Stuck on a massive task? Click the AI Help button to receive instant 10-minute micro-step breakdowns and tailored encouragement.
            </>
        ),
    },
];

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
                {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.title}
                            id={feature.id}
                            className={`neu-card p-8 space-y-4 ${feature.containerClass || ''}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl neu-button flex items-center justify-center ${feature.iconColor} bg-[#E0E5EC]`}>
                                <Icon className={`w-6 h-6 ${feature.iconClass || ''}`} />
                            </div>
                            <h3 className="text-lg font-black text-[#1a1c35]">{feature.title}</h3>
                            <p className="text-xs text-[#717699] leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
