import React from 'react';
import { NoteColor, STICKY_COLOR_THEMES, COLOR_KEYS } from './stickyNoteConstants';

interface StickyNoteColorPickerProps {
    selectedColor: NoteColor;
    onSelectColor: (color: NoteColor) => void;
}

export const StickyNoteColorPicker: React.FC<StickyNoteColorPickerProps> = ({
    selectedColor,
    onSelectColor,
}) => {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider opacity-75 text-slate-700">
                Paper Color Tint
            </label>
            <div className="grid grid-cols-6 gap-2">
                {COLOR_KEYS.map((c) => {
                    const theme = STICKY_COLOR_THEMES[c];
                    const isSelected = selectedColor === c;
                    return (
                        <button
                            key={c}
                            type="button"
                            onClick={() => onSelectColor(c)}
                            className={`p-2 rounded-xl border text-center flex flex-col items-center space-y-1 transition-all ${theme.paperBg} ${theme.border} ${
                                isSelected
                                    ? 'ring-2 ring-indigo-600 ring-offset-1 scale-105 shadow-sm font-black'
                                    : 'opacity-70 hover:opacity-100 hover:scale-102'
                            }`}
                        >
                            <span className={`w-3.5 h-3.5 rounded-full ${theme.accentDot} shadow-xs`} />
                            <span className="text-[10px] text-slate-800 font-semibold">
                                {theme.name.split(' ')[0]}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
