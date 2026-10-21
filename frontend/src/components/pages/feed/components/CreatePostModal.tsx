
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category Selection */}
                    <div>
                        <label className="text-[11px] font-bold text-[#515777] block mb-1.5 uppercase tracking-wider">
                            Post Type / Category
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                const isSelected = category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`p-2 rounded-xl text-left transition-all flex items-center space-x-1.5 ${isSelected
                                            ? 'neu-button border-2 border-[#549acb] bg-sky-50/80 text-[#549acb]'
                                            : 'neu-card bg-[#E0E5EC] hover:bg-[#D8DEE8] text-[#515777]'
                                            }`}
                                    >
                                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#549acb]' : 'text-[#717699]'}`} />
                                        <span className="text-[11px] font-black truncate">{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-[11px] font-bold text-[#515777] block mb-1 uppercase tracking-wider">
                            Headline / Goal
                        </label>
                        <input
                            type="text"
                            required
                            placeholder={category === 'story' ? 'e.g. How I Rebuilt My Focus From Scratch in 6 Months' : 'e.g. Goal + Deadline + Plan = Strategy'}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full neu-inset px-4 py-2.5 rounded-xl text-xs font-bold text-[#1a1c35] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#549acb]"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-[11px] font-bold text-[#515777] block mb-1 uppercase tracking-wider">
                            Content, Framework or Story
                        </label>
                        <textarea
                            required
                            rows={5}
                            placeholder={
                                category === 'story'
                                    ? 'Share your journey, how you overcame struggles, your mindset shifts, and what this app helped you achieve...'
                                    : 'Share the formula, your routine, or the insight that helped you stay disciplined...'
                            }
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full neu-inset p-3.5 rounded-xl text-xs font-semibold text-[#1a1c35] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#549acb] resize-none"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-[11px] font-bold text-[#515777] block mb-1 uppercase tracking-wider">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            placeholder="story, transformation, mindset, focus"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="w-full neu-inset px-4 py-2 rounded-xl text-xs font-semibold text-[#1a1c35] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#549acb]"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/60">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="neu-button-primary px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-1.5 text-white shadow-md hover:scale-105 transition-all"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>Publish to Feed</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
