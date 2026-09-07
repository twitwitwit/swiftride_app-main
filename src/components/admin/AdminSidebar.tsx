import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Compass, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  LifeBuoy, 
  Bell, 
  Settings, 
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { SwiftRideLogo } from '../common/SwiftRideLogo';

export type AdminTab = 
  | 'dashboard'
  | 'passengers'
  | 'drivers'
  | 'live_trips'
  | 'bookings'
  | 'earnings'
  | 'reports'
  | 'support'
  | 'notifications'
  | 'settings'
  | 'emergency';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingApplicationsCount: number;
  openTicketsCount: number;
  activeEmergencyCount?: number;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingApplicationsCount,
  openTicketsCount,
  activeEmergencyCount = 0,
  onLogout
}) => {
  const menuItems: { id: AdminTab; label: string; icon: any; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'emergency', label: 'Emergency SOS', icon: ShieldAlert, badge: activeEmergencyCount > 0 ? activeEmergencyCount : undefined, badgeColor: 'bg-rose-600 text-white animate-pulse' },
    { id: 'passengers', label: 'Passengers', icon: Users },
    { id: 'drivers', label: 'Drivers', icon: Car, badge: pendingApplicationsCount > 0 ? pendingApplicationsCount : undefined, badgeColor: 'bg-amber-500 text-slate-950' },
    { id: 'live_trips', label: 'Live Trips', icon: Compass },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'support', label: 'Support', icon: LifeBuoy, badge: openTicketsCount > 0 ? openTicketsCount : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 12, badgeColor: 'bg-rose-500 text-white' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-zinc-800/80 bg-black/40 flex items-center justify-between">
          <SwiftRideLogo size="sm" variant="horizontal" theme="dark" showSubtitle={false} />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-black text-amber-400' : (item.badgeColor || 'bg-zinc-800 text-slate-300')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Info & Logout */}
      <div className="p-4 border-t border-zinc-800 space-y-3">
        <div className="p-2.5 bg-zinc-900/80 rounded-2xl border border-zinc-800 flex items-center justify-between text-[11px] font-mono">
          <div>
            <p className="text-slate-400 text-[10px]">SERVER STATUS</p>
            <p className="text-emerald-400 font-bold">OPERATIONAL</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-bold text-slate-400 hover:text-rose-400 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Session</span>
        </button>

        <p className="text-[10px] text-slate-600 text-center font-mono uppercase tracking-widest">
          SwiftRide v4.0.2 Bento
        </p>
      </div>
    </aside>
  );
};
