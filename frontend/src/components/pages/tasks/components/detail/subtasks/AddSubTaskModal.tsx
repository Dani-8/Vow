import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { SubTask } from '../../../../../../types';

interface AddSubTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (subTaskData: Omit<SubTask, 'id' | 'taskId'>) => void;
    editingSubTask?: SubTask | null;
    onUpdate?: (updatedSubTask: SubTask) => void;
}