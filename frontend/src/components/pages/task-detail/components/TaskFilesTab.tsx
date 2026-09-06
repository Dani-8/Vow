
                </div>
            ) : (
                <div className="neu-card p-10 bg-[#E0E5EC] text-center space-y-2">
                    <Paperclip className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-[#1a1c35]">No attachments found</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        {searchQuery
                            ? 'No files matching your search term. Try adjusting your query or filter.'
                            : 'Upload project briefs, design screenshots, reference documents, or save external links to keep everything in one place.'}
                    </p>
                </div>
            )}

            {/* Add Link Bookmark Modal */}
            {isLinkModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
                    <div className="neu-card p-6 bg-[#E0E5EC] max-w-md w-full space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Globe className="w-5 h-5 text-sky-600" />
                                <h3 className="text-base font-black text-[#1a1c35]">Add URL Bookmark</h3>
                            </div>
                            <button
                                onClick={() => setIsLinkModalOpen(false)}
                                className="text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                                ✕
                            </button>
                        </div>

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
