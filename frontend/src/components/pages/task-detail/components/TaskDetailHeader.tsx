

                    {/* Description */}
                    <p className="text-sm text-[#54597d] leading-relaxed max-w-2xl font-medium pt-1">
                        {task.description ||
                            'Outline key milestones for skill acquisition and daily habit consistency for Q3.'}
                    </p>

                    {/* Info Pills Row */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        {/* Due Date Pill */}
                        <div className="neu-button px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#1a1c35]">
                            <Calendar className="w-4 h-4 text-[#549acb]" />
                            <span>Due: Aug 20, 2026</span>
                        </div>

                        {/* Time Left Pill */}
                        <div className="neu-button px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#1a1c35]">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span>Time Left: 1h 34m</span>
                        </div>

                        {/* Status Pill */}
                        <div className="neu-button px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#1a1c35]">
                            <PlayCircle className="w-4 h-4 text-blue-500" />
                            <span>
                                Status:{' '}
                                {task.status === 'completed'
                                    ? 'Completed'
                                    : task.status === 'in_progress'
                                        ? 'In Progress'
                                        : 'In Progress'}
                            </span>
                        </div>
                    </div>
                </div>

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
