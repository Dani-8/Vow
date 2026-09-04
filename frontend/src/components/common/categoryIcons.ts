import React from 'react';
import {
    // Media & Files
    Image,
    Music,
    FileArchive,
    Video,
    LayoutGrid,
    FileText,
    FileQuestion,
    File,
    Folder,
    Globe,
    Palette,
    Settings,
    Search,
    Info,
    Check,
    Link,
    CloudDownload,
    Megaphone,
    Users,
    List,
    Cloud,
    Play,
    Pause,
    Square,
    PlusSquare,
    Trash2,
    X,
    Plus,
    Clipboard,
    Copy,
    // Productivity, Code & Life
    Code,
    Terminal,
    Cpu,
    Dumbbell,
    Flame,
    Zap,
    Heart,
    Activity,
    BookOpen,
    GraduationCap,
    Lightbulb,
    Target,
    Compass,
    Sparkles,
    Star,
    Award,
    Trophy,
    Shield,
    DollarSign,
    Coins,
    TrendingUp,
    Briefcase,
    Calendar,
    Clock,
    Timer,
    Coffee,
    Smile,
    Sun,
    Moon,
    Feather,
    Send,
    Rocket,
    Bookmark,
    CheckCircle2,
    LucideIcon,
} from 'lucide-react';

export interface CategoryIconOption {
    id: string;
    label: string;
    icon: LucideIcon;
    categoryGroup?: string;
}

/**
 * Extensible Array of Selectable Category Icons.
 * To add a new icon, simply append a new object { id, label, icon } to this list!
 */
