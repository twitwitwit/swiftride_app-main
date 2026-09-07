import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Shield, ShieldAlert } from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onNavigateTab?: (tab: AdminTab) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = "Dashboard",
  subtitle = "Welcome back, Admin! Here's what's happening with SwiftRide today.",
  onNavigateTab
}) => {
  const { showNotification, emergencyRequests } = useRide();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeEmergencies = emergencyRequests.filter(e => e.status === 'active');
  const activeCount = activeEmergencies.length;

  return (
    <header className="bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-lg font-black text-white font-display flex items-center gap-2">
          <span>{title}</span>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
            SYSTEM LIVE
          </span>
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-0.5">{subtitle}</p>
      </div>

      {/* Right Controls: Search, Reset, Emergency Alert, Notifications, Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Active Emergency Alert Button in Header */}
        {activeCount > 0 && (
          <button
            onClick={() => onNavigateTab && onNavigateTab('emergency')}
            className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold border border-rose-500 cursor-pointer transition-colors"
            title={`${activeCount} Critical User SOS Alert(s) Pending Response`}
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>{activeCount} Emergency SOS</span>
          </button>
        )}

        {/* Global Search */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search telemetry, drivers, rides..."
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
          />
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => onNavigateTab ? onNavigateTab('notifications') : showNotification('System Notifications', '12 new passenger & driver telemetry alerts logged.', 'info')}
          className="relative w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-mono font-black flex items-center justify-center ring-2 ring-zinc-950">
            {activeCount > 0 ? activeCount : 12}
          </span>
        </button>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-xs shadow-md">
            AD
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-white leading-tight">Admin Master</p>
            <p className="text-[10px] text-amber-400 font-mono">Super Administrator</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>
    </header>
  );
};
