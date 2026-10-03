import React, { useState } from 'react';
import { MessageSquare, Send, AlertTriangle, Target, TrendingUp } from 'lucide-react';

interface TaskActivityCommentBoxProps {
    onAddComment: (message: string, commentType?: string) => void;
}

export const TaskActivityCommentBox: React.FC<TaskActivityCommentBoxProps> = ({
    onAddComment,
}) => {
    const [commentText, setCommentText] = useState('');
    const [commentCategory, setCommentCategory] = useState<'update' | 'blocker' | 'milestone'>('update');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        onAddComment(commentText.trim(), commentCategory);
        setCommentText('');
    };

    return (
        <div className="neu-card p-5 bg-[#E0E5EC] space-y-4">
            <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-[#1a1c35]">Log Check-in &amp; Progress Note</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share a status update, highlight a blocker, or record a key milestone reached..."
                    rows={3}
                    className="w-full p-3 rounded-xl neu-inset bg-[#dbe2ee]/60 text-xs font-medium text-[#1a1c35] focus:outline-none placeholder:text-slate-400 resize-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {/* Category Type Pills */}
                    <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-slate-500">Category:</span>
                        <div className="flex items-center space-x-1.5">
                            {[
                                { id: 'update', label: 'Progress Update', icon: TrendingUp },
                                { id: 'blocker', label: 'Blocker', icon: AlertTriangle },
                                { id: 'milestone', label: 'Milestone', icon: Target },
                            ].map((cat) => {
                                const Icon = cat.icon;
                                const isSelected = commentCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCommentCategory(cat.id as any)}
                                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1 ${isSelected
                                                ? 'neu-inset text-indigo-600 font-black'
                                                : 'neu-button text-slate-500 hover:text-slate-800'
                                            }`}
                                    >
                                        <Icon className="w-3 h-3" />
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="px-4 py-2 rounded-xl neu-button-primary text-xs font-bold text-white flex items-center space-x-1.5 disabled:opacity-50"
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post Check-in</span>
                    </button>
                </div>
            </form>
        </div>
    );
};
