import React from 'react';

interface DigitalClockCardProps {
  formattedHoursMinutes: string;
  formattedDate: string;
  formattedDayName: string;
}

export const DigitalClockCard: React.FC<DigitalClockCardProps> = ({
  formattedHoursMinutes,
  formattedDate,
  formattedDayName,
}) => {
  return (
    <div className="lg:col-span-4 neu-card p-6 flex flex-col items-center justify-center text-center">
      <span className="text-xs font-bold text-[#647196] mb-3">Current Time</span>

      {/* Perfect Neumorphic Double-Ring Circular Clock Face */}
      <div className="w-48 h-48 rounded-full bg-[#E0E5EC] p-3.5 flex items-center justify-center shadow-[8px_8px_18px_rgba(163,177,198,0.65),-8px_-8px_18px_rgba(255,255,255,0.85)] border border-white/60 relative my-1">
        <div className="w-full h-full rounded-full bg-[#E0E5EC] shadow-[inset_7px_7px_14px_rgba(163,177,198,0.65),inset_-7px_-7px_14px_rgba(255,255,255,0.9)] flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-[#29335a] tracking-wider font-mono">
            {formattedHoursMinutes}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-bold text-[#29335a]">{formattedDate}</p>
        <p className="text-xs font-semibold text-[#647196]">{formattedDayName}</p>
      </div>
    </div>
  );
};
