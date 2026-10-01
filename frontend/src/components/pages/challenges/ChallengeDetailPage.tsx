import React, { useState, useMemo, useEffect } from 'react';
import { Trophy, Sparkles, RotateCcw, CheckCircle2, ArrowRight, Star, Flame, Calendar, Award } from 'lucide-react';
import { Challenge, ChallengeLog, ChallengeSprint, SprintRetrospective } from '../../../types';
import { ChallengeDetailHeader } from './components/detail/ChallengeDetailHeader';
import { ChallengeProgressMatrix } from './components/detail/ChallengeProgressMatrix';
import { ChallengeRulesAndTags } from './components/detail/ChallengeRulesAndTags';
import { ChallengeReflectionFeed } from './components/detail/ChallengeReflectionFeed';
import { SprintPhaseNavigator } from './components/detail/SprintPhaseNavigator';
import { SprintRetrospectiveBanner } from './components/detail/SprintRetrospectiveBanner';
import { LogChallengeDayModal } from './components/detail/LogChallengeDayModal';
import { CompleteSprintModal } from './components/detail/CompleteSprintModal';
import { StartNextSprintModal } from './components/detail/StartNextSprintModal';
import { CreateChallengeModal } from './components/shared/CreateChallengeModal';
import { DeleteChallengeModal } from './components/shared/DeleteChallengeModal';

interface ChallengeDetailPageProps {
    challenge: Challenge;
    onBack: () => void;
    onUpdateChallenge: (id: string, updates: Partial<Challenge>) => Promise<void>;
    onDeleteChallenge: (id: string) => Promise<void>;
    onLogDay: (
        id: string,
        logData: {
            dayNumber: number;
            date?: string;
            status?: 'completed' | 'rest' | 'missed';
            note?: string;
            timeSpent?: string;
            imageUrl?: string;
            sprintId?: string;
        }
    ) => Promise<void>;
    onDeleteLog: (challengeId: string, logId: string) => Promise<void>;
    onStartNextSprint?: (
        challengeId: string,
        sprintData: {
            title: string;
            targetDays: number;
            startDate: string;
            targetEndDate?: string;
            rule?: string;
            consequencesOfSkipping?: string[];
            consequenceOfSkipping?: string;
        }
    ) => Promise<void>;
    onCompleteSprint?: (
        challengeId: string,
        sprintId: string,
        retrospective: SprintRetrospective,
        markChallengeCompleted?: boolean
    ) => Promise<void>;
    onUpdateSprintRule?: (challengeId: string, sprintId: string, rule: string) => Promise<void>;
}

const getAccentColor = (challenge?: Partial<Challenge>): string => {
    if (!challenge?.color) return '#549acb';
    if (challenge.color.startsWith('#')) return challenge.color;
    const map: Record<string, string> = {
        purple: '#8b5cf6',
        blue: '#549acb',
        indigo: '#6366f1',
        emerald: '#10b981',
        amber: '#f59e0b',
        rose: '#f43f5e',
        cyan: '#06b6d4',
    };
    return map[challenge.color] || '#549acb';
};

