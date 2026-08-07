import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, X, ShieldCheck } from 'lucide-react';
import { api } from '../api';

interface PrivatePinModalProps {
    isOpen: boolean;
    hasPinSet: boolean;
    onClose: () => void;
    onSuccessUnlocked: () => void;
}

export const PrivatePinModal: React.FC<PrivatePinModalProps> = ({
    isOpen,
    hasPinSet,
    onClose,
    onSuccessUnlocked,
}) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (pin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }

        try {
            setLoading(true);

            if (!hasPinSet) {
                if (pin !== confirmPin) {
                    setError('PINs do not match');
                    setLoading(false);
                    return;
                }
                await api.setPin(pin);
                onSuccessUnlocked();
                onClose();
            } else {
                await api.verifyPin(pin);
                onSuccessUnlocked();
                onClose();
            }
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="neu-card w-full max-w-md p-6 bg-[#E0E5EC] relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl neu-button flex items-center justify-center bg-[#6D5DFC] text-white shadow-lg mb-3">
                        <Lock className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-extrabold text-[#1a1c35]">
                        {hasPinSet ? 'Growth Vault Locked' : 'Set Up Vault PIN'}
                    </h2>
                    <p className="text-xs text-[#717699] max-w-xs mt-1 font-medium">
                        {hasPinSet
                            ? 'Enter your independent secondary PIN to access confidential personal growth goals.'
                            : 'Create a secondary 4-digit PIN to safeguard your personal growth goals.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 text-center">
                            {hasPinSet ? 'Enter Vault PIN' : 'New 4-Digit PIN'}
                        </label>
                        <input
                            type="password"
                            maxLength={8}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="••••"
                            className="w-full px-4 py-3 rounded-xl neu-input text-center text-xl font-extrabold tracking-widest text-slate-800"
                            autoFocus
                            required
                        />
                    </div>

                    {!hasPinSet && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 text-center">
                                Confirm PIN
                            </label>
                            <input
                                type="password"
                                maxLength={8}
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value)}
                                placeholder="••••"
                                className="w-full px-4 py-3 rounded-xl neu-input text-center text-xl font-extrabold tracking-widest text-slate-800"
                                required
                            />
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl neu-button-primary font-bold text-sm flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            <span>{loading ? 'Verifying...' : hasPinSet ? 'Unlock Personal Vault' : 'Save PIN & Unlock'}</span>
                        </button>
                    </div>
                </form>

                {hasPinSet && (
                    <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                        <span className="text-[11px] text-slate-400">
                            Demo Account Vault PIN is <strong className="text-slate-600">1234</strong>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
