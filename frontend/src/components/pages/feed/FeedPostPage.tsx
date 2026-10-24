
            {/* Main Post Card Hero */}
            <div className="neu-card p-6 sm:p-10 bg-[#E0E5EC] rounded-3xl border border-white/70 shadow-xl space-y-6 text-left">
                {/* Author Info & Date */}
                <div className="flex items-center space-x-4 pb-4 border-b border-slate-200/60">
                    <div className="w-14 h-14 rounded-2xl neu-inset bg-gradient-to-tr from-sky-500/25 to-purple-500/25 flex items-center justify-center font-black text-lg text-[#1a1c35] border border-white/70 shrink-0">
                        {currentPost.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-base sm:text-lg font-black text-[#1a1c35]">
                                {currentPost.authorName}
                            </h3>
                            {currentPost.authorBadge && (
                                <span className="text-[10px] font-extrabold text-[#549acb] bg-sky-50/90 px-2.5 py-0.5 rounded-md neu-inset border border-sky-200/60">
                                    {currentPost.authorBadge}
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-semibold text-[#717699] flex items-center space-x-1.5 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                                {new Date(currentPost.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a1c35] tracking-tight leading-tight">
                    {currentPost.title}
                </h1>

                {/* Deep Full-Story Content Container */}
                <div className="neu-inset p-6 sm:p-8 rounded-3xl bg-white/50 border border-white/70 shadow-inner">
                    <p className="text-sm sm:text-base font-medium text-[#24294a] leading-loose whitespace-pre-line select-text">
                        {currentPost.content}
                    </p>
                </div>

                {/* Tags */}
                {currentPost.tags && currentPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {currentPost.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-bold text-[#549acb] bg-sky-50/80 px-3 py-1 rounded-xl border border-sky-200/60 shadow-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-200/60">
                    <div className="flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={() => onToggleLike(currentPost.id)}
                            className={`neu-button px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 ${isLiked
                                ? 'text-rose-600 bg-rose-50 border-rose-300 shadow-inner'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                                }`}
                        >
                            <Flame className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{currentPost.likesCount} Respect</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onToggleSave(currentPost.id)}
                            className={`neu-button px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 ${isSaved
                                ? 'text-amber-600 bg-amber-50 border-amber-300 shadow-inner'
                                : 'text-[#717699] hover:text-[#1a1c35]'
                                }`}
                        >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                            <span>{isSaved ? 'Saved in Vault' : 'Save to Vault'}</span>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => onShare(currentPost.id, currentPost.title)}
                        className="neu-button px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black text-[#717699] hover:text-[#1a1c35] flex items-center space-x-2 hover:scale-105 transition-all"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>{isCopied ? 'Link Copied!' : 'Share Quote'}</span>
                    </button>
                </div>
            </div>

            {/* Related Community Posts in Same Category */}
            {relatedPosts.length > 0 && (
                <div className="space-y-3 pt-4">
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-[#549acb]" />
                        <h4 className="text-sm font-black text-[#1a1c35]">
                            More in {config.label}
                        </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {relatedPosts.map((rel) => (
                            <div
                                key={rel.id}
                                onClick={() => onSelectPost?.(rel)}
                                className="neu-card p-4 rounded-2xl bg-[#E0E5EC] hover:bg-[#D8DEE8] border border-white/60 cursor-pointer space-y-2 transition-all hover:scale-102 text-left"
                            >
                                <span className="text-[10px] font-bold text-[#717699] block">
                                    By {rel.authorName}
                                </span>
                                <h5 className="text-xs font-black text-[#1a1c35] line-clamp-2">
                                    {rel.title}
                                </h5>
                                <p className="text-[11px] text-[#647196] line-clamp-2">
                                    {rel.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
