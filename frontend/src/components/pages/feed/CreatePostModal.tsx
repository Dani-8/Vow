

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
