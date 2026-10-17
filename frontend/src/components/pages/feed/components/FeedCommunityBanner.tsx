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

                <div className="flex items-center space-x-2 shrink-0 self-start md:self-center">
                    <button
                        onClick={onOpenCreateModal}
                        className="neu-button-primary px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Share Story / Formula</span>
                    </button>
                </div>
            </div>

            {/* Direct Motivational Message to Everyone */}
            <div className="neu-inset p-4 rounded-2xl bg-white/45 border border-white/70 text-xs text-[#29335a] leading-relaxed font-medium space-y-1.5">
                <p>
                    A feed for motivation from one person to another: <strong>share your goals, share your dreams, share your achievements</strong>, and share what this app is capable of helping you achieve.
                </p>
                <p className="text-[#647196]">
                    This is <strong>not</strong> Instagram, Facebook, Snapchat, or Twitter(X)—this space is exclusively for pure motivational and discipline purposes.
                    <strong className="text-[#1a1c35]"> Your small achievement post can be life-changing motivation for someone else.</strong> Push yourself, and push others forward as well.
                </p>
            </div>
        </div>
    );
};
