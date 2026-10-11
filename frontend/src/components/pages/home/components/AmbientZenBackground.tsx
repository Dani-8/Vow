import React, { useState, useEffect } from 'react';

// Palette including user colors:
export const ZEN_PALETTE = [
    '#549acb', // sky blue
    '#10b981', // emerald
    '#818cf8', // soft violet
    '#f2b040', // amber
    '#df7fac', // pink
    '#ec9372', // orange
    '#ee6881', // red
];

interface FloatingOrb {
    id: number;
    color: string;
    size: number;
    top: number;
    left: number;
    opacity: number;
    duration: number;
    scale: number;
}

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomBetween = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// Divide screen into 6 distinct spawn regions so orbs are well-spaced and don't clump together
const REGION_BOUNDS = [
    { minTop: 5, maxTop: 40, minLeft: 5, maxLeft: 30 },   // Top-Left
    { minTop: 5, maxTop: 35, minLeft: 40, maxLeft: 70 },  // Top-Center
    { minTop: 10, maxTop: 45, minLeft: 70, maxLeft: 92 }, // Top-Right
    { minTop: 55, maxTop: 90, minLeft: 5, maxLeft: 30 },  // Bottom-Left
    { minTop: 60, maxTop: 92, minLeft: 38, maxLeft: 68 }, // Bottom-Center
    { minTop: 55, maxTop: 90, minLeft: 70, maxLeft: 92 }, // Bottom-Right
];

const generateInitialOrbs = (): FloatingOrb[] => {
    return REGION_BOUNDS.map((bound, i) => ({
        id: i,
        color: ZEN_PALETTE[i % ZEN_PALETTE.length],
        size: getRandomBetween(250, 420),
        top: getRandomBetween(bound.minTop, bound.maxTop),
        left: getRandomBetween(bound.minLeft, bound.maxLeft),
        opacity: getRandomBetween(16, 28) / 100,
        duration: getRandomBetween(7, 14),
        scale: getRandomBetween(90, 120) / 100,
    }));
};

export const AmbientZenBackground: React.FC = () => {
    const [orbs, setOrbs] = useState<FloatingOrb[]>(() => generateInitialOrbs());

    useEffect(() => {
        const interval = setInterval(() => {
            setOrbs((prevOrbs) =>
                prevOrbs.map((orb, index) => {
                    const shouldMove = Math.random() > 0.2;
                    if (!shouldMove) return orb;

                    const bound = REGION_BOUNDS[index % REGION_BOUNDS.length];
                    // Pick a fresh random coordinate within its home zone with gentle freedom jitter
                    const jitterTop = getRandomBetween(-10, 10);
                    const jitterLeft = getRandomBetween(-10, 10);

                    const targetTop = Math.max(3, Math.min(94, getRandomBetween(bound.minTop, bound.maxTop) + jitterTop));
                    const targetLeft = Math.max(3, Math.min(94, getRandomBetween(bound.minLeft, bound.maxLeft) + jitterLeft));

                    return {
                        ...orb,
                        color: Math.random() > 0.35 ? getRandomItem(ZEN_PALETTE) : orb.color,
                        top: targetTop,
                        left: targetLeft,
                        size: getRandomBetween(240, 440),
                        opacity: getRandomBetween(14, 30) / 100,
                        duration: getRandomBetween(6, 15),
                        scale: getRandomBetween(85, 125) / 100,
                    };
                })
            );
        }, 4000);

        return () => clearInterval(interval);
    }, []);