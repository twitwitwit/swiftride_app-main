import React, { useState } from 'react';
import { 
  Navigation, 
  Wallet, 
  FileText, 
  MessageSquare, 
  User, 
  Power, 
  Car, 
  Star, 
  ShieldCheck, 
  Clock, 
  Radio
} from 'lucide-react';
import { DriverAuth } from './DriverAuth';
import { DriverHome } from './DriverHome';
import { DriverTrips } from './DriverTrips';
import { DriverEarnings } from './DriverEarnings';
import { DriverProfile } from './DriverProfile';
import { DriverChat } from './DriverChat';
import { MobileDeviceFrame } from '../common/MobileDeviceFrame';
import { useRide } from '../../context/RideContext';

interface DriverAppProps {
  onSwitchToPassenger?: () => void;
}

export const DriverApp: React.FC<DriverAppProps> = ({ onSwitchToPassenger }) => {
  const { 
    driver, 
    activeRide, 
    incomingDriverRide, 
    toggleDriverOnline 
  } = useRide();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'earnings' | 'trips' | 'chat' | 'profile'>('home');
  const [chatRideId, setChatRideId] = useState<string | undefined>(undefined);

  const handleNavigateToChat = (rideId: string) => {
    setChatRideId(rideId);
    setActiveTab('chat');
  };

  if (!isAuthenticated) {
    return (
      <MobileDeviceFrame
        appTitle="SwiftRide Driver"
        appSubtitle="Driver Partner App • Metro Manila"
        badge="Partner Sign In"
        badgeColor="bg-blue-500 text-white"
      >
        <div className="flex-1 w-full bg-slate-50 flex items-center justify-center p-4">
          <DriverAuth
            onSuccess={() => setIsAuthenticated(true)}
            onSwitchRole={(role) => {
              if (role === 'passenger' && onSwitchToPassenger) {
                onSwitchToPassenger();
              }
            }}
          />
        </div>
      </MobileDeviceFrame>
    );
  }

  return (
    <MobileDeviceFrame
      appTitle="SwiftRide Driver"
      appSubtitle="Driver Partner App • Metro Manila"
      badge="Driver Portal"
      badgeColor="bg-blue-500 text-white"
    >
      <div className="flex-1 w-full h-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans select-none">
        
        {/* Mobile Driver App Header */}
        <div className="bg-white border-b border-slate-200 px-3.5 py-2 flex items-center justify-between shrink-0 z-30 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-fc-fast text-sm font-bold tracking-wide italic text-slate-900 leading-none">
                  SWIFT<span className="text-amber-500">RIDE</span>
                </span>
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider font-mono">
                  Driver
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                <span>{driver.vehicle.plateNumber}</span>
                <span>&bull;</span>
                <span className="text-amber-600 font-bold">★ {driver.rating}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tactile Online / Offline Switch Pill */}
            <button
              onClick={toggleDriverOnline}
              id="btn-driver-power-switch"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono transition-all border shadow-2xs cursor-pointer ${
                driver.status === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                driver.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}></span>
              <span>{driver.status === 'online' ? 'ONLINE' : 'OFFLINE'}</span>
            </button>

            {/* Earnings Pill Button */}
            <button
              onClick={() => setActiveTab('earnings')}
              className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Wallet className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] font-black text-slate-800 font-mono">
                ₱{driver.todayEarnings.toFixed(0)}
              </span>
            </button>
          </div>
        </div>

        {/* Main Content Screen Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50">
          {activeTab === 'home' && (
            <DriverHome
              onNavigateToChat={handleNavigateToChat}
              onNavigateToEarnings={() => setActiveTab('earnings')}
            />
          )}

          {activeTab === 'earnings' && (
            <DriverEarnings />
          )}

          {activeTab === 'trips' && (
            <DriverTrips />
          )}

          {activeTab === 'chat' && (
            <DriverChat
              rideId={chatRideId}
              onBack={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'profile' && (
            <DriverProfile
              onLogout={() => setIsAuthenticated(false)}
            />
          )}
        </div>

        {/* Mobile Bottom Navigation Bar (Fixed at bottom of driver phone) */}
        <div className="bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around z-30 shrink-0 shadow-sm">
          <button
            id="mobile-nav-driver-console"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'home' ? 'text-amber-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span className="text-[10px]">Console</span>
            {(incomingDriverRide || activeRide) && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          <button
            id="mobile-nav-driver-earnings"
            onClick={() => setActiveTab('earnings')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'earnings' ? 'text-amber-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-[10px]">Earnings</span>
          </button>

          <button
            id="mobile-nav-driver-trips"
            onClick={() => setActiveTab('trips')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'trips' ? 'text-amber-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[10px]">Trips</span>
          </button>

          <button
            id="mobile-nav-driver-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'chat' ? 'text-amber-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px]">Chat</span>
            {activeRide && (
              <span className="absolute top-1 right-2.5 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            )}
          </button>

          <button
            id="mobile-nav-driver-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile' ? 'text-amber-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </div>
    </MobileDeviceFrame>
  );
};
