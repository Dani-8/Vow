

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
