import React, { useState, useMemo } from 'react';
import { Challenge, ChallengeLog } from '../../../types';
import { LogChallengeDayModal } from './components/LogChallengeDayModal';
import { CreateChallengeModal } from './components/CreateChallengeModal';
import { DeleteChallengeModal } from './components/DeleteChallengeModal';
import { ChallengeDetailHeader } from './components/ChallengeDetailHeader';
import { ChallengeProgressMatrix } from './components/ChallengeProgressMatrix';
import { ChallengeRulesAndTags } from './components/ChallengeRulesAndTags';
import { ChallengeReflectionFeed } from './components/ChallengeReflectionFeed';

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
        }
    ) => Promise<void>;
    onDeleteLog: (challengeId: string, logId: string) => Promise<void>;
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
}) => {
    const accentColor = getAccentColor(challenge);
    const [selectedDayForModal, setSelectedDayForModal] = useState<{
        dayNumber: number;
        dateStr: string;
        existingLog?: ChallengeLog | null;
    } | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Calculate current elapsed days since startDate
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
    } = useMemo(() => {
        const start = new Date(challenge.startDate || new Date());
        const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const nowMidnight = new Date();
        nowMidnight.setHours(0, 0, 0, 0);

        const diffMs = nowMidnight.getTime() - startMidnight.getTime();
        const daysDiff = Math.floor(diffMs / 86400000);
        const upcoming = daysDiff < 0;
        const untilStart = upcoming ? Math.abs(daysDiff) : 0;
        const currentDay = upcoming ? 0 : Math.min(challenge.targetDays, daysDiff + 1);

        const targetEnd = new Date(challenge.targetEndDate || start.getTime() + challenge.targetDays * 86400000);

        const completed = challenge.logs.filter((l) => l.status === 'completed').length;
        const rate = Math.round((completed / challenge.targetDays) * 100);
        const remaining = Math.max(0, challenge.targetDays - completed);

        // Calculate consecutive completed streak
        let currentStreak = 0;
        if (!upcoming && currentDay >= 1) {
            const todayLog = challenge.logs.find((l) => Number(l.dayNumber) === currentDay);
            let checkDay = todayLog?.status === 'completed' ? currentDay : currentDay - 1;
            while (checkDay >= 1) {
                const log = challenge.logs.find((l) => Number(l.dayNumber) === checkDay);
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
        };
    }, [challenge]);

    // Build the 7-row calendar grid for the total challenge duration
    const gridWeeks = useMemo(() => {
        const totalDays = challenge.targetDays;
        const weeks: {
            weekIndex: number;
            days: ({
                dayNumber: number;
                date: Date;
                dateStr: string;
                dayOfWeek: number; // 0=Mon, 6=Sun
                log?: ChallengeLog;
                isToday: boolean;
                isPast: boolean;
                isFuture: boolean;
            } | null)[];
        }[] = [];

        // Figure out starting day of week (Monday as index 0)
        const startDayOfWeek = (startDateObj.getDay() + 6) % 7;

        let currentWeekDays: any[] = [];
        let weekIndex = 1;

        // Pad first week if start day is not Monday
        for (let p = 0; p < startDayOfWeek; p++) {
            currentWeekDays.push(null);
        }

        for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
            const dayDate = new Date(startDateObj.getTime() + (dayNum - 1) * 86400000);
            const dateStr = dayDate.toISOString().split('T')[0];
            const log = challenge.logs.find((l) => Number(l.dayNumber) === dayNum);

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
    }, [challenge, startDateObj, currentDayNumber, isUpcoming]);

    // Today's log if present
    const todayLog = challenge.logs.find((l) => Number(l.dayNumber) === currentDayNumber);

    const handleOpenDayModal = (dayNumber: number, dateStr: string, log?: ChallengeLog) => {
        setSelectedDayForModal({
            dayNumber,
            dateStr,
            existingLog: log || null,
        });
    };

    const challengeId = challenge.id || challenge._id;

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-12">
            {/* Top Navigation & Challenge Header Card */}
            <ChallengeDetailHeader
                challenge={challenge}
                accentColor={accentColor}
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
                            challenge.logs.find((l) => Number(l.dayNumber) === 1)
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
                        accentColor={accentColor}
                        onEdit={() => setIsEditModalOpen(true)}
                    />
                </div>

                {/* Right Column: Daily Reflection Logs Feed */}
                <div className="lg:col-span-4 space-y-4">
                    <ChallengeReflectionFeed
                        logs={challenge.logs}
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

            {/* Log Modal */}
            {selectedDayForModal && (
                <LogChallengeDayModal
                    isOpen={true}
                    onClose={() => setSelectedDayForModal(null)}
                    dayNumber={selectedDayForModal.dayNumber}
                    dateStr={selectedDayForModal.dateStr}
                    existingLog={selectedDayForModal.existingLog}
                    onSaveLog={async (logData) => {
                        await onLogDay(challengeId, logData);
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
