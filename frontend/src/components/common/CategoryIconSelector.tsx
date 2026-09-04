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