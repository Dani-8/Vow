
                {/* Right Side: Circular Progress Ring */}
                <div className="flex flex-col items-center justify-center neu-card p-6 min-w-[160px] self-start">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                className="stroke-[#d1d9e6]"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            {/* Progress Ring Gradient / Color */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                className="stroke-[#2563eb] transition-all duration-700 ease-out"
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="transparent"
                            />
                        </svg>

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