export const ChallengeDetailPage: React.FC<ChallengeDetailPageProps> = ({
    challenge,
    onBack,
    onUpdateChallenge,
    onDeleteChallenge,
    onLogDay,
    onDeleteLog,
    onStartNextSprint,
    onCompleteSprint,
    onUpdateSprintRule,
}) => {
    const accentColor = getAccentColor(challenge);
    const challengeId = challenge.id || challenge._id;

    // Sprint/Phase state - Ensure there is always at least Phase 1
    const sprints = useMemo(() => {
        if (challenge.sprints && challenge.sprints.length > 0) {
            return challenge.sprints;
        }
        const defaultSprint: ChallengeSprint = {
            id: `sprint-${challenge.id || challenge._id || 'init'}-1`,
            phaseNumber: 1,
            title: `${challenge.title} (Phase 1)`,
            targetDays: challenge.targetDays || 30,
            startDate: challenge.startDate || new Date().toISOString(),
            targetEndDate: challenge.targetEndDate,
            rule: challenge.rule,
            status: challenge.status || 'active',
            logs: challenge.logs || [],
            createdAt: challenge.createdAt || new Date().toISOString(),
            updatedAt: challenge.updatedAt || new Date().toISOString(),
        };
        return [defaultSprint];
    }, [challenge]);

    const isChallengeCompleted =
        challenge.status === 'completed' ||
        (sprints.length > 0 && sprints.every((s) => s.status === 'completed'));

    const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>(
        challenge.currentSprintId || (sprints.length > 0 ? sprints[sprints.length - 1].id : undefined)
    );

    // Keep selectedSprintId synchronized whenever the challenge or its sprints change
    useEffect(() => {
        if (challenge.currentSprintId && sprints.some((s) => s.id === challenge.currentSprintId)) {
            setSelectedSprintId(challenge.currentSprintId);
        } else if (sprints.length > 0) {
            if (!selectedSprintId || !sprints.some((s) => s.id === selectedSprintId)) {
                const active = sprints.find((s) => s.status === 'active');
                setSelectedSprintId(active ? active.id : sprints[sprints.length - 1].id);
            }
        }
    }, [challenge.id, challenge._id, challenge.currentSprintId, sprints]);

    const activeSprint = useMemo(() => {
        if (!sprints || sprints.length === 0) return null;
        if (selectedSprintId) {
            return sprints.find((s) => s.id === selectedSprintId) || sprints[sprints.length - 1];
        }
        return sprints[sprints.length - 1];
    }, [sprints, selectedSprintId]);

    // Modals
    const [selectedDayForModal, setSelectedDayForModal] = useState<{
        dayNumber: number;
        dateStr: string;
        existingLog?: ChallengeLog | null;
    } | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isStartSprintModalOpen, setIsStartSprintModalOpen] = useState(false);
    const [sprintToComplete, setSprintToComplete] = useState<ChallengeSprint | null>(null);

    // Overall totals across entire challenge
    const totalChallengeCompletedDays = useMemo(() => {
        const allLogs = challenge.logs || [];
        return allLogs.filter((l) => l.status === 'completed').length;
    }, [challenge.logs]);

    const totalPhasesCompletedCount = useMemo(() => {
        return sprints.filter((s) => s.status === 'completed').length;
    }, [sprints]);

    // Calculate elapsed days and stats scoped to the active phase/sprint
    const {
        currentDayNumber,
        isUpcoming,
        daysUntilStart,
        startDateObj,
        targetEndDateObj,
        completedDaysCount,
        successRate,
        remainingDays,
        streak,
        phaseTargetDays,
        phaseLogs,
    } = useMemo(() => {
        const targetDays = activeSprint?.targetDays || challenge.targetDays;
        const start = new Date(activeSprint?.startDate || challenge.startDate || new Date());
        const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const nowMidnight = new Date();
        nowMidnight.setHours(0, 0, 0, 0);

        const diffMs = nowMidnight.getTime() - startMidnight.getTime();
        const daysDiff = Math.floor(diffMs / 86400000);
        const upcoming = daysDiff < 0;
        const untilStart = upcoming ? Math.abs(daysDiff) : 0;
        const currentDay = upcoming ? 0 : Math.min(targetDays, daysDiff + 1);

        const targetEnd = new Date(
            activeSprint?.targetEndDate || challenge.targetEndDate || start.getTime() + targetDays * 86400000
        );

        // Get logs for this phase
        const currentPhaseLogs = activeSprint?.logs && activeSprint.logs.length > 0
            ? activeSprint.logs
            : (activeSprint?.phaseNumber === 1 || !activeSprint)
                ? challenge.logs || []
                : activeSprint?.logs || [];

        const completed = currentPhaseLogs.filter((l) => l.status === 'completed').length;
        const rate = targetDays > 0 ? Math.round((completed / targetDays) * 100) : 0;
        const remaining = Math.max(0, targetDays - completed);

        // Calculate consecutive completed streak
        let currentStreak = 0;
        if (!upcoming && currentDay >= 1) {
            const todayLog = currentPhaseLogs.find((l) => Number(l.dayNumber) === currentDay);
            let checkDay = todayLog?.status === 'completed' ? currentDay : currentDay - 1;
            while (checkDay >= 1) {
                const log = currentPhaseLogs.find((l) => Number(l.dayNumber) === checkDay);
                if (log?.status === 'completed') {
                    currentStreak++;
                    checkDay--;
                } else if (log?.status === 'rest') {
                    checkDay--;
                } else {
                    break;
                }
            }
        }

        return {
            currentDayNumber: currentDay,
            isUpcoming: upcoming,
            daysUntilStart: untilStart,
            startDateObj: start,
            targetEndDateObj: targetEnd,
            completedDaysCount: completed,
            successRate: rate,
            remainingDays: remaining,
            streak: currentStreak,
            phaseTargetDays: targetDays,
            phaseLogs: currentPhaseLogs,
        };
    }, [challenge, activeSprint]);

    // Build the 7-row calendar grid for the selected phase duration
    const gridWeeks = useMemo(() => {
        const totalDays = phaseTargetDays;
        const weeks: {
            weekIndex: number;
            days: ({
                dayNumber: number;
                date: Date;
                dateStr: string;
                dayOfWeek: number;
                log?: ChallengeLog;
                isToday: boolean;
                isPast: boolean;
                isFuture: boolean;
            } | null)[];
        }[] = [];

        const startDayOfWeek = (startDateObj.getDay() + 6) % 7;

        let currentWeekDays: any[] = [];
        let weekIndex = 1;

        for (let p = 0; p < startDayOfWeek; p++) {
            currentWeekDays.push(null);
        }

        for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
            const dayDate = new Date(startDateObj.getTime() + (dayNum - 1) * 86400000);
            const dateStr = dayDate.toISOString().split('T')[0];
            const log = phaseLogs.find((l) => Number(l.dayNumber) === dayNum);

            const isToday = !isUpcoming && dayNum === currentDayNumber;
            const isPast = !isUpcoming && dayNum < currentDayNumber;
            const isFuture = isUpcoming || dayNum > currentDayNumber;

            currentWeekDays.push({
                dayNumber: dayNum,
                date: dayDate,
                dateStr,
                dayOfWeek: (dayDate.getDay() + 6) % 7,
                log,
                isToday,
                isPast,
                isFuture,
            });

            if (currentWeekDays.length === 7) {
                weeks.push({
                    weekIndex,
                    days: currentWeekDays,
                });
                currentWeekDays = [];
                weekIndex++;
            }
        }

        if (currentWeekDays.length > 0) {
            while (currentWeekDays.length < 7) {
                currentWeekDays.push(null);
            }
            weeks.push({
                weekIndex,
                days: currentWeekDays,
            });
        }

        return weeks;
    }, [phaseTargetDays, phaseLogs, startDateObj, currentDayNumber, isUpcoming]);