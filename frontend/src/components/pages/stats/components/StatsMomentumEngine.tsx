import React, { useMemo } from 'react';
import { DayActivity, EcosystemOverview } from '../statsHelpers';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Zap,
    Sparkles,
    Flame,
    X,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';