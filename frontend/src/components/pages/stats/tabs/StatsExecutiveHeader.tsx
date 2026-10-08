import React from 'react';
import { ShieldCheck, Flame, Sparkles, Trophy } from 'lucide-react';
import { EcosystemOverview } from '../statsHelpers';

interface StatsExecutiveHeaderProps {
    overview: EcosystemOverview;
}

export const StatsExecutiveHeader: React.FC<StatsExecutiveHeaderProps> = ({ overview }) => {
    const { consistencyScore, consistencyGrade, activeDaysLast30, masterStreak, bestMasterStreak } = overview;
