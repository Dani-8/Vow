

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
