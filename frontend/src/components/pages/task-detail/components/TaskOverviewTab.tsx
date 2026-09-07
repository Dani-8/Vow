

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
