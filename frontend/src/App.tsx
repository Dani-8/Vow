import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-400 mb-2">Vow</h1>
        <p className="text-slate-400 mb-6">Personal Accountability Vault & Habit Tracker</p>
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-sm text-slate-300">
          Frontend application successfully initialized!
        </div>
      </div>
    </div>
  );
}