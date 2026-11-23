import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Download, ArrowRight, User as UserIcon } from 'lucide-react';
import { User } from '../../types';

interface PrivateKeySignupModalProps {
    isOpen: boolean;
    user: User | null;
    recoveryKey: string;
    onCloseAndEnterApp: () => void;
}
