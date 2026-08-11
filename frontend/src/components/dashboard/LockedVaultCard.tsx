import React from 'react';
import { Lock } from 'lucide-react';

interface LockedVaultCardProps {
  onEnterPin: () => void;
}

export const LockedVaultCard: React.FC<LockedVaultCardProps> = ({ onEnterPin }) => {
  return (
    <div className="neu-card p-12 text-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-3xl neu-button flex items-center justify-center text-purple-600 bg-purple-50 mx-auto mb-4">
        <Lock className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-extrabold text-[#1a1c35]">
        Personal Growth Vault Locked
      </h3>

      <p className="text-xs text-[#717699] mt-2 leading-relaxed">
        This area is protected by your independent secondary PIN for private goals.
      </p>

      <button
        onClick={onEnterPin}
        className="mt-6 neu-button-primary px-6 py-2.5 rounded-xl text-sm font-bold"
      >
        Enter Vault PIN
      </button>
    </div>
  );
};
