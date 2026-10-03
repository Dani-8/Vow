import React from 'react';
import { Link2, X } from 'lucide-react';

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    linkUrl: string;
    linkName: string;
    onChangeUrl: (url: string) => void;
    onChangeName: (name: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
    isOpen,
    onClose,
    linkUrl,
    linkName,
    onChangeUrl,
    onChangeName,
    onSubmit,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl neu-card bg-[#E0E5EC] p-6 space-y-4 shadow-2xl border border-white/60">
                <div className="flex items-center justify-between pb-2 border-b border-[#c8d0e0]">
                    <div className="flex items-center space-x-2">
                        <Link2 className="w-4 h-4 text-sky-600" />
                        <h3 className="text-sm font-black text-[#1a1c35]">
                            Attach Reference Link
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg neu-button text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
