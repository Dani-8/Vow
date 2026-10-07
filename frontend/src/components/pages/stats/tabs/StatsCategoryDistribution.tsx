                                    <div>
                                        <h4 className="text-xs font-black text-[#1a1c35]">{cat.name}</h4>
                                        <span className="text-[10px] font-semibold text-[#717699]">
                                            {cat.itemCount} active item{cat.itemCount === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-[#1a1c35]">{cat.percentage}%</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-2 rounded-full bg-slate-300 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${cat.percentage}%`,
                                        backgroundColor: cat.color,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
