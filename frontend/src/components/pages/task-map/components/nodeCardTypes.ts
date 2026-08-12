import { Task, SubTask } from '../../../../types';
import { TaskMapNode } from '../types';

export interface TaskNodeCardProps {
    node: TaskMapNode;
    task?: Task;
    subTask?: SubTask;
    isSelected: boolean;
    onSelect: () => void;
    onPositionChange: (nodeId: string, x: number, y: number) => void;
    onDeleteNode: (nodeId: string) => void;
    onStartConnect: (nodeId: string) => void;
}
