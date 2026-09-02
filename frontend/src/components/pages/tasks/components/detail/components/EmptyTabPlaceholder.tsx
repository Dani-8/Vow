import React from 'react';
import { PackageOpen, Sparkles, Construction, Layers } from 'lucide-react';

interface EmptyTabPlaceholderProps {
    tabName: string;
}

export const EmptyTabPlaceholder: React.FC<EmptyTabPlaceholderProps> = ({ tabName }) => {
    const tabDetails: Record<string, { icon: React.ReactNode; title: string; subtitle: string }> = {
        overview: {
            icon: <Layers className="w-10 h-10 text-[#549acb]" />,
            title: 'Task Overview Workspace',
            subtitle: "We're crafting an interactive goal canvas & performance metrics view for this workspace.",
        },
        notes: {
            icon: <PackageOpen className="w-10 h-10 text-[#549acb]" />,
            title: 'Notes & Growth Journal',
            subtitle: "We're currently building a rich Markdown note editor and reflection space for your task.",
        },
        files: {
            icon: <PackageOpen className="w-10 h-10 text-[#549acb]" />,
            title: 'Resource Vault & Attachments',
            subtitle: "We're engineering an encrypted document & attachment sync feature for this section.",
        },
        activity: {
            icon: <Construction className="w-10 h-10 text-[#549acb]" />,
            title: 'Audit Trail & Activity Log',
            subtitle: "We're assembling a real-time timeline history and streak checkpoint monitor for your goals.",
        },
    };

    const current = tabDetails[tabName.toLowerCase()] || {
        icon: <PackageOpen className="w-10 h-10 text-[#549acb]" />,
        title: `${tabName} Space`,
        subtitle: "This module is currently being built for your growth workspace.",
    };

    return (
        <div className="neu-card p-12 text-center flex flex-col items-center justify-center my-4 min-h-[340px]">
            {/* Neumorphic Empty Box Icon Container */}
            <div className="w-20 h-20 rounded-3xl neu-button flex items-center justify-center mb-5 bg-[#E0E5EC] shadow-md">
                {current.icon}
            </div>

            <h3 className="text-xl font-extrabold text-[#1a1c35] mb-2 tracking-tight">
                {current.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#717699] max-w-md leading-relaxed font-medium mb-6">
                {current.subtitle}
            </p>

            <div className="neu-inset px-4 py-2 rounded-xl inline-flex items-center space-x-2 text-xs font-semibold text-[#549acb]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                <span>Feature under active development</span>
            </div>
        </div>
    );
};
