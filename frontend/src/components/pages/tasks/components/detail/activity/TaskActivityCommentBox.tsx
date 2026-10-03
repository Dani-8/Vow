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
