import React from 'react';
import {
    // Tech & Engineering
    Code,
    Terminal,
    Cpu,
    Database,
    Network,
    Layers,
    Workflow,
    Globe,
    Smartphone,
    Shield,
    // Learning & Mindset
    BookOpen,
    GraduationCap,
    Brain,
    Languages,
    Lightbulb,
    Compass,
    Map,
    PenTool,
    Bookmark,
    // Fitness & Health
    Dumbbell,
    Flame,
    Heart,
    Activity,
    Footprints,
    Bike,
    Apple,
    Droplets,
    // Growth, Milestones & Achievement
    Target,
    Trophy,
    Award,
    Crown,
    Star,
    Sparkles,
    Rocket,
    Mountain,
    Flag,
    TrendingUp,
    // Career & Finance
    Briefcase,
    DollarSign,
    Coins,
    Wallet,
    Building2,
    BarChart3,
    Megaphone,
    Users,
    // Routine & Productivity
    Calendar,
    Clock,
    Timer,
    Sunrise,
    Sun,
    Moon,
    Coffee,
    Zap,
    Smile,
    // Creative & Arts
    Palette,
    Music,
    Video,
    Camera,
    Feather,
    Mic,
    Wand2,
    LucideIcon,
} from 'lucide-react';

export interface CategoryIconOption {
    id: string;
    label: string;
    icon: LucideIcon;
    categoryGroup?: string;
}

/**
 * Purposeful, domain-focused icons for Challenges, Roadmaps, Milestones, and Mastery.
 * Excludes generic UI action buttons (checkmarks, crosses, plus signs, trash, etc.).
 */
