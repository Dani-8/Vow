import React from 'react';
import { LandingHeader } from './components/LandingHeader';
import { LandingHero } from './components/LandingHero';
import { IndustriesSection } from './components/IndustriesSection';
import { FeaturesSection } from './components/FeaturesSection';
import { LandingCTA } from './components/LandingCTA';
import { LandingFooter } from './components/LandingFooter';

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
            <LandingHeader
                onEnterApp={onEnterApp}
                onOpenAuth={onOpenAuth}
                onBypassAuth={onBypassAuth}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pt-4 pb-20">
                <LandingHero
                    onEnterApp={onEnterApp}
                    onBypassAuth={onBypassAuth}
                />

                <IndustriesSection />

                <FeaturesSection />

                <LandingCTA
                    onEnterApp={onEnterApp}
                    onBypassAuth={onBypassAuth}
                />
            </main>

            <LandingFooter />
        </div>
    );
};
