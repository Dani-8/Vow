import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Clock, Flame, CheckCircle2, Bot, User as UserIcon } from 'lucide-react';
import { Task, AIChatMessage } from '../types';
import { api } from '../api';

interface AIAssistModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

export const AIAssistModal: React.FC<AIAssistModalProps> = ({ isOpen, task, onClose }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task && isOpen) {
      // Welcome message from Vow AI Coach initialized for the task
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          text: `Hey there! I notice you're working on **"${task.title}"**. How can I help you make progress today? You can pick a quick shortcut below or type your question.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [task, isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen || !task) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const userText = textToSend || inputMessage.trim();
    if (!userText || loading) return;

    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const historyForApi = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await api.requestAIAssist({
        taskTitle: task.title,
        description: task.description,
        tags: task.tags,
        endTime: task.endTime,
        status: task.status,
        userMessage: userText,
        chatHistory: historyForApi,
      });

      const assistantMsg: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `⚠️ ${err.message || 'Apologies, I encountered an issue connecting to Gemini AI.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="neu-card w-full max-w-2xl h-[85vh] flex flex-col bg-[#E0E5EC] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-white/40 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl neu-button flex items-center justify-center bg-[#6D5DFC] text-white shadow-md">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-[#1a1c35]">Vow AI Task Coach</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D5DFC] bg-indigo-100/60 px-2 py-0.5 rounded-full border border-indigo-200/50">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-[#717699] font-medium truncate max-w-sm">
                Targeting: <strong className="text-[#44476A]">"{task.title}"</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl neu-button text-[#717699] hover:text-[#1a1c35]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Context Summary Card */}
        <div className="px-5 py-3 bg-slate-200/50 border-b border-slate-200 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-600">Streak: 🔥 {task.currentStreak || 0}d</span>
            {task.endTime && (
              <span className="font-semibold text-amber-700 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Deadline: {new Date(task.endTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
              </span>
            )}
          </div>
          <span className="font-bold uppercase text-[10px] tracking-wider text-slate-500">{task.status}</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl neu-badge flex items-center justify-center text-indigo-600 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                  msg.role === 'user'
                    ? 'neu-button-primary text-white rounded-tr-none'
                    : 'neu-card bg-[#eef2f7] text-slate-800 rounded-tl-none border border-white'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                <span className={`text-[10px] font-medium block mt-1.5 ${msg.role === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl neu-badge flex items-center justify-center text-slate-600 shrink-0 mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl neu-badge flex items-center justify-center text-indigo-600 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="neu-card p-3 rounded-2xl text-xs text-slate-500 font-semibold animate-pulse">
                Gemini is crafting micro-steps...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="px-5 py-2 border-t border-slate-200/80 flex items-center space-x-2 overflow-x-auto shrink-0">
          <button
            onClick={() => handleSendMessage('Break this task down into 3 ultra-small 10-minute micro-steps.')}
            disabled={loading}
            className="neu-button px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 whitespace-nowrap"
          >
            ⚡ 10-Min Micro-Steps
          </button>
          <button
            onClick={() => handleSendMessage('I am feeling stuck or unmotivated with this. Give me a non-judgmental boost.')}
            disabled={loading}
            className="neu-button px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 whitespace-nowrap"
          >
            🔥 Motivation Boost
          </button>
          <button
            onClick={() => handleSendMessage('Suggest a gentle rescheduling or time-block strategy for this goal.')}
            disabled={loading}
            className="neu-button px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 whitespace-nowrap"
          >
            📅 Reschedule Plan
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t border-slate-200 flex items-center space-x-2 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Vow AI for advice or breakdown..."
            className="flex-1 px-4 py-2.5 rounded-xl neu-input text-sm font-medium"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="neu-button-primary p-2.5 rounded-xl text-white disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
