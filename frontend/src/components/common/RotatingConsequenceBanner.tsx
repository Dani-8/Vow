import React, { useState, useEffect, useRef } from 'react';
import { Flame, ChevronLeft, ChevronRight, Edit3, Pause, Play, AlertOctagon } from 'lucide-react';

interface RotatingConsequenceBannerProps {
    consequences?: string[] | string;
    consequenceOfSkipping?: string;
    onEdit?: () => void;
    title?: string;
    badgeLabel?: string;
    accentColor?: string;
    rotationIntervalMs?: number; // default 8000ms (8 seconds)
    className?: string;
}

export const RotatingConsequenceBanner: React.FC<RotatingConsequenceBannerProps> = ({
    consequences,
    consequenceOfSkipping,
    onEdit,
    title = 'Consequences of Skipping',
    badgeLabel = 'Cost of Inaction',
    accentColor = '#e11d48',
    rotationIntervalMs = 8000,
    className = '',
}) => {
    // Normalize items into a clean array of strings
    const rawList: string[] = Array.isArray(consequences)
        ? consequences
        : consequences
            ? [consequences]
            : consequenceOfSkipping
                ? consequenceOfSkipping.split('\n').map((s) => s.trim()).filter(Boolean)
                : [];

    const stakes = rawList.filter((s) => typeof s === 'string' && s.trim().length > 0);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressIntervalRef = useRef<any>(null);

    // Keep currentIndex within bounds if stakes length changes
    useEffect(() => {
        if (currentIndex >= stakes.length && stakes.length > 0) {
            setCurrentIndex(0);
        }
    }, [stakes.length, currentIndex]);

    // Timer & Progress handling for 8-second auto-rotation
    useEffect(() => {
        if (stakes.length <= 1 || isHovered) {
            setProgress(0);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            return;
        }

        const stepTime = 100; // update progress every 100ms
        const totalSteps = rotationIntervalMs / stepTime;
        let stepCount = 0;
        setProgress(0);

        progressIntervalRef.current = setInterval(() => {
            stepCount += 1;
            const newProgress = Math.min(100, (stepCount / totalSteps) * 100);
            setProgress(newProgress);

            if (stepCount >= totalSteps) {
                stepCount = 0;
                setProgress(0);
                setCurrentIndex((prev) => (prev + 1) % stakes.length);
            }
        }, stepTime);

        return () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [stakes.length, isHovered, currentIndex, rotationIntervalMs]);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (stakes.length <= 1) return;
        setCurrentIndex((prev) => (prev - 1 + stakes.length) % stakes.length);
        setProgress(0);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (stakes.length <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % stakes.length);
        setProgress(0);
    };

    const handleSelectDot = (idx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(idx);
        setProgress(0);
    };

    // If no consequences are defined
    if (stakes.length === 0) {
        return (
            <div
                onClick={onEdit}
                className={`neu-card p-4 bg-gradient-to-r from-rose-50/40 via-[#E0E5EC] to-amber-50/30 border border-dashed border-rose-200/80 rounded-xl flex items-center justify-between transition-all ${
                    onEdit ? 'cursor-pointer hover:bg-rose-50/60' : ''
                } ${className}`}
            >
                <div className="flex items-center space-x-2.5 text-xs text-rose-800/80">
                    <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-semibold">
                        <strong>Cost of Inaction:</strong> No consequences defined yet. Add what happens if you skip or quit.
                    </span>
                </div>
                {onEdit && (
                    <button
                        type="button"
                        className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline shrink-0 ml-3 flex items-center space-x-1"
                    >
                        <Edit3 className="w-3 h-3" />
                        <span>Define Stakes</span>
                    </button>
                )}
            </div>
        );
    }

    const currentStake = stakes[currentIndex] || stakes[0];

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`neu-card p-4.5 bg-gradient-to-r from-rose-50/90 via-[#E0E5EC] to-amber-50/70 border border-rose-200/80 rounded-xl space-y-2.5 shadow-sm relative overflow-hidden transition-all group ${className}`}
        >
            {/* Top Bar: Header, Badge, Navigation & Edit */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-rose-700">
                    <Flame className="w-4 h-4 fill-rose-500 text-rose-600 animate-pulse shrink-0" />
                    <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider">
                            {title}
                        </span>
                        {stakes.length > 1 && (
                            <span className="text-[10px] font-extrabold text-rose-600/90 bg-rose-100/80 px-1.5 py-0.2 rounded-md">
                                {currentIndex + 1}/{stakes.length}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full neu-inset text-rose-700 bg-rose-100/70 shadow-2xs">
                        {badgeLabel}
                    </span>

                    {/* Navigation Arrows for Multiple Stakes */}
                    {stakes.length > 1 && (
                        <div className="flex items-center space-x-1 bg-white/50 rounded-lg p-0.5 border border-rose-200/60 shadow-2xs">
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="p-1 rounded hover:bg-rose-100/80 text-rose-700 transition-colors"
                                title="Previous consequence"
                                aria-label="Previous consequence"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="p-1 rounded hover:bg-rose-100/80 text-rose-700 transition-colors"
                                title="Next consequence"
                                aria-label="Next consequence"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}</div>