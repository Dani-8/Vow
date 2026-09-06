
                        {/* Percentage Text Center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-extrabold text-[#1a1c35]">
                                {progressPercent}%
                            </span>
                        </div>
                    </div>

                    <div className="mt-2 text-xs font-bold text-[#717699]">
                        {completedCount} / {totalCount}
                    </div>
                </div>
            </div>
        </div>
    );
};
