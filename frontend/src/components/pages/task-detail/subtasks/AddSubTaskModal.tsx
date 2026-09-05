
                    {/* Time Left & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#717699] uppercase tracking-wider mb-2">
                                Time Left
                            </label>
                            <input
                                type="text"
                                value={timeLeft}
                                onChange={(e) => setTimeLeft(e.target.value)}
                                placeholder="Today / 2 Days Left"
                                className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#717699] uppercase tracking-wider mb-2">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                                className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                            >
                                <option value="High">🔥 High</option>
                                <option value="Medium">⚡ Medium</option>
                                <option value="Low">🌱 Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-[#717699] uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add key milestones, habits or requirements..."
                            className="w-full px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#c8d0e0]/60">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl neu-button text-xs font-bold text-[#717699]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl neu-button-primary text-xs font-bold flex items-center space-x-2"
                        >
                            {editingSubTask ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            <span>{editingSubTask ? 'Update Sub-Task' : 'Create Sub-Task'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
