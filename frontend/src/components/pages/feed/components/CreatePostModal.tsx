

                    {/* Tags */}
                    <div>
                        <label className="text-[11px] font-bold text-[#515777] block mb-1 uppercase tracking-wider">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            placeholder="story, transformation, mindset, focus"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="w-full neu-inset px-4 py-2 rounded-xl text-xs font-semibold text-[#1a1c35] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#549acb]"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/60">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-[#717699] hover:text-[#1a1c35]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="neu-button-primary px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-1.5 text-white shadow-md hover:scale-105 transition-all"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>Publish to Feed</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
