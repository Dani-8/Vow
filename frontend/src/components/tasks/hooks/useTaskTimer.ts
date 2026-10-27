const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);
const [isStruggling, setIsStruggling] = useState<boolean>(false);

useEffect(() => {
    if (!task.endTime) {
        setTimeLeftStr(null);
        setIsStruggling(false);
        return;
    }