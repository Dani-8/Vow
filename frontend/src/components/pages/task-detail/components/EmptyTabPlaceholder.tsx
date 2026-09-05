

            <h3 className="text-xl font-extrabold text-[#1a1c35] mb-2 tracking-tight">
                {current.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#717699] max-w-md leading-relaxed font-medium mb-6">
                {current.subtitle}
            </p>

            <div className="neu-inset px-4 py-2 rounded-xl inline-flex items-center space-x-2 text-xs font-semibold text-[#549acb]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                <span>Feature under active development</span>
            </div>
        </div>
    );
};
