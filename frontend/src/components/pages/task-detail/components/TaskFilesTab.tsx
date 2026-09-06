
                    ).map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setFilterType(t.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterType === t.id
                                ? 'neu-inset text-[#549acb] font-black'
                                : 'neu-button text-[#717699] hover:text-[#1a1c35]'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Files Grid */}
            {filteredAttachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAttachments.map((att) => (
                        <div
                            key={att.id}
                            className="neu-card p-4 bg-[#E0E5EC] space-y-3 hover:scale-[1.01] transition-transform relative group"
                        >
                            {/* Top Row */}
                            <div className="flex items-start justify-between">
                                <div className="p-2.5 rounded-xl neu-inset bg-[#dbe2ee]/70 shrink-0">
                                    {getAttachmentIcon(att)}
                                </div>

                                <div className="flex items-center space-x-1">
                                    {att.url && att.url !== '#' && (
                                        <a
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg neu-button text-slate-500 hover:text-indigo-600"
                                            title="Open resource"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => onDeleteAttachment(att.id)}
                                        className="p-1.5 rounded-lg neu-button text-slate-400 hover:text-rose-600 transition-colors"
                                        title="Delete attachment"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Image Preview if applicable */}
                            {att.type === 'image' && att.previewUrl && (
                                <div className="h-28 w-full rounded-xl overflow-hidden neu-inset bg-slate-900/10">
                                    <img
                                        src={att.previewUrl}
                                        alt={att.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Title & Metadata */}
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-[#1a1c35] line-clamp-2" title={att.name}>
                                    {att.name}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span>{att.size || 'Web link'}</span>
                                    <span>
                                        {att.uploadedAt ? new Date(att.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
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
