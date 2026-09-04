import React, { useState } from 'react';
import { X, Network, Sparkles, Check } from 'lucide-react';
import { MapAccentColor } from '../types';
import { CategoryIconSelector } from '../../../common/CategoryIconSelector';

interface CreateMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateMap: (
        name: string,
        description: string,
        color: MapAccentColor,
        category?: string,
        icon?: string
    ) => void;
}

const COLORS: { key: MapAccentColor; name: string; bg: string; ring: string }[] = [
    { key: 'purple', name: 'Purple', bg: 'bg-purple-500', ring: 'ring-purple-500' },
    { key: 'emerald', name: 'Emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
    { key: 'amber', name: 'Amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
    { key: 'rose', name: 'Rose', bg: 'bg-rose-500', ring: 'ring-rose-500' },
    { key: 'sky', name: 'Sky', bg: 'bg-[#549acb]', ring: 'ring-[#549acb]' },
    { key: 'indigo', name: 'Indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
];

const COLOR_HEX: Record<MapAccentColor, string> = {
    purple: '#a855f7',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    sky: '#549acb',
    indigo: '#6366f1',
};

export const CreateMapModal: React.FC<CreateMapModalProps> = ({
    isOpen,
    onClose,
    onCreateMap,
}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState<MapAccentColor>('purple');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onCreateMap(
            name.trim(),
            description.trim(),
            selectedColor,
            category.trim() || undefined,
            selectedIcon || undefined
        );
        setName('');
        setCategory('');
        setSelectedIcon('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg neu-card p-6 sm:p-8 rounded-3xl bg-[#E0E5EC] border border-white shadow-2xl space-y-6 relative">
                <div className="flex items-center justify-between pb-3 border-b border-white/60">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center bg-[#549acb] text-white">
                            <Network className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#1a1c35]">Create Task Map</h3>
                            <p className="text-xs text-[#717699] font-medium">
                                Visualize relationships and dependencies
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl neu-button text-[#717699] hover:text-rose-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category & Icon Selector (Glowing Icon Box + Custom Name Field) */}
                    <CategoryIconSelector
                        categoryName={category}
                        onCategoryNameChange={setCategory}
                        selectedIconId={selectedIcon}
                        onSelectIcon={setSelectedIcon}
                        placeholder="e.g. Engineering, Roadmap, Q4 Launch..."
                        accentColor={COLOR_HEX[selectedColor] || '#549acb'}
                    />