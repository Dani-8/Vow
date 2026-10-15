import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api, getToken, getStoredPin, clearStoredPin, removeToken } from '../api';
import { Task, User, MasterStreakStats, SubTask } from '../types';
import { SUBTASKS_UPDATED_EVENT } from '../utils/subtaskStorage';
import {
    DEFAULT_DEMO_USER,
    DEFAULT_INITIAL_TASKS,
    DEFAULT_INITIAL_PRIVATE_TASKS,
    DEFAULT_INITIAL_STATS,
} from '../data/defaultInitialData';

import { useAppNavigation } from './useAppNavigation';
