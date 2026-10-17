

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    currentUser,
}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<FeedCategory>('formula');
    const [tagsInput, setTagsInput] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        const tags = tagsInput
            .split(',')
            .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
            .filter((t) => t.length > 0);

        onSubmit({
            authorName: currentUser?.username || 'Fellow Strategist',
            authorBadge: 'Community Builder',
            category,
            title: title.trim(),
            content: content.trim(),
            tags: tags.length > 0 ? tags : ['mindset', category],
        });

        setTitle('');
        setContent('');
        setTagsInput('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg neu-card p-6 bg-[#E0E5EC] rounded-3xl border border-white/60 shadow-2xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full neu-button flex items-center justify-center text-[#717699] hover:text-[#1a1c35] transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl neu-button-primary flex items-center justify-center text-white">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-[#1a1c35]">Share with Community</h2>
                        <p className="text-xs font-semibold text-[#717699]">
                            Post a rule, milestone win, or focus insight
                        </p>
                    </div>
                </div>