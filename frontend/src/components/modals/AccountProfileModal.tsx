import React, { useState } from 'react';
import { X, ShieldCheck, Eye, EyeOff, Copy, Check, Download, Calendar, LogOut, User as UserIcon } from 'lucide-react';
import { User, MasterStreakStats } from '../../types';

interface AccountProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    stats: MasterStreakStats | null;
    onLogout: () => void;
}

