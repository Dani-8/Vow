import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../../../../types';

interface DigitalClockCardProps {
    formattedHoursMinutes: string;
    formattedDate: string;
    formattedDayName: string;
    tasks?: Task[];
}

const STORAGE_KEY = 'home_clock_card_mode';
