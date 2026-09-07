import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  appTitle: string;
  appSubtitle?: string;
  badge?: string;
  badgeColor?: string;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  appTitle,
  appSubtitle = 'iOS & Android Compatible',
  badge,
  badgeColor = 'bg-amber-400 text-slate-950',
}) => {
  const [timeString, setTimeString] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeString(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-zinc-950 via-zinc-900 to-black select-none">
      {/* Mobile Device Identification Header */}
      <div className="w-full max-w-[430px] flex items-center justify-between px-2 mb-2 sm:mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 shadow-xs">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-white font-display tracking-tight">
                {appTitle}
              </span>
              {badge && (
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full shadow-xs uppercase ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">{appSubtitle}</p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-zinc-500 bg-zinc-900/90 px-2.5 py-1 rounded-full border border-zinc-800 flex items-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Mobile Viewport</span>
        </div>
      </div>

      {/* Realistic Smartphone Chassis Frame */}
      <div className="relative w-full max-w-[420px] h-[780px] max-h-[calc(100vh-120px)] sm:max-h-[820px] bg-zinc-900 rounded-[48px] p-3 sm:p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_0_2px_rgba(255,255,255,0.05)] border-4 border-zinc-800/90 flex flex-col shrink-0">
        
        {/* Hardware side button impressions */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-9 bg-zinc-700 rounded-l-sm" title="Volume Up"></div>
        <div className="absolute -left-[7px] top-40 w-[3px] h-9 bg-zinc-700 rounded-l-sm" title="Volume Down"></div>
        <div className="absolute -right-[7px] top-32 w-[3px] h-14 bg-zinc-700 rounded-r-sm" title="Power / Lock"></div>

        {/* Inner Phone Screen */}
        <div className="relative w-full h-full bg-slate-950 rounded-[38px] overflow-hidden flex flex-col shadow-inner border border-zinc-800">
          
          {/* iOS Dynamic Island & Status Bar */}
          <div className="relative w-full h-11 bg-slate-950 text-white flex items-center justify-between px-6 shrink-0 z-40 select-none">
            {/* Clock Time */}
            <span className="text-[12px] font-bold font-mono tracking-tight text-slate-100">
              {timeString}
            </span>

            {/* Dynamic Island Capsule */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-5 w-24 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-sm border border-zinc-800">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></span>
            </div>

            {/* Status Icons: Signal, 5G, Battery */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold font-mono">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* App Content Area */}
          <div className="flex-1 w-full overflow-hidden flex flex-col relative bg-slate-50 text-slate-900">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-full h-5 bg-slate-950 flex items-center justify-center shrink-0 z-40">
            <div className="w-32 h-1 bg-slate-600/80 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