export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
    // --- Tech & Engineering ---
    { id: 'code', label: 'Coding & Dev', icon: Code, categoryGroup: 'Tech' },
    { id: 'terminal', label: 'Terminal / CLI', icon: Terminal, categoryGroup: 'Tech' },
    { id: 'cpu', label: 'AI & Systems', icon: Cpu, categoryGroup: 'Tech' },
    { id: 'database', label: 'Database & SQL', icon: Database, categoryGroup: 'Tech' },
    { id: 'network', label: 'Network & Cloud', icon: Network, categoryGroup: 'Tech' },
    { id: 'layers', label: 'Full-Stack Architecture', icon: Layers, categoryGroup: 'Tech' },
    { id: 'workflow', label: 'Workflows & DevOps', icon: Workflow, categoryGroup: 'Tech' },
    { id: 'globe', label: 'Web & Global', icon: Globe, categoryGroup: 'Tech' },
    { id: 'smartphone', label: 'Mobile App Dev', icon: Smartphone, categoryGroup: 'Tech' },
    { id: 'shield', label: 'Security & Discipline', icon: Shield, categoryGroup: 'Tech' },

    // --- Learning, Mind & Strategy ---
    { id: 'book', label: 'Reading & Books', icon: BookOpen, categoryGroup: 'Learning' },
    { id: 'languages', label: 'Language Fluency', icon: Languages, categoryGroup: 'Learning' },
    { id: 'graduation', label: 'Study & Academics', icon: GraduationCap, categoryGroup: 'Learning' },
    { id: 'brain', label: 'Cognition & Focus', icon: Brain, categoryGroup: 'Learning' },
    { id: 'lightbulb', label: 'Ideas & Innovation', icon: Lightbulb, categoryGroup: 'Learning' },
    { id: 'map', label: 'Roadmap & Strategy', icon: Map, categoryGroup: 'Learning' },
    { id: 'compass', label: 'Journey & Exploration', icon: Compass, categoryGroup: 'Learning' },
    { id: 'pentool', label: 'Writing & Technical Craft', icon: PenTool, categoryGroup: 'Learning' },
    { id: 'bookmark', label: 'Curated Knowledge', icon: Bookmark, categoryGroup: 'Learning' },

    // --- Fitness, Health & Body ---
    { id: 'dumbbell', label: 'Gym & Strength', icon: Dumbbell, categoryGroup: 'Fitness' },
    { id: 'flame', label: 'Streak & Calisthenics', icon: Flame, categoryGroup: 'Fitness' },
    { id: 'heart', label: 'Cardio & Heart Health', icon: Heart, categoryGroup: 'Fitness' },
    { id: 'activity', label: 'Athletics & Training', icon: Activity, categoryGroup: 'Fitness' },
    { id: 'footprints', label: 'Running & Steps', icon: Footprints, categoryGroup: 'Fitness' },
    { id: 'bike', label: 'Cycling & Endurance', icon: Bike, categoryGroup: 'Fitness' },
    { id: 'apple', label: 'Nutrition & Diet', icon: Apple, categoryGroup: 'Fitness' },
    { id: 'droplets', label: 'Hydration & Recovery', icon: Droplets, categoryGroup: 'Fitness' },

    // --- Goals, Milestones & Growth ---
    { id: 'target', label: 'Goals & Targets', icon: Target, categoryGroup: 'Growth' },
    { id: 'trophy', label: 'Achievement & Victory', icon: Trophy, categoryGroup: 'Growth' },
    { id: 'crown', label: 'Mastery & Leadership', icon: Crown, categoryGroup: 'Growth' },
    { id: 'award', label: 'Certifications & Honors', icon: Award, categoryGroup: 'Growth' },
    { id: 'star', label: 'High Priority & Star', icon: Star, categoryGroup: 'Growth' },
    { id: 'sparkles', label: 'Mindfulness & Flow', icon: Sparkles, categoryGroup: 'Growth' },
    { id: 'rocket', label: 'Project Launch', icon: Rocket, categoryGroup: 'Growth' },
    { id: 'mountain', label: 'Summit & Big Challenges', icon: Mountain, categoryGroup: 'Growth' },
    { id: 'flag', label: 'Milestones & Checkpoints', icon: Flag, categoryGroup: 'Growth' },
    { id: 'trending', label: 'Progress & Scaling', icon: TrendingUp, categoryGroup: 'Growth' },

    // --- Career & Finance ---
    { id: 'briefcase', label: 'Career & Business', icon: Briefcase, categoryGroup: 'Business' },
    { id: 'dollar', label: 'Finance & Money', icon: DollarSign, categoryGroup: 'Business' },
    { id: 'coins', label: 'Investing & Crypto', icon: Coins, categoryGroup: 'Business' },
    { id: 'wallet', label: 'Savings & Budgeting', icon: Wallet, categoryGroup: 'Business' },
    { id: 'building', label: 'Company & Enterprise', icon: Building2, categoryGroup: 'Business' },
    { id: 'barchart', label: 'Analytics & KPIs', icon: BarChart3, categoryGroup: 'Business' },
    { id: 'megaphone', label: 'Marketing & Outreach', icon: Megaphone, categoryGroup: 'Business' },
    { id: 'users', label: 'Networking & Community', icon: Users, categoryGroup: 'Business' },

    // --- Habits, Daily Routines & Time ---
    { id: 'calendar', label: 'Daily Consistency', icon: Calendar, categoryGroup: 'Habits' },
    { id: 'clock', label: 'Time Tracking', icon: Clock, categoryGroup: 'Habits' },
    { id: 'timer', label: 'Deep Work & Pomodoro', icon: Timer, categoryGroup: 'Habits' },
    { id: 'sunrise', label: 'Morning Routine', icon: Sunrise, categoryGroup: 'Habits' },
    { id: 'sun', label: 'Daily Energy', icon: Sun, categoryGroup: 'Habits' },
    { id: 'moon', label: 'Sleep & Night Routine', icon: Moon, categoryGroup: 'Habits' },
    { id: 'coffee', label: 'Focus & Habits', icon: Coffee, categoryGroup: 'Habits' },
    { id: 'zap', label: 'Power & Drive', icon: Zap, categoryGroup: 'Habits' },
    { id: 'smile', label: 'Mental Wellness', icon: Smile, categoryGroup: 'Habits' },

    // --- Creative & Expression ---
    { id: 'palette', label: 'Art, UI/UX & Design', icon: Palette, categoryGroup: 'Creative' },
    { id: 'music', label: 'Music & Instruments', icon: Music, categoryGroup: 'Creative' },
    { id: 'video', label: 'Video & Motion', icon: Video, categoryGroup: 'Creative' },
    { id: 'camera', label: 'Photography & Content', icon: Camera, categoryGroup: 'Creative' },
    { id: 'feather', label: 'Writing & Journaling', icon: Feather, categoryGroup: 'Creative' },
    { id: 'mic', label: 'Podcasting & Speech', icon: Mic, categoryGroup: 'Creative' },
    { id: 'wand', label: 'Creative Craft', icon: Wand2, categoryGroup: 'Creative' },
];

/**
 * Quick helper to resolve icon component by ID or fallback
 */
export const getCategoryIconComponent = (iconId?: string, fallback: LucideIcon = Target): LucideIcon => {
    if (!iconId) return fallback;
    const cleanId = iconId.toLowerCase().replace(/[-_]/g, '');

    const match = CATEGORY_ICON_OPTIONS.find(
        (item) => item.id.toLowerCase().replace(/[-_]/g, '') === cleanId
    );
    if (match) return match.icon;

    // Handle aliases & legacy compatibility
    const legacyMap: Record<string, LucideIcon> = {
        engineering: Code,
        code: Code,
        developer: Code,
        dev: Code,
        cpu: Cpu,
        ai: Cpu,
        network: Network,
        layers: Layers,
        fitness: Dumbbell,
        dumbbell: Dumbbell,
        workout: Dumbbell,
        gym: Dumbbell,
        learning: BookOpen,
        book: BookOpen,
        bookopen: BookOpen,
        language: Languages,
        languages: Languages,
        russian: Languages,
        discipline: Shield,
        shield: Shield,
        mindfulness: Sparkles,
        sparkles: Sparkles,
        goal: Target,
        target: Target,
        trophy: Trophy,
        check: Target,
        checkmark: Target,
        checkcircle: Target,
        close: Target,
        plus: Target,
        clipboard: BookOpen,
    };

    return legacyMap[cleanId] || fallback;
};
