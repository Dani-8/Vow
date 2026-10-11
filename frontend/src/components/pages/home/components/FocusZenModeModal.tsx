import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Minimize2, Sparkles } from 'lucide-react';
import { useFocusTimer } from '../../../../context/FocusTimerContext';
import { AmbientZenBackground, ZEN_PALETTE } from './AmbientZenBackground';

interface FocusZenModeModalProps {
    isOpen: boolean;
    onClose: () => void;
}