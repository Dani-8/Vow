import React from 'react';
import {
    Target,
    Calendar,
    CheckCircle2,
    BookOpen,
    Flame,
    X,
} from 'lucide-react';

interface HowChallengesWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GUIDE_STEPS = [
    {
        id: 'duration',
        icon: Calendar,
        iconColor: 'text-indigo-600',
        title: '1. Pick Any Custom Duration',
        description:
            'Whether it is a 21-day habit builder, a 60-day fitness transformation, 100 days of code, or any custom number (e.g. 31, 75, 250 days), Vow dynamically builds an exact calendar grid for your commitment.',
    },
    {
        id: 'matrix',
        icon: CheckCircle2,
        iconColor: 'text-emerald-600',
        title: '2. Interactive Progress Matrix',
        description:
            'A custom day-by-day matrix is dynamically created for your exact target days. Click any day square to check in, review past notes, or update your daily status at your own pace.',
    },
    {
        id: 'reflections',
        icon: BookOpen,
        iconColor: 'text-purple-600',
        title: '3. Daily Micro-Reflection Logs',
        description:
            'Log a quick 1-line note and time spent each day (e.g., "Day 33: Built RAG pipeline with Gemini API"). It builds an inspiring chronological portfolio of your journey.',
    },
    {
        id: 'momentum',
        icon: Flame,
        iconColor: 'text-amber-600',
        title: '4. Non-Punitive Momentum',
        description:
            'Need a planned rest day or missed one? Mark it as a rest day without destroying your challenge. Vow focuses on high completion rate and steady long-term compounding.',
    },
];

export const HowChallengesWorkModal: React.FC<HowChallengesWorkModalProps> = ({
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="neu-card w-full max-w-xl p-6 sm:p-8 bg-[#E0E5EC] relative my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
                    title="Close guide"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-purple-600 bg-purple-50 shrink-0">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#1a1c35]">How Vow Challenges Work</h2>
                        <p className="text-xs font-semibold text-[#717699]">
                            N-Day customizable commitment sprints & micro-journaling
                        </p>
                    </div>
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-700">
                    {GUIDE_STEPS.map((step) => {
                        const IconComponent = step.icon;
                        return (
                            <div
                                key={step.id}
                                className="neu-inset p-4 rounded-2xl flex items-start space-x-3.5 bg-[#E0E5EC]/80"
                            >
                                <div
                                    className={`w-8 h-8 rounded-xl neu-button flex items-center justify-center ${step.iconColor} shrink-0 mt-0.5`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h3>
                                    <p className="leading-relaxed text-[#515777]">{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex justify-end">
                    <button
                        onClick={onClose}
                        className="neu-button-primary px-6 py-2.5 rounded-xl font-bold text-xs text-white"
                    >
                        Got It, Let&apos;s Commit
                    </button>
                </div>
            </div>
        </div>
    );
};
