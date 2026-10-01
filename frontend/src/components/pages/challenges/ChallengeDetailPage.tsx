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
