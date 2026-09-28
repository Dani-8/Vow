import React, { useState, useMemo } from 'react';
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../../../../types';

interface DigitalClockCardProps {
    formattedHoursMinutes: string;
    formattedDate: string;
    formattedDayName: string;
    tasks?: Task[];
}