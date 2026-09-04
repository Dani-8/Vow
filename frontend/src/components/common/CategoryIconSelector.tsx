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
                        className={`w-12 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative select-none ${!hasSelectedIcon
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

                {/* Category Name Input Field (Pic 1 Style) */}
                <div className="relative">
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => onCategoryNameChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-xl neu-input text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* Dropdown / Popover Icon Matrix (Clean Light Neumorphic Style + Bottom Fade Shadow) */}
            {isPopoverOpen && (
                <div className="absolute top-[68px] left-0 z-50 w-72 sm:w-84 p-3.5 neu-card bg-[#E0E5EC] rounded-2xl shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header with Search and Count */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-300/60">
                        <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search icons (e.g. code, dumbbell, book)..."
                                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg neu-input text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-600 neu-badge px-2 py-1 rounded-md shrink-0">
                            {filteredIcons.length}
                        </span>
                    </div>

                    {/* Icon Matrix Container with Bottom Shadow / Fade Gradient Overlay */}
                    <div className="relative">
                        <div className="grid grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1 pr-1.5 pb-6 [scrollbar-width:thin] [scrollbar-color:#a3b1c6_#E0E5EC]">
                            {filteredIcons.map((opt) => {
                                const IconComp = opt.icon;
                                const isSelected = (selectedIconId || '').toLowerCase() === opt.id.toLowerCase();
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => handleSelectIcon(opt.id)}
                                        className={`relative group/btn flex flex-col items-center justify-center p-2 rounded-xl transition-all aspect-square cursor-pointer ${isSelected
                                            ? 'neu-inset text-sky-600 border border-sky-400 font-black shadow-inner'
                                            : 'neu-button text-slate-600 hover:text-slate-900 hover:scale-105'
                                            }`}
                                        title={opt.label}
                                        aria-label={opt.label}
                                    >
                                        <IconComp className="w-4.5 h-4.5 transition-transform group-hover/btn:scale-110" />

                                        {isSelected && (
                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-500 rounded-full flex items-center justify-center shadow-xs">
                                                <Check className="w-1.5 h-1.5 text-white" strokeWidth={3} />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Bottom Shadow Fade Mask to make bottom icons look elegantly peeked / hidden */}
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-[#E0E5EC] via-[#E0E5EC]/85 to-transparent rounded-b-xl" />
                    </div>

                    {filteredIcons.length === 0 && (
                        <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-1">
                            <HelpCircle className="w-5 h-5 text-slate-400" />
                            <span>No icons match &ldquo;{searchQuery}&rdquo;</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
