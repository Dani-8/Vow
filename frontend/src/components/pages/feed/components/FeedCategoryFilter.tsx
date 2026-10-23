import React from 'react';
import { Lightbulb, Trophy, Compass, Shield, BookOpen } from 'lucide-react';
import { FeedCategory } from '../types';

interface FeedCategoryFilterProps {
    selectedCategory: FeedCategory | 'all';
    onSelectCategory: (category: FeedCategory | 'all') => void;
}