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
