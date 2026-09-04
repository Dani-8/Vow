import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { TaskMap, MapAccentColor } from '../types';
import { CategoryIconSelector } from '../../../common/CategoryIconSelector';

interface EditMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    map: TaskMap | null;
    onUpdateMap: (updatedMap: TaskMap) => void;
}

const COLORS: { key: MapAccentColor; name: string; bg: string; ring: string }[] = [
    { key: 'purple', name: 'Purple', bg: 'bg-purple-500', ring: 'ring-purple-500' },
    { key: 'emerald', name: 'Emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
    { key: 'amber', name: 'Amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
    { key: 'rose', name: 'Rose', bg: 'bg-rose-500', ring: 'ring-rose-500' },
    { key: 'sky', name: 'Sky Blue', bg: 'bg-sky-500', ring: 'ring-sky-500' },
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

export const EditMapModal: React.FC<EditMapModalProps> = ({
    isOpen,
    onClose,
    map,
    onUpdateMap,
}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState<MapAccentColor>('purple');
    const [isPrimary, setIsPrimary] = useState(false);

    useEffect(() => {
        if (map) {
            setName(map.name || '');
            setCategory(map.category || '');
            setSelectedIcon(map.icon || '');
            setDescription(map.description || '');
            setSelectedColor(map.color || 'purple');
            setIsPrimary(!!map.isPrimary);
        }
    }, [map, isOpen]);

    if (!isOpen || !map) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const updated: TaskMap = {
            ...map,
            name: name.trim(),
            description: description.trim(),
            category: category.trim() || undefined,
            icon: selectedIcon || undefined,
            color: selectedColor,
            isPrimary,
            updatedAt: 'Just now',
        };

        onUpdateMap(updated);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="neu-card w-full max-w-md p-6 rounded-3xl space-y-6 relative border border-white/80 bg-[#E0E5EC] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-300/60">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl neu-inset p-2 flex items-center justify-center text-[#549acb]">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-[#1a1c35]">Edit Task Map</h2>
                            <p className="text-xs text-[#717699] font-medium">Update roadmap settings, category & icon</p>
                        </div>
                    </div>