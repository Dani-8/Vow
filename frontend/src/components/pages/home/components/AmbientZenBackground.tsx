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
