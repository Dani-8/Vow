import React from 'react';
import { PieChart, Sparkles, Compass } from 'lucide-react';
import { CategoryBreakdownItem } from '../statsHelpers';
import { getCategoryIconComponent } from '../../../common/categoryIcons';

interface StatsCategoryDistributionProps {
    categories: CategoryBreakdownItem[];
}