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