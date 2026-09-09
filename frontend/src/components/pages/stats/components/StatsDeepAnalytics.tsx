import React, { useState } from 'react';
import { CategoryBreakdownItem, DayActivity } from '../statsHelpers';
import { getCategoryIconComponent } from '../../../common/categoryIcons';
import {
    TrendingUp,
    Compass,
    ShieldCheck,
    Flame,
    BarChart3,
    PieChart as PieIcon,
    Layers,
    Activity,
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area,
} from 'recharts';

interface StatsDeepAnalyticsProps {
    categories: CategoryBreakdownItem[];
    heatmapActivities: DayActivity[];
}