
                        <form onSubmit={handleAddLink} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#717699]">Resource URL *</label>
                                <input
                                    type="text"
                                    required
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://figma.com/file/... or github.com/..."
                                    className="w-full px-3.5 py-2.5 rounded-xl neu-inset bg-[#dbe2ee]/60 text-xs font-medium focus:outline-none text-[#1a1c35]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#717699]">Custom Title (Optional)</label>
                                <input
                                    type="text"
                                    value={linkName}
                                    onChange={(e) => setLinkName(e.target.value)}
                                    placeholder="e.g. Design Specs &amp; Flow Diagram"
                                    className="w-full px-3.5 py-2.5 rounded-xl neu-inset bg-[#dbe2ee]/60 text-xs font-medium focus:outline-none text-[#1a1c35]"
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="px-4 py-2 rounded-xl neu-button text-xs font-bold text-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl neu-button-primary text-xs font-bold text-white shadow-sm"
                                >
                                    Save Bookmark
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
