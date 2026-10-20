
    // Filtered posts calculation
    const displayedPosts = useMemo(() => {
        return posts.filter((post) => {
            if (feedTab === 'saved' && !savedIds.includes(post.id)) {
                return false;
            }
            if (selectedCategory !== 'all' && post.category !== selectedCategory) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesTitle = post.title.toLowerCase().includes(q);
                const matchesContent = post.content.toLowerCase().includes(q);
                const matchesAuthor = post.authorName.toLowerCase().includes(q);
                const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q));
                if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesTags) {
                    return false;
                }
            }
            return true;
        });
    }, [posts, feedTab, savedIds, selectedCategory, searchQuery]);

    return {
        posts,
        displayedPosts,
        savedIds,
        likedIds,
        feedTab,
        setFeedTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        copiedId,
        handleToggleLike,
        handleToggleSave,
        handleShare,
        handleCreatePost,
    };
}
