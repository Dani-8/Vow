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

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        if (editingSubTask && onUpdate) {
            onUpdate({
                ...editingSubTask,
                title: title.trim(),
                dateLabel,
                dueDate,
                timeLeft,
                priority,
                description: description.trim(),
            });
        } else {
            onSave({
                title: title.trim(),
                dateLabel,
                dueDate,
                timeLeft,
                status: 'pending',
                priority,
                description: description.trim(),
                assignee: { name: 'Alex Rivera', email: 'demo@vow.app' },
                masterStreak: '4 Days',
            });
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="neu-card w-full max-w-lg p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#c8d0e0]/60 pb-4">
                    <h3 className="text-xl font-extrabold text-[#1a1c35]">
                        {editingSubTask ? 'Edit Sub-Task' : 'Add New Sub-Task'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="neu-button w-9 h-9 rounded-2xl flex items-center justify-center text-[#717699] hover:text-[#1a1c35]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>