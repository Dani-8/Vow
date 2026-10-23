
                <button
                    onClick={() => onSelectTab('saved')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${feedTab === 'saved'
                        ? 'neu-button text-amber-600 bg-[#E0E5EC] shadow-sm'
                        : 'text-[#717699] hover:text-[#1a1c35]'
                        }`}
                >
                    <BookmarkCheck className="w-4 h-4 text-amber-500" />
                    <span>Saved in Vault ({savedPostsCount})</span>
                </button>
            </div>

            {/* Search Input */}
            <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717699]" />
                <input
                    type="text"
                    placeholder="Search formulas, goals, tags..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full neu-inset pl-9 pr-4 py-2 rounded-xl text-xs font-bold text-[#1a1c35] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#549acb]"
                />
            </div>
        </div>
    );
};
