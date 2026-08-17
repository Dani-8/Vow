import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { Challenge, User } from '../types';

export function useChallenges(user: User | null) {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchChallenges = useCallback(async () => {
        if (!user) {
            setChallenges([]);
            setSelectedChallenge(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await api.getChallenges();
            if (res && res.challenges) {
                setChallenges(res.challenges);
                // If there's an active selected challenge, keep it synchronized
                if (selectedChallenge) {
                    const updated = res.challenges.find(
                        (c) => (c.id || c._id) === (selectedChallenge.id || selectedChallenge._id)
                    );
                    if (updated) {
                        setSelectedChallenge(updated);
                    }
                }
            }
        } catch (err: any) {
            console.error('Failed to fetch challenges:', err);
            setError(err.message || 'Failed to load challenges');
        } finally {
            setLoading(false);
        }
    }, [user, selectedChallenge]);

    useEffect(() => {
        fetchChallenges();
    }, [user]);

    const handleCreateChallenge = async (challengeData: Partial<Challenge>) => {
        try {
            const res = await api.createChallenge(challengeData);
            if (res && res.challenge) {
                setChallenges((prev) => [res.challenge, ...prev]);
                return res.challenge;
            }
        } catch (err: any) {
            console.error('Error creating challenge:', err);
            throw err;
        }
    };

    const handleUpdateChallenge = async (id: string, updates: Partial<Challenge>) => {
        try {
            const res = await api.updateChallenge(id, updates);
            if (res && res.challenge) {
                setChallenges((prev) =>
                    prev.map((c) => ((c.id || c._id) === id ? res.challenge : c))
                );
                if (selectedChallenge && (selectedChallenge.id || selectedChallenge._id) === id) {
                    setSelectedChallenge(res.challenge);
                }
                return res.challenge;
            }
        } catch (err: any) {
            console.error('Error updating challenge:', err);
            throw err;
        }
    };

    const handleDeleteChallenge = async (id: string) => {
        try {
            await api.deleteChallenge(id);
            setChallenges((prev) => prev.filter((c) => (c.id || c._id) !== id));
            if (selectedChallenge && (selectedChallenge.id || selectedChallenge._id) === id) {
                setSelectedChallenge(null);
            }
        } catch (err: any) {
            console.error('Error deleting challenge:', err);
            throw err;
        }
    };

    const handleLogDay = async (
        id: string,
        logData: {
            dayNumber: number;
            date?: string;
            status?: 'completed' | 'rest' | 'missed';
            note?: string;
            timeSpent?: string;
            imageUrl?: string;
        }
    ) => {
        try {
            const res = await api.logChallengeDay(id, logData);
            if (res && res.challenge) {
                setChallenges((prev) =>
                    prev.map((c) => ((c.id || c._id) === id ? res.challenge : c))
                );
                if (selectedChallenge && (selectedChallenge.id || selectedChallenge._id) === id) {
                    setSelectedChallenge(res.challenge);
                }
            }
        } catch (err: any) {
            console.error('Error logging day:', err);
            throw err;
        }
    };

    const handleDeleteLog = async (challengeId: string, logId: string) => {
        try {
            const res = await api.deleteChallengeLog(challengeId, logId);
            if (res && res.challenge) {
                setChallenges((prev) =>
                    prev.map((c) => ((c.id || c._id) === challengeId ? res.challenge : c))
                );
                if (
                    selectedChallenge &&
                    (selectedChallenge.id || selectedChallenge._id) === challengeId
                ) {
                    setSelectedChallenge(res.challenge);
                }
            }
        } catch (err: any) {
            console.error('Error deleting log:', err);
            throw err;
        }
    };

    return {
        challenges,
        selectedChallenge,
        setSelectedChallenge,
        loading,
        error,
        fetchChallenges,
        createChallenge: handleCreateChallenge,
        updateChallenge: handleUpdateChallenge,
        deleteChallenge: handleDeleteChallenge,
        logDay: handleLogDay,
        deleteLog: handleDeleteLog,
    };
}
