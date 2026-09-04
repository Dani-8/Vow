import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Search, Check, HelpCircle } from 'lucide-react';
import { CATEGORY_ICON_OPTIONS, CategoryIconOption } from './categoryIcons';

interface CategoryIconSelectorProps {
    categoryName: string;
    onCategoryNameChange: (name: string) => void;
    selectedIconId?: string;
    onSelectIcon: (iconId: string) => void;
    placeholder?: string;
    accentColor?: string;
}

export const CategoryIconSelector: React.FC<CategoryIconSelectorProps> = ({
    categoryName,
    onCategoryNameChange,
    selectedIconId,
    onSelectIcon,
    placeholder = 'e.g. Engineering, Coding, Fitness...',
    accentColor = '#549acb',
}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const hasSelectedIcon = Boolean(selectedIconId);

    const currentIconOption = CATEGORY_ICON_OPTIONS.find(
        (opt) => opt.id.toLowerCase() === (selectedIconId || '').toLowerCase()
    );

    const SelectedIconComponent = currentIconOption ? currentIconOption.icon : null;

    // Filter icons by search query
    const filteredIcons = CATEGORY_ICON_OPTIONS.filter((opt) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            opt.label.toLowerCase().includes(q) ||
            opt.id.toLowerCase().includes(q) ||
            (opt.categoryGroup && opt.categoryGroup.toLowerCase().includes(q))
        );
    });

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsPopoverOpen(false);
            }
        };

        if (isPopoverOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopoverOpen]);

    const handleSelectIcon = (iconId: string) => {
        onSelectIcon(iconId);
        setIsPopoverOpen(false);
    };

    return (
        <div ref={containerRef} className="space-y-1.5 relative">
            {/* Field Labels Row */}
            <div className="grid grid-cols-[56px_1fr] gap-3 items-center">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 text-center">
                    Icon
                </label>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    Category Name
                </label>
            </div>

            {/* Input Row: Icon Button + Category Name Input */}
            <div className="grid grid-cols-[56px_1fr] gap-3 items-center">
                {/* Glowing / Interactive Icon Picker Button (Pic 1 Style) */}
                <div className="relative flex justify-center">
                    <button
                        type="button"
                        onClick={() => setIsPopoverOpen((prev) => !prev)}
                        className={`w-12 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative select-none ${
                            !hasSelectedIcon
                                ? 'neu-button bg-[#E0E5EC] border-2 neu-icon-glow-pulse'
                                : isPopoverOpen
                                    ? 'neu-inset bg-[#E0E5EC] border-2 border-sky-500 shadow-inner'
                                    : 'neu-button bg-[#E0E5EC] border border-white/80 hover:border-sky-400/60 hover:scale-105'
                        }`}
                        title={hasSelectedIcon ? `Selected icon: ${currentIconOption?.label}` : 'Click to pick an icon'}
                        style={
                            hasSelectedIcon
                                ? { color: accentColor }
                                : undefined
                        }
                    >
                        {SelectedIconComponent ? (
                            <SelectedIconComponent className="w-5 h-5 transition-transform" />
                        ) : null}
                    </button>
                </div>