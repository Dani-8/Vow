

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
