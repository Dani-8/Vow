

        try {
            setLoading(true);
            setError(null);

            const tags = tagsInput
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                tags,
                endTime: endTime ? new Date(endTime).toISOString() : null,
                isHabit,
                isPrivate,
            });

            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        tagsInput,
        setTagsInput,
        endTime,
        setEndTime,
        isHabit,
        setIsHabit,
        isPrivate,
        setIsPrivate,
        loading,
        error,
        handleSubmit,
    };
}
