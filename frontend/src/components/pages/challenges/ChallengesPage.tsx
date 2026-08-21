import React, { useState, useMemo, useEffect } from 'react';
import { Trophy, HelpCircle } from 'lucide-react';
import { Challenge } from '../../../types';
import { CreateChallengeModal } from './components/CreateChallengeModal';
import { HowChallengesWorkModal } from './components/HowChallengesWorkModal';
import { DeleteChallengeModal } from './components/DeleteChallengeModal';
import { ChallengeCard } from './components/ChallengeCard';
import { ChallengesActionBar } from './components/ChallengesActionBar';
import { ChallengesEmptyState } from './components/ChallengesEmptyState';

interface ChallengesPageProps {
    challenges: Challenge[];
    onSelectChallenge: (challenge: Challenge) => void;
    onCreateChallenge: (challengeData: Partial<Challenge>) => Promise<void>;
    onUpdateChallenge: (id: string, updates: Partial<Challenge>) => Promise<void>;
    onDeleteChallenge: (id: string) => Promise<void>;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({
    challenges,
    onSelectChallenge,
    onCreateChallenge,
    onUpdateChallenge,
    onDeleteChallenge,
}) => {
    const [activeFilter, setActiveFilter] = useState<'active' | 'completed' | 'paused'>('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
    const [cardMenuOpenId, setCardMenuOpenId] = useState<string | null>(null);
    const [challengeToDelete, setChallengeToDelete] = useState<Challenge | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Close card menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setCardMenuOpenId(null);
        if (cardMenuOpenId) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [cardMenuOpenId]);

    // Counts by status
    const counts = useMemo(() => {
        return {
            active: challenges.filter((c) => (c.status || 'active') === 'active').length,
            completed: challenges.filter((c) => c.status === 'completed').length,
            paused: challenges.filter((c) => c.status === 'paused').length,
        };
    }, [challenges]);

    // Filtered and searched challenges
    const filteredChallenges = useMemo(() => {
        return challenges.filter((c) => {
            const matchStatus = (c.status || 'active') === activeFilter;
            const matchSearch =
                searchQuery.trim() === '' ||
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.tags && c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
            return matchStatus && matchSearch;
        });
    }, [challenges, activeFilter, searchQuery]);

    const handleOpenCreateModal = () => {
        setEditingChallenge(null);
        setIsCreateModalOpen(true);
    };

    const handleTogglePause = async (challenge: Challenge) => {
        const newStatus = challenge.status === 'paused' ? 'active' : 'paused';
        await onUpdateChallenge(challenge.id || challenge._id || '', {
            status: newStatus,
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-16">
            {/* Case 1: Total Challenges = 0 (Brand New User - Onboarding Hero View) */}
            {challenges.length === 0 ? (
                <ChallengesEmptyState
                    isInitialOnboarding={true}
                    onStartChallenge={handleOpenCreateModal}
                    onOpenGuide={() => setIsGuideModalOpen(true)}
                />
            ) : (
                /* Case 2: Total Challenges > 0 (User Has Challenges) */
                <div className="space-y-6">
                    {/* Unified Action Bar: Filters on Left, Search + Guide + Start Challenge on Right */}
                    <ChallengesActionBar
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        counts={counts}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onOpenGuide={() => setIsGuideModalOpen(true)}
                        onStartChallenge={handleOpenCreateModal}
                    />

                    {/* Dynamic Empty State vs Cards Grid */}
                    {filteredChallenges.length === 0 ? (
                        <ChallengesEmptyState
                            activeFilter={activeFilter}
                            searchQuery={searchQuery}
                            onClearSearch={() => setSearchQuery('')}
                            onViewActive={() => setActiveFilter('active')}
                            onStartChallenge={handleOpenCreateModal}
                            onOpenGuide={() => setIsGuideModalOpen(true)}
                        />
                    ) : (
                        <div className="space-y-8">
                            {/* Challenges Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {filteredChallenges.map((challenge) => {
                                    const challengeId = challenge.id || challenge._id || '';
                                    return (
                                        <ChallengeCard
                                            key={challengeId}
                                            challenge={challenge}
                                            onSelect={onSelectChallenge}
                                            onEdit={(c) => {
                                                setEditingChallenge(c);
                                                setIsCreateModalOpen(true);
                                            }}
                                            onTogglePause={handleTogglePause}
                                            onDelete={(c) => setChallengeToDelete(c)}
                                            isMenuOpen={cardMenuOpenId === challengeId}
                                            onToggleMenu={(id) =>
                                                setCardMenuOpenId(cardMenuOpenId === id ? null : id)
                                            }
                                        />
                                    );
                                })}
                            </div>

                            {/* Motivational Trophy Banner */}
                            <div className="neu-card p-5 bg-[#E0E5EC] flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center space-x-3.5 text-center sm:text-left">
                                    <div className="w-11 h-11 rounded-2xl neu-button flex items-center justify-center text-amber-500 bg-amber-50/80 shadow-sm shrink-0">
                                        <Trophy className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                                            Every day you show up is a vote for the person you&apos;re becoming.
                                        </h4>
                                        <p className="text-[11px] font-semibold text-[#717699]">
                                            Micro-wins compound into monumental transformations.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsGuideModalOpen(true)}
                                    className="neu-button px-4 py-2 rounded-xl text-xs font-bold text-purple-700 hover:text-purple-900 shrink-0 flex items-center space-x-1.5"
                                >
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    <span>How Challenges work</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create / Edit Challenge Modal */}
            {isCreateModalOpen && (
                <CreateChallengeModal
                    isOpen={isCreateModalOpen}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        setEditingChallenge(null);
                    }}
                    editingChallenge={editingChallenge}
                    onSubmit={async (challengeData) => {
                        if (editingChallenge) {
                            await onUpdateChallenge(
                                editingChallenge.id || editingChallenge._id || '',
                                challengeData
                            );
                        } else {
                            await onCreateChallenge(challengeData);
                        }
                    }}
                />
            )}

            {/* Guide Modal */}
            <HowChallengesWorkModal
                isOpen={isGuideModalOpen}
                onClose={() => setIsGuideModalOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            {challengeToDelete && (
                <DeleteChallengeModal
                    isOpen={!!challengeToDelete}
                    onClose={() => setChallengeToDelete(null)}
                    challengeTitle={challengeToDelete.title}
                    isDeleting={isDeleting}
                    onConfirm={async () => {
                        try {
                            setIsDeleting(true);
                            await onDeleteChallenge(challengeToDelete.id || challengeToDelete._id || '');
                            setChallengeToDelete(null);
                        } finally {
                            setIsDeleting(false);
                        }
                    }}
                />
            )}
        </div>
    );
};
