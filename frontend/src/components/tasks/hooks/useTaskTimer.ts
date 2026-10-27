    const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);
    const [isStruggling, setIsStruggling] = useState<boolean>(false);

    useEffect(() => {
        if (!task.endTime) {
            setTimeLeftStr(null);
            setIsStruggling(false);
            return;
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const end = new Date(task.endTime!).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeftStr('Overdue');
                setIsStruggling(task.status !== 'completed');