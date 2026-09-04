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