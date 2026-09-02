t } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { SubTask } from '../../../../../../types';

interface AddSubTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (subTaskData: Omit<SubTask, 'id' | 'taskId'>) => void;
    editingSubTask?: SubTask | null;
    onUpdate?: (updatedSubTask: SubTask) => void;
}

export const AddSubTaskModal: React.FC<AddSubTaskModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingSubTask,
    onUpdate,
}) => {
    const [title, setTitle] = useState('');
    const [dateLabel, setDateLabel] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [timeLeft, setTimeLeft] = useState('');
    const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (editingSubTask) {
            setTitle(editingSubTask.title);
            setDateLabel(editingSubTask.dateLabel || 'Aug 21');
            setDueDate(editingSubTask.dueDate || 'Aug 21, 2026');
            setTimeLeft(editingSubTask.timeLeft || '1 Day Left');
            setPriority(editingSubTask.priority || 'High');
            setDescription(editingSubTask.description || '');
        } else {
            setTitle('');
            setDateLabel('Aug 21');
            setDueDate('Aug 21, 2026');
            setTimeLeft('2 Days Left');
            setPriority('High');
            setDescription('');
        }
    }, [editingSubTask, isOpen]);