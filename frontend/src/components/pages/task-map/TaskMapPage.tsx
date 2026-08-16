import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TaskMap, MapAccentColor } from './types';
import { Task } from '../../../types';
import { api, getToken } from '../../../api';
import { INITIAL_DEMO_TASK_MAPS } from './initialMaps';

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

// Generates a clean random 5-character lowercase alphanumeric identifier
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
  return loaded
    .filter((m) => !!m && !!m.name)
    .map((m) => {
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
    // If not authenticated, initialize immediately with demo maps without delay
    const token = getToken();
    return !token ? INITIAL_DEMO_TASK_MAPS : [];
  });
  const [loading, setLoading] = useState<boolean>(() => !!getToken());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  const saveTimeoutRef = useRef<Record<string, any>>({});

  // Sync from backend on initial mount if authenticated
  useEffect(() => {
    const token = getToken();
    if (token) {
      setLoading(true);
      api.getTaskMaps()
        .then((res) => {
          if (res.maps && Array.isArray(res.maps) && res.maps.length > 0) {
            const normalized = normalizeTaskMaps(res.maps);
            setMaps(normalized);
          } else {
            setMaps([]);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch task maps from backend:', err);
          setMaps([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setMaps(INITIAL_DEMO_TASK_MAPS);
      setLoading(false);
    }
  }, []);

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
      const shortId = getMapShortId(m).toLowerCase();
      const directSlug = `${titleSlug}-${shortId}`;

      return (
        m.id.toLowerCase() === paramLower ||
        paramLower === directSlug ||
        paramLower.endsWith(`-${shortId}`) ||
        paramLower === shortId
      );
    }) || null;

  const navigateToMap = (map: TaskMap) => {
    const slug = getMapSlug(map);
    navigate(`/app/map/${encodeURIComponent(slug)}`);
  };

  const navigateToMapById = (mapId: string) => {
    const target = maps.find((m) => m.id === mapId);
    if (target) {
      navigateToMap(target);
    } else {
      navigate(`/app/map/${mapId}`);
    }
  };

  const handleCreateMap = (
    name: string,
    description?: string,
    color: MapAccentColor = 'sky'
  ) => {
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

    // Save to Firestore backend
    if (getToken()) {
      api.createTaskMap(newMap).catch((err) => console.warn('Failed to persist new map to cloud:', err));
    }
  };

  const handleUpdateMap = (updatedMap: TaskMap) => {
    setMaps((prev) => prev.map((m) => (m.id === updatedMap.id ? updatedMap : m)));

    // Debounced sync to Firestore backend
    if (getToken()) {
      if (saveTimeoutRef.current[updatedMap.id]) {
        clearTimeout(saveTimeoutRef.current[updatedMap.id]);
      }
      saveTimeoutRef.current[updatedMap.id] = setTimeout(() => {
        api.updateTaskMap(updatedMap.id, updatedMap).catch((err) => {
          console.warn('Failed to update task map in cloud:', err);
        });
      }, 500);
    }
  };

  const handleDeleteMap = (mapId: string) => {
    setMaps((prev) => prev.filter((m) => m.id !== mapId));
    if (activeMap && activeMap.id === mapId) {
      navigate('/app/map');
    }

    // Delete on Firestore backend
    if (getToken()) {
      api.deleteTaskMap(mapId).catch((err) => console.warn('Failed to delete map from cloud:', err));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* RENDER ACTIVE STATE */}
      {loading ? (
        <div className="space-y-6 animate-pulse" id="task-map-loading-skeleton">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 p-6 rounded-2xl border border-[#e2e8f0]">
            <div className="space-y-2">
              <div className="h-7 w-48 bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-72 bg-slate-100 rounded-md"></div>
            </div>
            <div className="h-10 w-36 bg-slate-200 rounded-xl"></div>
          </div>
          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 p-6 rounded-2xl border border-[#e2e8f0] space-y-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                  </div>
                </div>
                <div className="h-12 bg-slate-100 rounded-lg"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-3 w-20 bg-slate-200 rounded"></div>
                  <div className="h-3 w-12 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : maps.length === 0 ? (
        /* State 1 — No Task Maps (Clean Fresh User State) */
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
