import React from 'react';
import { HeartHandshake, Plus, Flame, Sparkles } from 'lucide-react';

interface FeedCommunityBannerProps {
    onOpenCreateModal: () => void;
}

export const FeedCommunityBanner: React.FC<FeedCommunityBannerProps> = ({ onOpenCreateModal }) => {
    return (
        <div className="neu-card p-5 sm:p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl neu-inset flex items-center justify-center text-[#549acb] bg-sky-50/40 shrink-0">
                        <HeartHandshake className="w-6 h-6 text-[#549acb]" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-[#549acb]">
                                Purpose & Community Pact
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-300/70">
                                Motivation & Goals Only
                            </span>
                        </div>
                        <h2 className="text-sm sm:text-base font-black text-[#1a1c35]">
                            Share Goals • Share Dreams • Elevate Each Other
                        </h2>
                    </div>
                </div>
