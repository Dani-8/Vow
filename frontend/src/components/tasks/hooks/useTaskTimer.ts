import { useState, useEffect } from 'react';
import { Task } from '../../../types';

export function useTaskTimer(task: Task) {
    const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);
    const [isStruggling, setIsStruggling] = useState<boolean>(false);

    useEffect(() => {
        if (!task.endTime) {
            setTimeLeftStr(null);
            setIsStruggling(false);
            return;
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const end = new Date(task.endTime!).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeftStr('Overdue');
                setIsStruggling(task.status !== 'completed');
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const days = Math.floor(hours / 24);

                if (days > 0) {
                    setTimeLeftStr(`${days}d ${hours % 24}h left`);
                } else if (hours > 0) {
                    setTimeLeftStr(`${hours}h ${minutes}m left`);
                } else {
                    setTimeLeftStr(`${minutes}m left`);
                }

                setIsStruggling(diff < 4 * 60 * 60 * 1000 && task.status !== 'completed');
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 30000);
        return () => clearInterval(interval);
    }, [task.endTime, task.status]);

    return { timeLeftStr, isStruggling };
}
