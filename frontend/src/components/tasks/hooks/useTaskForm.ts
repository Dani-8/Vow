

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
