import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  MessageSquare, 
  User, 
  Sparkles, 
  MapPin, 
  Wallet, 
  Car, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { PassengerAuth } from './PassengerAuth';
import { PassengerHome } from './PassengerHome';
import { PassengerBookRide } from './PassengerBookRide';
import { PassengerTrips } from './PassengerTrips';
import { PassengerChat } from './PassengerChat';
import { PassengerProfile } from './PassengerProfile';
import { MobileDeviceFrame } from '../common/MobileDeviceFrame';
import { useRide } from '../../context/RideContext';
import { VehicleCategory } from '../../types';

interface PassengerAppProps {
  onSwitchToDriver?: () => void;
}

export const PassengerApp: React.FC<PassengerAppProps> = ({ onSwitchToDriver }) => {
  const { passenger, activeRide } = useRide();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'book' | 'history' | 'chat' | 'profile'>('home');
  const [bookDestination, setBookDestination] = useState<string | undefined>(undefined);
  const [bookVehicle, setBookVehicle] = useState<VehicleCategory | undefined>(undefined);
  const [targetChatRideId, setTargetChatRideId] = useState<string | undefined>(undefined);

  const handleNavigateToBook = (dest?: string, vehicle?: VehicleCategory) => {
    setBookDestination(dest);
    setBookVehicle(vehicle);
    setActiveTab('book');
  };

  const handleNavigateToChat = (rideId: string) => {
    setTargetChatRideId(rideId);
    setActiveTab('chat');
  };

  if (!isAuthenticated) {
    return (
      <MobileDeviceFrame
        appTitle="SwiftRide Passenger"
        appSubtitle="Passenger Mobile App • Metro Manila"
        badge="Sign In"
      >
        <div className="flex-1 w-full bg-slate-50 flex items-center justify-center p-4">
          <PassengerAuth
            onSuccess={() => setIsAuthenticated(true)}
            onSwitchRole={(role) => {
              if (role === 'driver' && onSwitchToDriver) {
                onSwitchToDriver();
              }
            }}
          />
        </div>
      </MobileDeviceFrame>
    );
  }

  return (
    <MobileDeviceFrame
      appTitle="SwiftRide Passenger"
      appSubtitle="Passenger Mobile App • Metro Manila"
      badge="Passenger App"
      badgeColor="bg-amber-400 text-slate-950"
    >
      <div className="flex-1 w-full h-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans select-none">
        
        {/* Mobile App Header */}
        <div className="bg-white border-b border-slate-200 px-3.5 py-2 flex items-center justify-between shrink-0 z-30 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Car className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-fc-fast text-sm font-bold tracking-wide italic text-slate-900 leading-none">
                  SWIFT<span className="text-amber-500">RIDE</span>
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-mono">
                  Rider
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-amber-500" />
                <span>Metro Manila &bull; Caloocan</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Active Ride Indicator Pill */}
            {activeRide && (
              <button
                onClick={() => setActiveTab('book')}
                className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-[10px] font-bold font-mono flex items-center gap-1 animate-pulse cursor-pointer"
                title="Active Trip in Progress"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Active</span>
              </button>
            )}

            {/* Wallet Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Wallet className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] font-black text-slate-800 font-mono">
                ₱{passenger.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </button>

            {/* Profile Avatar */}
            <button 
              onClick={() => setActiveTab('profile')}
              className="cursor-pointer"
            >
              <img
                src={passenger.avatar}
                alt={passenger.name}
                className="w-7 h-7 rounded-lg object-cover border border-amber-400/80"
              />
            </button>
          </div>
        </div>

        {/* Main Content Screen Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50">
          {activeTab === 'home' && (
            <PassengerHome
              onNavigateToBook={handleNavigateToBook}
              onNavigateToNotifications={() => setActiveTab('chat')}
            />
          )}

          {activeTab === 'book' && (
            <PassengerBookRide
              initialDestination={bookDestination}
              initialVehicle={bookVehicle}
              onNavigateToChat={handleNavigateToChat}
              onBack={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'history' && (
            <PassengerTrips
              onRebookTrip={(pickup, dropoff) => {
                setBookDestination(dropoff);
                setActiveTab('book');
              }}
            />
          )}

          {activeTab === 'chat' && (
            <PassengerChat
              rideId={targetChatRideId}
              onBack={() => setActiveTab('book')}
            />
          )}

          {activeTab === 'profile' && (
            <PassengerProfile
              onLogout={() => setIsAuthenticated(false)}
              onNavigateToHistory={() => setActiveTab('history')}
            />
          )}
        </div>

        {/* Mobile Bottom Tab Bar (Fixed at bottom of smartphone screen) */}
        <div className="bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around z-30 shrink-0 shadow-sm">
          <button
            id="mobile-nav-passenger-home"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'home' ? 'text-amber-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px]">Explore</span>
          </button>

          <button
            id="mobile-nav-passenger-book"
            onClick={() => setActiveTab('book')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'book' ? 'text-amber-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[10px]">Book</span>
            {activeRide && (
              <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          <button
            id="mobile-nav-passenger-history"
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'history' ? 'text-amber-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-[10px]">Activity</span>
          </button>

          <button
            id="mobile-nav-passenger-chat"
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
            id="mobile-nav-passenger-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile' ? 'text-amber-600 font-black' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px]">Account</span>
          </button>
        </div>
      </div>
    </MobileDeviceFrame>
  );
};
