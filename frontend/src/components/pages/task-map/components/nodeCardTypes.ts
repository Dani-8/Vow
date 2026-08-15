import { Task, SubTask } from '../../../../types';
import { TaskMapNode } from '../types';

export interface TaskNodeCardProps {
  node: TaskMapNode;
  task?: Task;
  subTask?: SubTask;
  isSelected: boolean;
  isMenuOpen?: boolean;
  onToggleMenu?: (isOpen: boolean) => void;
  zoom?: number;
  onSelect: () => void;
  onPositionChange: (nodeId: string, x: number, y: number) => void;
  onDeleteNode: (nodeId: string) => void;
  onStartConnect: (nodeId: string) => void;
  onStatusChange?: (nodeId: string, newStatus: 'todo' | 'in_progress' | 'completed') => void;
}

