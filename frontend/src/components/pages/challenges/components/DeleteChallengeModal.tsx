import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    challengeTitle: string;
    isDeleting?: boolean;
}

export const DeleteChallengeModal: React.FC<DeleteChallengeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    challengeTitle,
    isDeleting = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="neu-card w-full max-w-md p-6 bg-[#E0E5EC] relative space-y-4">
                <button
                    onClick={onClose}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35] disabled:opacity-50"
                    title="Cancel"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-rose-600 bg-rose-50/80 shadow-sm shrink-0">
                        <AlertTriangle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#1a1c35]">Delete Challenge?</h3>
                        <p className="text-xs font-semibold text-[#717699]">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="neu-inset p-3.5 rounded-xl bg-[#E0E5EC]/80 text-xs font-medium text-slate-700">
                    Are you sure you want to delete <strong className="text-slate-900 font-bold">&quot;{challengeTitle}&quot;</strong>? All associated daily logs, reflection notes, and progress history will be permanently removed.
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="neu-button px-4 py-2.5 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35] disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="neu-button px-5 py-2.5 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md flex items-center space-x-2 disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>{isDeleting ? 'Deleting...' : 'Delete Challenge'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
