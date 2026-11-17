import { useState, useEffect } from 'react';
import { Task } from '../../../types';

export function useTaskTimer(task: Task) {
    const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);