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
