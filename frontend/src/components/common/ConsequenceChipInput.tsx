import React, { useState, KeyboardEvent } from 'react';
import { Flame, Plus, X, AlertCircle } from 'lucide-react';

interface ConsequenceChipInputProps {
    consequences: string[];
    onChange: (consequences: string[]) => void;
    placeholder?: string;
    label?: string;
    maxItems?: number;
}

export const ConsequenceChipInput: React.FC<ConsequenceChipInputProps> = ({
    consequences = [],
    onChange,
    placeholder = 'e.g., "If I skip, I\'ll stay stuck in tutorial hell for another 3 months and lose my transition momentum."',
    label = 'Consequences of Skipping',
    maxItems = 8,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState<string | null>(null);

    const handleAdd = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        if (consequences.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
            setInputError('This consequence is already added.');
            return;
        }

        if (consequences.length >= maxItems) {
            setInputError(`Maximum ${maxItems} consequences allowed.`);
            return;
        }

        setInputError(null);
        onChange([...consequences, trimmed]);
        setInputValue('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (indexToRemove: number) => {
        onChange(consequences.filter((_, idx) => idx !== indexToRemove));
        setInputError(null);
    };

    return (
        <div className="space-y-2.5">
            {/* Header & Meta */}
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center space-x-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{label}</span>
                </label>
                <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold text-rose-600/90 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
                        Cost of Inaction
                    </span>
                    {consequences.length > 0 && (
                        <span className="text-[10px] font-extrabold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded-md">
                            {consequences.length} {consequences.length === 1 ? 'stake' : 'stakes'}
                        </span>
                    )}
                </div>
            </div>

            {/* Main Container */}
            <div className="neu-card p-3 bg-[#E0E5EC] rounded-xl border border-rose-200/70 space-y-2.5">
                {/* Active Chips List */}
                {consequences.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                        {consequences.map((stake, idx) => (
                            <div
                                key={idx}
                                className="group relative flex items-start space-x-1.5 bg-gradient-to-r from-rose-50 to-amber-50/70 border border-rose-200/80 text-rose-950 text-xs font-medium px-2.5 py-1.5 rounded-xl shadow-xs animate-in fade-in zoom-in-95 duration-150 max-w-full"
                            >
                                <Flame className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                <span className="break-words leading-tight flex-1 text-[11px] font-semibold pr-1">
                                    {stake}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(idx)}
                                    className="p-0.5 rounded-md text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors shrink-0"
                                    title="Remove consequence"
                                    aria-label="Remove consequence"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Input with + Add Button Below */}
                <div className="space-y-2">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                if (inputError) setInputError(null);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={consequences.length === 0 ? placeholder : 'Add another consequence (press Enter)...'}
                            className="w-full px-3.5 py-2.5 rounded-xl neu-input text-xs font-medium text-slate-800 placeholder:text-slate-400 border-rose-200/80 focus:border-rose-400"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                        <div className="text-[10px] font-medium text-slate-500">
                            <span>Press <strong className="font-bold text-slate-700">Enter</strong> to add quickly</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!inputValue.trim()}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
                                inputValue.trim()
                                    ? 'neu-button text-rose-700 bg-rose-50 hover:bg-rose-100 shadow-sm cursor-pointer hover:scale-105 active:scale-95'
                                    : 'opacity-50 text-slate-400 cursor-not-allowed bg-slate-100'
                            }`}
                            title="Add consequence"
                        >
                            <Plus className="w-3.5 h-3.5 text-rose-600" />
                            <span>Add Consequence</span>
                        </button>
                    </div>
                </div>

                {inputError && (
                    <div className="flex items-center space-x-1.5 text-[11px] font-medium text-rose-600 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{inputError}</span>
                    </div>
                )}

                <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 pt-0.5 px-0.5">
                    <span>Stakes remind you of the real cost of quitting.</span>
                    <span>Auto-rotates every 8s on detail view</span>
                </div>
            </div>
        </div>
    );
};
