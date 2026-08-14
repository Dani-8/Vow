import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TaskMap, MapAccentColor } from './types';
import { INITIAL_TASK_MAPS } from './initialMaps';
import { Task } from '../../../types';

import { EmptyTaskMapsState } from './components/EmptyTaskMapsState';
import { SavedMapsView } from './components/SavedMapsView';
import { TaskMapCanvasView } from './components/TaskMapCanvasView';

import { CreateMapModal } from './modals/CreateMapModal';
import { LearnTaskMapModal } from './modals/LearnTaskMapModal';

interface TaskMapPageProps {
    tasks: Task[];
    onBackToHome: () => void;
}

const STORAGE_KEY = 'vow_app_task_maps_v2';

// Generates a clean random 5-character lowercase alphanumeric identifier (same as task detail id style)
export const generateRandom5CharId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

// Generates a deterministic distinct 5-character alphanumeric ID from string for stable linking
export const hashStringTo5CharId = (str: string): string => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let val = Math.abs(hash);
    for (let i = 0; i < 5; i++) {
        result += chars[(val + i * 13) % chars.length];
        val = Math.floor(val / chars.length) + (str.charCodeAt(i % str.length) || 1);
    }
    return result;
};

export const getMapShortId = (map: TaskMap | string): string => {
    const idStr = typeof map === 'string' ? map : map.id || '';
    const nameStr = typeof map === 'string' ? '' : (map.name || '').toLowerCase().trim();

    const cleaned = idStr.replace(/^map-/, '').trim().toLowerCase();

    // If already a valid 5-char alphanumeric tag and NOT pure sequential digits
    if (/^[a-z0-9]{5}$/.test(cleaned) && !/^\d+$/.test(cleaned)) {
        return cleaned;
    }

    // If map id ends with a 5-char alphanumeric tag
    if (cleaned.length >= 5) {
        const tail = cleaned.slice(-5);
        if (/^[a-z0-9]{5}$/.test(tail) && !/^\d+$/.test(tail)) {
            return tail;
        }
    }

    // Otherwise produce a deterministic distinct 5-char hash from map id & name dynamically
    return hashStringTo5CharId(`${idStr}_${nameStr}`);
};

export const generateShortAlphanumericId = (seed?: string): string => {
    if (seed) return getMapShortId(seed);
    return generateRandom5CharId();
};

export const getMapSlug = (map: TaskMap): string => {
    const shortId = getMapShortId(map);
    if (!map.name) return map.id;
    const slug = map.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug ? `${slug}-${shortId}` : map.id;
};

const normalizeTaskMaps = (loaded: TaskMap[]): TaskMap[] => {
    return loaded.map((m) => {
        const shortId = getMapShortId(m);
        const hasProperId =
            m.id.startsWith('map-') &&
            /^[a-z0-9]{5}$/i.test(m.id.replace(/^map-/, '')) &&
            !/^\d+$/.test(m.id.replace(/^map-/, ''));
        return {
            ...m,
            id: hasProperId ? m.id : `map-${shortId}`,
        };
    });
};

export const TaskMapPage: React.FC<TaskMapPageProps> = ({ tasks }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract map slug/id from URL path /app/map/:mapSlug
    const match = location.pathname.match(/^\/app\/map\/(.+)$/);
    const activeMapSlugParam = match ? decodeURIComponent(match[1]) : null;

    const [maps, setMaps] = useState<TaskMap[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return normalizeTaskMaps(parsed);
                }
            }
        } catch (e) {
            console.error('Failed to parse task maps storage', e);
        }
        return INITIAL_TASK_MAPS;
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(maps));
        } catch (e) {
            console.error('Failed to save task maps', e);
        }
    }, [maps]);

    const activeMap =
        maps.find((m) => {
            if (!activeMapSlugParam) return false;
            const paramLower = activeMapSlugParam.toLowerCase();
            const titleSlug = m.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            const mapSlug = getMapSlug(m).toLowerCase();
            const shortId = getMapShortId(m).toLowerCase();
            const rawMapId = m.id.replace(/^map-/, '').toLowerCase();
            return (
                m.id === activeMapSlugParam ||
                m.id.toLowerCase() === paramLower ||
                mapSlug === paramLower ||
                paramLower.endsWith(`-${shortId}`) ||
                paramLower === shortId ||
                titleSlug === paramLower ||
                m.name.toLowerCase() === paramLower ||
                paramLower === `${titleSlug}-${rawMapId}`
            );
        }) || null;

    const navigateToMap = (map: TaskMap) => {
        navigate(`/app/map/${getMapSlug(map)}`);
    };

    const navigateToMapById = (mapId: string) => {
        const target = maps.find((m) => m.id === mapId);
        if (target) {
            navigateToMap(target);
        } else {
            navigate(`/app/map/${mapId}`);
        }
    };

    const handleCreateMap = (name: string, description: string, color: MapAccentColor) => {
        const shortId = generateRandom5CharId();
        const newMap: TaskMap = {
            id: `map-${shortId}`,
            name,
            description,
            color,
            updatedAt: 'Just now',
            nodes: [],
            connections: [],
        };
        setMaps((prev) => [newMap, ...prev]);
        navigateToMap(newMap);
    };

    const handleUpdateMap = (updatedMap: TaskMap) => {
        setMaps((prev) => prev.map((m) => (m.id === updatedMap.id ? updatedMap : m)));
    };

    const handleDeleteMap = (mapId: string) => {
        setMaps((prev) => prev.filter((m) => m.id !== mapId));
        if (activeMap && activeMap.id === mapId) {
            navigate('/app/map');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* RENDER ACTIVE STATE */}
            {maps.length === 0 ? (
                /* State 1 — No Task Maps */
                <EmptyTaskMapsState
                    onCreateFirstMap={() => setIsCreateModalOpen(true)}
                    onOpenLearnModal={() => setIsLearnModalOpen(true)}
                />
            ) : activeMapSlugParam === null || !activeMap ? (
                /* State 2 — Task Maps Exist (Overview View) */
                <SavedMapsView
                    maps={maps}
                    tasks={tasks}
                    onOpenMap={(id) => navigateToMapById(id)}
                    onCreateMap={() => setIsCreateModalOpen(true)}
                    onDeleteMap={handleDeleteMap}
                />
            ) : (
                /* States 3 & 4 — Inside Map Canvas Workspace */
                <TaskMapCanvasView
                    currentMap={activeMap}
                    maps={maps}
                    tasks={tasks}
                    onSelectMap={(id) => navigateToMapById(id)}
                    onBackToMaps={() => navigate('/app/map')}
                    onCreateNewMap={() => setIsCreateModalOpen(true)}
                    onUpdateMap={handleUpdateMap}
                />
            )}

            {/* Global Modals for Task Map */}
            <CreateMapModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateMap={handleCreateMap}
            />

            <LearnTaskMapModal
                isOpen={isLearnModalOpen}
                onClose={() => setIsLearnModalOpen(false)}
            />
        </div>
    );
};
