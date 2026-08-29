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

    // Today's log for the active phase if present
    const todayLog = phaseLogs.find((l) => Number(l.dayNumber) === currentDayNumber);

    const handleOpenDayModal = (dayNumber: number, dateStr: string, log?: ChallengeLog) => {
        setSelectedDayForModal({
            dayNumber,
            dateStr,
            existingLog: log || null,
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-12">
            {/* Top Navigation & Challenge Header Card */}
            <ChallengeDetailHeader
                challenge={challenge}
                accentColor={accentColor}
                phaseTargetDays={phaseTargetDays}
                onBack={onBack}
                onEdit={() => setIsEditModalOpen(true)}
                onDelete={() => setIsDeleteModalOpen(true)}
                onTogglePause={async () => {
                    const newStatus = challenge.status === 'paused' ? 'active' : 'paused';
                    await onUpdateChallenge(challengeId, { status: newStatus });
                }}
                onCheckIn={() => {
                    if (isUpcoming) {
                        handleOpenDayModal(
                            1,
                            startDateObj.toISOString().split('T')[0],
                            phaseLogs.find((l) => Number(l.dayNumber) === 1)
                        );
                    } else {
                        handleOpenDayModal(
                            currentDayNumber,
                            new Date().toISOString().split('T')[0],
                            todayLog
                        );
                    }
                }}
                isUpcoming={isUpcoming}
                daysUntilStart={daysUntilStart}
                currentDayNumber={currentDayNumber}
                completedDaysCount={completedDaysCount}
                streak={streak}
                remainingDays={remainingDays}
                successRate={successRate}
                startDateObj={startDateObj}
                targetEndDateObj={targetEndDateObj}
                isTodayCompleted={todayLog?.status === 'completed'}
            />

            {/* End-of-Challenge Finale / Victory Celebration Banner */}
            {isChallengeCompleted && (
                <div className="neu-card p-6 sm:p-7 bg-[#E0E5EC] border-2 border-amber-400/80 rounded-2xl space-y-4 shadow-md animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center bg-amber-50 text-amber-500 shadow-sm shrink-0">
                                <Trophy className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full neu-inset text-amber-800 bg-amber-100">
                                        🏆 Challenge Finale Completed!
                                    </span>
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full neu-inset">
                                        {totalPhasesCompletedCount} Phases Mastered
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-[#1a1c35] mt-1">
                                    Outstanding accomplishment! You conquered this challenge.
                                </h3>
                                <p className="text-xs font-bold text-[#717699]">
                                    {totalChallengeCompletedDays} total daily check-ins logged. You can keep pushing forward by launching a bonus sprint.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {challenge.status === 'completed' && (
                                <button
                                    onClick={async () => {
                                        await onUpdateChallenge(challengeId, { status: 'active' });
                                    }}
                                    className="px-3.5 py-2 rounded-xl neu-button text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1.5"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Re-open Challenge</span>
                                </button>
                            )}
                            <button
                                onClick={() => setIsStartSprintModalOpen(true)}
                                className="px-5 py-2.5 rounded-xl neu-button-primary text-xs font-bold text-white shadow-md flex items-center space-x-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Extend / Start Next Sprint</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sprints Navigator */}
            <SprintPhaseNavigator
                sprints={sprints}
                activeSprintId={activeSprint?.id || sprints[0]?.id}
                accentColor={accentColor}
                onSelectSprint={(id) => setSelectedSprintId(id)}
                onCompleteCurrentSprintPrompt={(sprint) => setSprintToComplete(sprint)}
            />

            {/* Retrospective Summary Banner if active phase is completed */}
            {activeSprint && activeSprint.status === 'completed' && activeSprint.retrospective && (
                <SprintRetrospectiveBanner
                    sprint={activeSprint}
                    accentColor={accentColor}
                    onEditRetrospectivePrompt={() => setSprintToComplete(activeSprint)}
                />
            )}

            {/* Main Content 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Progress Matrix & Sub-Cards */}
                <div className="lg:col-span-8 space-y-6">
                    <ChallengeProgressMatrix
                        accentColor={accentColor}
                        gridWeeks={gridWeeks}
                        startDateObj={startDateObj}
                        targetEndDateObj={targetEndDateObj}
                        onOpenDayModal={handleOpenDayModal}
                    />

                    <ChallengeRulesAndTags
                        challenge={challenge}
                        activeSprint={activeSprint}
                        accentColor={accentColor}
                        onEdit={() => setIsEditModalOpen(true)}
                        onUpdateSprintRule={
                            onUpdateSprintRule && activeSprint
                                ? async (newRule) => {
                                      await onUpdateSprintRule(challengeId, activeSprint.id, newRule);
                                  }
                                : undefined
                        }
                    />
                </div>

                {/* Right Column: Daily Reflection Logs Feed */}
                <div className="lg:col-span-4 space-y-4">
                    <ChallengeReflectionFeed
                        logs={phaseLogs}
                        accentColor={accentColor}
                        onOpenDayModal={handleOpenDayModal}
                        onLogFirst={() =>
                            handleOpenDayModal(
                                currentDayNumber,
                                new Date().toISOString().split('T')[0],
                                todayLog
                            )
                        }
                    />
                </div>
            </div>

            {/* Log Day Modal */}
            {selectedDayForModal && (
                <LogChallengeDayModal
                    isOpen={true}
                    onClose={() => setSelectedDayForModal(null)}
                    dayNumber={selectedDayForModal.dayNumber}
                    dateStr={selectedDayForModal.dateStr}
                    existingLog={selectedDayForModal.existingLog}
                    onSaveLog={async (logData) => {
                        await onLogDay(challengeId, {
                            ...logData,
                            sprintId: activeSprint?.id,
                        });
                    }}
                    onDeleteLog={
                        selectedDayForModal.existingLog
                            ? async (logId) => {
                                  await onDeleteLog(challengeId, logId);
                              }
                            : undefined
                    }
                />
            )}

            {/* Complete Sprint Modal */}
            {sprintToComplete && (
                <CompleteSprintModal
                    isOpen={true}
                    onClose={() => setSprintToComplete(null)}
                    sprint={sprintToComplete}
                    accentColor={accentColor}
                    isFinalSprint={
                        sprints.length === 0 ||
                        sprintToComplete.id === sprints[sprints.length - 1].id
                    }
                    onConfirmComplete={async (retro, actionAfter) => {
                        const markChallengeCompleted = actionAfter === 'complete_challenge';
                        if (onCompleteSprint) {
                            await onCompleteSprint(
                                challengeId,
                                sprintToComplete.id,
                                retro,
                                markChallengeCompleted
                            );
                        } else {
                            const updatedSprints = (challenge.sprints || []).map((s) =>
                                s.id === sprintToComplete.id
                                    ? { ...s, status: 'completed' as const, retrospective: retro }
                                    : s
                            );
                            const updates: Partial<Challenge> = { sprints: updatedSprints };
                            if (markChallengeCompleted) {
                                updates.status = 'completed';
                            }
                            await onUpdateChallenge(challengeId, updates);
                        }
                    }}
                    onStartNextSprintPrompt={() => setIsStartSprintModalOpen(true)}
                />
            )}

            {/* Start Next Sprint Modal */}
            {isStartSprintModalOpen && (
                <StartNextSprintModal
                    isOpen={isStartSprintModalOpen}
                    onClose={() => setIsStartSprintModalOpen(false)}
                    challenge={challenge}
                    accentColor={accentColor}
                    onStartSprint={async (sprintData) => {
                        const newSprintId = `sprint_${Date.now()}`;
                        if (onStartNextSprint) {
                            await onStartNextSprint(challengeId, sprintData);
                        } else {
                            const newSprint = {
                                id: newSprintId,
                                phaseNumber: (challenge.sprints?.length || 0) + 1,
                                title: sprintData.title,
                                targetDays: sprintData.targetDays,
                                startDate: sprintData.startDate,
                                targetEndDate: sprintData.targetEndDate,
                                rule: sprintData.rule,
                                status: 'active' as const,
                                logs: [],
                                createdAt: new Date().toISOString(),
                            };
                            await onUpdateChallenge(challengeId, {
                                sprints: [...(challenge.sprints || []), newSprint],
                                currentSprintId: newSprintId,
                                status: 'active',
                            });
                        }
                        // Automatically select the newly started phase
                        setSelectedSprintId(newSprintId);
                    }}
                />
            )}

            {/* Edit Challenge Modal */}
            {isEditModalOpen && (
                <CreateChallengeModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    editingChallenge={challenge}
                    onSubmit={async (updates) => {
                        await onUpdateChallenge(challengeId, updates);
                        setIsEditModalOpen(false);
                    }}
                />
            )}

            {/* Delete Challenge Modal */}
            {isDeleteModalOpen && (
                <DeleteChallengeModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    challengeTitle={challenge.title}
                    isDeleting={isDeleting}
                    onConfirm={async () => {
                        try {
                            setIsDeleting(true);
                            await onDeleteChallenge(challengeId);
                            setIsDeleteModalOpen(false);
                            onBack();
                        } finally {
                            setIsDeleting(false);
                        }
                    }}
                />
            )}
        </div>
    );
};
