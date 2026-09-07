

                {/* 2. Pinned Sticky Notes Board Preview */}
                <div className="neu-card p-6 bg-[#E0E5EC] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-xl neu-button text-amber-600">
                                <StickyNote className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#1a1c35]">Sticky Notes &amp; Guidelines</h3>
                                <span className="text-[11px] font-medium text-[#717699]">{stickyNotes.length} pinned paper notes</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onTabChange('notes')}
                            className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center space-x-1"
                        >
                            <span>Open Sticky Board</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {stickyNotes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {stickyNotes.slice(0, 4).map((note) => {
                                const bgMap: Record<string, string> = {
                                    yellow: 'bg-amber-100/90 border-amber-300 text-amber-950',
                                    green: 'bg-emerald-100/90 border-emerald-300 text-emerald-950',
                                    blue: 'bg-sky-100/90 border-sky-300 text-sky-950',
                                    purple: 'bg-purple-100/90 border-purple-300 text-purple-950',
                                    rose: 'bg-rose-100/90 border-rose-300 text-rose-950',
                                    gray: 'bg-slate-100/90 border-slate-300 text-slate-900',
                                };
                                const style = bgMap[note.color || 'yellow'] || bgMap.yellow;

                                return (
                                    <div
                                        key={note.id}
                                        onClick={() => onTabChange('notes')}
                                        className={`p-4 rounded-xl border shadow-xs hover:shadow-md cursor-pointer transition-all ${style} space-y-2`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black truncate">{note.title || 'Sticky Note'}</h4>
                                            {note.isPinned && <Pin className="w-3 h-3 fill-current opacity-70" />}
                                        </div>
                                        <p className="text-[11px] leading-relaxed line-clamp-3 font-medium opacity-90">
                                            {note.content}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            onClick={() => onTabChange('notes')}
                            className="p-5 rounded-xl border border-dashed border-[#c8d0e0] text-center cursor-pointer hover:bg-slate-200/30 transition-all space-y-1"
                        >
                            <p className="text-xs font-bold text-[#4a4e69]">No sticky notes pinned yet.</p>
                            <p className="text-[11px] text-slate-400">Click to pin multi-colored cards for research, checklists, and rules.</p>
                        </div>
                    )}
                </div>

                {/* 3. Files & Attached Resources Preview */}
                <div className="neu-card p-6 bg-[#E0E5EC] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-xl neu-button text-indigo-600">
                                <Paperclip className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#1a1c35]">Resources &amp; Attachments</h3>
                                <span className="text-[11px] font-medium text-[#717699]">{attachments.length} attached items</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onTabChange('files')}
                            className="px-3 py-1.5 rounded-xl neu-button text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                        >
                            <span>Vault &amp; Links</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {attachments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {attachments.slice(0, 4).map((att) => (
                                <div
                                    key={att.id}
                                    className="p-3 rounded-xl neu-flat bg-[#E0E5EC] flex items-center justify-between hover:scale-[1.01] transition-transform"
                                >
                                    <div className="flex items-center space-x-2.5 overflow-hidden">
                                        <span className="p-2 rounded-lg neu-inset text-xs font-black uppercase text-indigo-600">
                                            {att.type === 'link' ? '🔗' : att.type === 'pdf' ? '📄' : '📁'}
                                        </span>
                                        <div className="truncate">
                                            <p className="text-xs font-bold text-[#1a1c35] truncate">{att.name}</p>
                                            <span className="text-[10px] text-slate-400">{att.size || 'Resource link'}</span>
                                        </div>
                                    </div>

                                    {att.url && att.url !== '#' && (
                                        <a
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg neu-button text-slate-500 hover:text-indigo-600 shrink-0 ml-2"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            onClick={() => onTabChange('files')}
                            className="p-5 rounded-xl border border-dashed border-[#c8d0e0] text-center cursor-pointer hover:bg-slate-200/30 transition-all space-y-1"
                        >
                            <p className="text-xs font-bold text-[#4a4e69]">No files or links attached yet.</p>
                            <p className="text-[11px] text-slate-400">Click to upload documents, screenshots, or Figma/GitHub bookmarks.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Metadata & Recent Activity Timeline */}
            <div className="lg:col-span-4 space-y-6">
                {/* Metadata Details Card */}
                <div className="neu-card p-5 bg-[#E0E5EC] space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#717699]">
                        Task Attributes
                    </h3>

                    <div className="space-y-3 text-xs">
                        {/* Streak if habit */}
                        {task.isHabit && (
                            <div className="flex items-center justify-between p-3 rounded-xl neu-inset bg-[#dbe2ed]/60">
                                <div className="flex items-center space-x-2 text-amber-600">
                                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <span className="font-bold text-[#1a1c35]">Current Streak</span>
                                </div>
                                <span className="font-black text-amber-600 text-sm">{task.currentStreak || 0} days</span>
                            </div>
                        )}

                        {/* Tags */}
                        <div className="space-y-1.5">
                            <span className="font-bold text-[#717699] flex items-center space-x-1">
                                <Tag className="w-3.5 h-3.5" />
                                <span>Tags</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {task.tags && task.tags.length > 0 ? (
                                    task.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 rounded-lg neu-inset text-[11px] font-black text-[#4a4e69] bg-[#dbe2ee]/50"
                                        >
                                            #{tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-slate-400 italic">No tags assigned</span>
                                )}
                            </div>
                        </div>

                        {/* Created & Updated dates */}
                        <div className="pt-3 border-t border-[#c8d0e0]/70 space-y-2 text-[11px] text-[#717699]">
                            <div className="flex justify-between">
                                <span>Created</span>
                                <span className="font-medium text-[#1a1c35]">
                                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Last Updated</span>
                                <span className="font-medium text-[#1a1c35]">
                                    {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Quick Stream */}
                <div className="neu-card p-5 bg-[#E0E5EC] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-xs font-black uppercase tracking-wider text-[#1a1c35]">
                                Recent Audit Trail
                            </h3>
                        </div>

                        <button
                            onClick={() => onTabChange('activity')}
                            className="text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                            View Full History
                        </button>
                    </div>

                    <div className="space-y-3">
                        {activities.slice(0, 3).map((act) => (
                            <div key={act.id} className="text-xs space-y-0.5 pb-2 border-b border-[#c8d0e0]/50 last:border-0 last:pb-0">
                                <p className="text-[#1a1c35] font-medium leading-tight">{act.message}</p>
                                <span className="text-[10px] text-slate-400">
                                    {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
