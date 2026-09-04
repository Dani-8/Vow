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