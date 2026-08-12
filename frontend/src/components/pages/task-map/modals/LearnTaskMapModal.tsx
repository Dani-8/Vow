import React from 'react';
import { X, Network, GitFork, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface LearnTaskMapModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LearnTaskMapModal: React.FC<LearnTaskMapModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl neu-card p-6 sm:p-8 rounded-3xl bg-[#E0E5EC] border border-white shadow-2xl space-y-6 relative">
                <div className="flex items-center justify-between pb-3 border-b border-white/60">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white">
                            <Network className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#1a1c35]">How Task Map Works</h3>
                            <p className="text-xs text-[#717699] font-medium">Visual project relationships & critical paths</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl neu-button text-[#717699] hover:text-rose-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4 text-xs font-medium text-[#44476A] leading-relaxed">
                    <div className="neu-inset p-4 rounded-2xl space-y-2">
                        <div className="flex items-center space-x-2 text-[#1a1c35] font-black text-sm">
                            <CheckCircle2 className="w-4 h-4 text-[#549acb]" />
                            <span>1. Zero Task Duplication</span>
                        </div>
                        <p className="text-[#717699] pl-6">
                            Task Map is a visual planning layer over your existing task system. Import Main Tasks and Sub-Tasks directly without re-creating them.
                        </p>
                    </div>

                    <div className="neu-inset p-4 rounded-2xl space-y-2">
                        <div className="flex items-center space-x-2 text-[#1a1c35] font-black text-sm">
                            <GitFork className="w-4 h-4 text-emerald-600" />
                            <span>2. Directional Relationships</span>
                        </div>
                        <p className="text-[#717699] pl-6">
                            Draw clean curved connections between cards to express dependencies like <em>Depends On</em>, <em>Blocks</em>, <em>Supports</em>, <em>Leads To</em>, and <em>Enables</em>.
                        </p>
                    </div>

                    <div className="neu-inset p-4 rounded-2xl space-y-2">
                        <div className="flex items-center space-x-2 text-[#1a1c35] font-black text-sm">
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                            <span>3. Critical Path Identification</span>
                        </div>
                        <p className="text-[#717699] pl-6">
                            Highlight critical dependencies in red so you can easily spot bottleneck tasks before they block your milestone launches.
                        </p>
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        onClick={onClose}
                        className="neu-button-primary px-6 py-2.5 rounded-2xl font-extrabold text-xs text-white shadow-md"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};