export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
    // --- Exact Icons as matched in user reference UI (Pic 2) ---
    { id: 'image', label: 'Image', icon: Image, categoryGroup: 'Media' },
    { id: 'music', label: 'Audio / Music', icon: Music, categoryGroup: 'Media' },
    { id: 'archive', label: 'Zip Archive', icon: FileArchive, categoryGroup: 'Files' },
    { id: 'video', label: 'Video', icon: Video, categoryGroup: 'Media' },
    { id: 'grid', label: 'Dashboard / Grid', icon: LayoutGrid, categoryGroup: 'Interface' },
    { id: 'file-text', label: 'Document', icon: FileText, categoryGroup: 'Files' },
    { id: 'file-question', label: 'Draft / Query', icon: FileQuestion, categoryGroup: 'Files' },
    { id: 'file', label: 'Note / File', icon: File, categoryGroup: 'Files' },
    { id: 'folder', label: 'Folder / Project', icon: Folder, categoryGroup: 'Files' },
    { id: 'globe', label: 'Web / Global', icon: Globe, categoryGroup: 'Tech' },
    { id: 'palette', label: 'Art / Design', icon: Palette, categoryGroup: 'Creative' },
    { id: 'settings', label: 'System / Settings', icon: Settings, categoryGroup: 'Utility' },
    { id: 'search', label: 'Research / Search', icon: Search, categoryGroup: 'Utility' },
    { id: 'info', label: 'Information', icon: Info, categoryGroup: 'Utility' },
    { id: 'check', label: 'Checkmark', icon: Check, categoryGroup: 'Utility' },
    { id: 'link', label: 'Link / Connection', icon: Link, categoryGroup: 'Tech' },
    { id: 'cloud-download', label: 'Cloud Download', icon: CloudDownload, categoryGroup: 'Tech' },
    { id: 'megaphone', label: 'Marketing / Broadcast', icon: Megaphone, categoryGroup: 'Communication' },
    { id: 'users', label: 'Community / Team', icon: Users, categoryGroup: 'Communication' },
    { id: 'list', label: 'Checklist / Tasks', icon: List, categoryGroup: 'Productivity' },
    { id: 'cloud', label: 'Cloud', icon: Cloud, categoryGroup: 'Tech' },
    { id: 'play', label: 'Start / Action', icon: Play, categoryGroup: 'Media' },
    { id: 'pause', label: 'Rest / Pause', icon: Pause, categoryGroup: 'Media' },
    { id: 'square', label: 'Focus Block', icon: Square, categoryGroup: 'Interface' },
    { id: 'plus-square', label: 'Add Item', icon: PlusSquare, categoryGroup: 'Interface' },
    { id: 'trash', label: 'Clean / Remove', icon: Trash2, categoryGroup: 'Utility' },
    { id: 'close', label: 'Cross', icon: X, categoryGroup: 'Utility' },
    { id: 'plus', label: 'Plus / Create', icon: Plus, categoryGroup: 'Utility' },
    { id: 'clipboard', label: 'Clipboard', icon: Clipboard, categoryGroup: 'Productivity' },
    { id: 'copy', label: 'Duplicate / Study', icon: Copy, categoryGroup: 'Productivity' },

    // --- High-Value Lifestyle, Coding, Habit, & Growth Icons ---
    { id: 'code', label: 'Coding & Dev', icon: Code, categoryGroup: 'Tech' },
    { id: 'terminal', label: 'Terminal / CLI', icon: Terminal, categoryGroup: 'Tech' },
    { id: 'cpu', label: 'AI & Systems', icon: Cpu, categoryGroup: 'Tech' },
    { id: 'dumbbell', label: 'Fitness & Workout', icon: Dumbbell, categoryGroup: 'Health' },
    { id: 'flame', label: 'Streak & Fire', icon: Flame, categoryGroup: 'Growth' },
    { id: 'zap', label: 'Energy & Speed', icon: Zap, categoryGroup: 'Growth' },
    { id: 'heart', label: 'Wellness & Health', icon: Heart, categoryGroup: 'Health' },
    { id: 'activity', label: 'Cardio & Vitals', icon: Activity, categoryGroup: 'Health' },
    { id: 'book', label: 'Reading & Books', icon: BookOpen, categoryGroup: 'Learning' },
    { id: 'graduation', label: 'Study & Academics', icon: GraduationCap, categoryGroup: 'Learning' },
    { id: 'lightbulb', label: 'Ideas & Innovation', icon: Lightbulb, categoryGroup: 'Creative' },
    { id: 'target', label: 'Goals & Milestones', icon: Target, categoryGroup: 'Growth' },
    { id: 'compass', label: 'Exploration & Journey', icon: Compass, categoryGroup: 'Growth' },
    { id: 'sparkles', label: 'Mindfulness & Clarity', icon: Sparkles, categoryGroup: 'Growth' },
    { id: 'star', label: 'Excellence & Favorite', icon: Star, categoryGroup: 'Growth' },
    { id: 'award', label: 'Mastery & Badges', icon: Award, categoryGroup: 'Growth' },
    { id: 'trophy', label: 'Achievement & Win', icon: Trophy, categoryGroup: 'Growth' },
    { id: 'shield', label: 'Discipline & Protection', icon: Shield, categoryGroup: 'Discipline' },
    { id: 'dollar', label: 'Finance & Wealth', icon: DollarSign, categoryGroup: 'Finance' },
    { id: 'coins', label: 'Crypto & Investing', icon: Coins, categoryGroup: 'Finance' },
    { id: 'trending', label: 'Growth & Analytics', icon: TrendingUp, categoryGroup: 'Growth' },
    { id: 'briefcase', label: 'Career & Business', icon: Briefcase, categoryGroup: 'Career' },
    { id: 'calendar', label: 'Daily Routine', icon: Calendar, categoryGroup: 'Productivity' },
    { id: 'clock', label: 'Time Management', icon: Clock, categoryGroup: 'Productivity' },
    { id: 'timer', label: 'Pomodoro & Deep Work', icon: Timer, categoryGroup: 'Productivity' },
    { id: 'coffee', label: 'Habits & Break', icon: Coffee, categoryGroup: 'Lifestyle' },
    { id: 'smile', label: 'Mood & Joy', icon: Smile, categoryGroup: 'Lifestyle' },
    { id: 'sun', label: 'Morning Routine', icon: Sun, categoryGroup: 'Lifestyle' },
    { id: 'moon', label: 'Night Routine & Sleep', icon: Moon, categoryGroup: 'Lifestyle' },
    { id: 'feather', label: 'Journaling & Writing', icon: Feather, categoryGroup: 'Creative' },
    { id: 'send', label: 'Publish & Outreach', icon: Send, categoryGroup: 'Communication' },
    { id: 'rocket', label: 'Product Launch', icon: Rocket, categoryGroup: 'Growth' },
    { id: 'bookmark', label: 'Curate & Save', icon: Bookmark, categoryGroup: 'Productivity' },
    { id: 'check-circle', label: 'Done & Success', icon: CheckCircle2, categoryGroup: 'Productivity' },
];

/**
 * Quick helper to resolve icon component by ID or fallback
 */
export const getCategoryIconComponent = (iconId?: string, fallback: LucideIcon = Target): LucideIcon => {
    if (!iconId) return fallback;
    const match = CATEGORY_ICON_OPTIONS.find(
        (item) => item.id.toLowerCase() === iconId.toLowerCase()
    );
    if (match) return match.icon;

    // Handle legacy alias mappings
    const legacyMap: Record<string, LucideIcon> = {
        engineering: Code,
        code: Code,
        fitness: Dumbbell,
        dumbbell: Dumbbell,
        learning: BookOpen,
        book: BookOpen,
        'book-open': BookOpen,
        discipline: Clipboard,
        clipboard: Clipboard,
        'clipboard-check': Clipboard,
        mindfulness: Sparkles,
        sparkles: Sparkles,
    };

    return legacyMap[iconId.toLowerCase()] || fallback;
};
