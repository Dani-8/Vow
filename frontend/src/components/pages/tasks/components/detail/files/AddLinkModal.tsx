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

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#4a4e69]">
                            Resource URL *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="https://figma.com/..., https://github.com/..."
                            value={linkUrl}
                            onChange={(e) => onChangeUrl(e.target.value)}
                            className="w-full p-2.5 rounded-xl neu-inset bg-[#dbe2ed]/60 text-xs font-medium text-[#1a1c35] focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#4a4e69]">
                            Display Title (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Design Specs, API Documentation"
                            value={linkName}
                            onChange={(e) => onChangeName(e.target.value)}
                            className="w-full p-2.5 rounded-xl neu-inset bg-[#dbe2ed]/60 text-xs font-medium text-[#1a1c35] focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl neu-button text-xs font-bold text-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!linkUrl.trim()}
                            className="px-4 py-2 rounded-xl neu-button-primary text-xs font-bold text-white disabled:opacity-50"
                        >
                            Attach Resource
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
