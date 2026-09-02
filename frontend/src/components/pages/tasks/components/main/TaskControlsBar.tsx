import React from 'react';
import { Search } from 'lucide-react';

export type FilterCategory = 'all' | 'habits' | 'tasks' | 'todo' | 'completed';

interface ControlsBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
}