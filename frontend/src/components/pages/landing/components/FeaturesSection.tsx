import React from 'react';
import { Network, ListTodo, Flame, Lock, Bot, LucideIcon, GitFork } from 'lucide-react';

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
        id: 'task-map',
        icon: Network,
        iconColor: 'text-[#549acb]',
        title: '1. Interactive Task Maps & Canvas',
        description: (
            <>
                Map complex project dependencies, connect prerequisite tasks with directional nodes, highlight critical path bottlenecks, and drag custom task cards on an infinite canvas.
            </>
        ),
    },
    {
        id: 'sub-tasks',
        icon: ListTodo,
        iconColor: 'text-emerald-600',
        title: '2. Sub-Task Timelines & Workspaces',
        description: (
            <>
                Break down massive goals into structured sub-tasks with real-time percentage progress indicators, status flows, and dedicated task detail workspaces.
            </>
        ),
    },
    {
        id: 'streaks',
        icon: Flame,
        iconColor: 'text-amber-500',
        iconClass: 'fill-amber-500',
        title: '3. Non-Punitive Master Streaks',
        description: (
            <>
                Missing a day resets your current streak count, but your <strong>Personal Best Record</strong> remains permanently celebrated in your analytics history.
            </>
        ),
    },
    {
        id: 'vault',
        icon: Lock,
        iconColor: 'text-purple-600',
        title: '4. Growth Vault (PIN Encrypted)',
        containerClass: 'border-l-4 border-purple-500',
        description: (
            <>
                Keep confidential targets, executive notes, and personal vows locked behind an independent 4-digit PIN vault separate from public team lists.
            </>
        ),
    },
    {
        id: 'ai-coach',
        icon: Bot,
        iconColor: 'text-indigo-600',
        title: '5. Gemini AI Micro-Step Coach',
        description: (
            <>
                Stuck or overwhelmed by a task? Click the AI Help button to receive instant 10-minute action plans and tailored encouragement.
            </>
        ),
    },
];

export const FeaturesSection: React.FC = () => {
    return (
        <section id="features" className="space-y-8 pt-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-extrabold text-[#549acb] uppercase tracking-wider">Engine Architecture</span>
                <h2 className="text-3xl font-black text-[#1a1c35]">Why Teams & Professionals Choose Vow</h2>
                <p className="text-xs text-[#717699] font-medium">
                    A complete productivity suite built for clarity, visual task mapping, sub-task breakdowns, and private security.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.title}
                            id={feature.id}
                            className={`neu-card p-7 space-y-4 ${feature.containerClass || ''}`}
                        >
                            <div className={`w-12 h-12 rounded-2xl neu-button flex items-center justify-center ${feature.iconColor} bg-[#E0E5EC]`}>
                                <Icon className={`w-6 h-6 ${feature.iconClass || ''}`} />
                            </div>
                            <h3 className="text-base font-black text-[#1a1c35]">{feature.title}</h3>
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

