import { Task, SubTask } from '../../../types';

export type MapAccentColor = 'purple' | 'emerald' | 'amber' | 'sky' | 'indigo' | 'rose';

export type RelationshipType =
  | 'Depends On'
  | 'Blocks'
  | 'Supports'
  | 'Related To'
  | 'Leads To'
  | 'Enables';

export interface TaskMapConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  relationship: RelationshipType;
  isCritical?: boolean;
}

export interface TaskMapNode {
  id: string;
  taskId: string; // Refers to Task._id
  subTaskId?: string; // Optional: refers to SubTask.id
  x: number;
  y: number;
  // Fallback cache if task not found in main state
  customTitle?: string;
  customStatus?: 'todo' | 'in_progress' | 'completed';
  customProgress?: number;
}

export interface TaskMap {
  id: string;
  name: string;
  description: string;
  color: MapAccentColor;
  isPrimary?: boolean;
  updatedAt: string;
  nodes: TaskMapNode[];
  connections: TaskMapConnection[];
}
