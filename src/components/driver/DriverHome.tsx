import React, { useState, useEffect } from 'react';
import { 
  Power, 
  MapPin, 
  Wallet, 
  Award, 
  Clock, 
  Star, 
  CheckCircle2, 
  X, 
  Navigation, 
  MessageSquare, 
  Phone, 
  ChevronRight, 
  Sparkles,
  Car,
  Bell
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { InteractiveMap } from '../common/InteractiveMap';
import { SwiftRideLogo } from '../common/SwiftRideLogo';

interface DriverHomeProps {
  onNavigateToChat: (rideId: string) => void;
  onNavigateToEarnings: () => void;
}

export const DriverHome: React.FC<DriverHomeProps> = ({
  onNavigateToChat,
  onNavigateToEarnings
}) => {
  const { 
    driver, 
    activeRide, 
    incomingDriverRide, 
    driverIncomingCountdown, 
    driverAcceptRide, 
    driverDeclineRide, 
    driverArriveAtPickup, 
    startRideTrip, 
    completeRideTrip, 
    toggleDriverOnline, 
    showNotification 
  } = useRide();

  // Active navigation instruction mock steps
  const navigationSteps = [
    'Head north toward Bagong Silang Main Ave (400m)',
    'In 200m, turn right onto Commonwealth Ave',
    'Continue on Commonwealth Ave for 3.2 km',
    'Keep right onto EDSA Northbound flyover',
    'Arriving at SM North EDSA on the right'
  ];

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 overflow-y-auto space-y-3.5">
      {/* Top Driver Greeting & Status (Slide 8) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-sm"
            />
            <span className={`w-3 h-3 rounded-full ring-2 ring-white absolute bottom-0 right-0 ${
              driver.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}></span>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 font-display">
              Good Day, {driver.name.split(' ')[0]}!
            </h1>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-bold ${
                driver.status === 'online' ? 'text-emerald-600' : 'text-slate-500'
              }`}>
                {driver.status === 'online' ? "You're Online" : "You're Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleDriverOnline}
            id="btn-driver-power-toggle"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
              driver.status === 'online' 
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
            title="Toggle Online / Offline"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today's Earnings Card (Slide 8) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 p-4 shadow-md">
        <div className="relative z-10 max-w-[65%]">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Today's Earnings</p>
          <h2 className="text-2xl font-black font-display tracking-tight text-slate-950 mt-0.5">
            ₱{driver.todayEarnings.toFixed(2)}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onNavigateToEarnings}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-amber-400 text-[11px] font-extrabold rounded-lg shadow-sm transition-all"
            >
              View Breakdown
            </button>
          </div>
        </div>

        {/* 3 Metric Pills on right / bottom */}
        <div className="absolute right-3 bottom-3 flex flex-col gap-1 text-right text-[10px] font-bold text-slate-950 bg-white/30 backdrop-blur-xs px-2.5 py-1.5 rounded-xl">
          <span>{driver.totalTrips} Trips</span>
          <span>{driver.onlineHours} Online</span>
          <span>Rating {driver.rating}</span>
        </div>

        {/* Background Car Silhouette */}
        <div className="absolute -right-3 -top-2 w-32 h-20 opacity-80 pointer-events-none">
          <SwiftRideLogo size="sm" variant="icon-only" />
        </div>
      </div>

      {/* Quick Action Buttons (Slide 8) */}
      <div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={toggleDriverOnline}
            className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
              driver.status === 'online' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
            }`}>
              <Power className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900">
              {driver.status === 'online' ? 'Go Offline' : 'Go Online'}
            </span>
            <span className="text-[8px] text-slate-400 font-medium">
              {driver.status === 'online' ? "You're Online" : 'Paused'}
            </span>
          </button>

          <button
            onClick={() => showNotification('Location Updated', 'Current GPS locked to Caloocan / Quezon City border.', 'info')}
            className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900">My Location</span>
            <span className="text-[8px] text-slate-400 font-medium truncate max-w-full">Caloocan</span>
          </button>

          <button
            onClick={onNavigateToEarnings}
            className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900">Earnings</span>
            <span className="text-[8px] text-slate-400 font-medium">₱{driver.walletBalance.toFixed(0)}</span>
          </button>

          <button
            onClick={() => showNotification('Driver Status', 'Account Verified & Active. Documents up to date.', 'success')}
            className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900">Driver Status</span>
            <span className="text-[8px] text-emerald-600 font-bold">Active</span>
          </button>
        </div>
      </div>

      {/* NEW RIDE REQUEST CARD / POPUP (Slide 8) */}
      {incomingDriverRide && (
        <div className="bg-white p-4 rounded-2xl border-2 border-amber-400 shadow-lg space-y-3 relative ring-4 ring-amber-400/20 animate-pulse-ring">
          {/* Header with countdown */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded-full uppercase tracking-wider">
                New
              </span>
              <h3 className="text-sm font-black text-slate-900 font-display">New Ride Request</h3>
            </div>
            
            {/* Animated countdown pill */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 font-black text-xs rounded-full">
              <Clock className="w-3 h-3 animate-spin" />
              <span>{driverIncomingCountdown}s</span>
            </div>
          </div>

          {/* Passenger Info */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <img
                src={incomingDriverRide.passengerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={incomingDriverRide.passengerName}
                className="w-10 h-10 rounded-full object-cover border border-amber-400"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{incomingDriverRide.passengerName}</h4>
                <p className="text-[10px] text-slate-500 font-medium">★ {incomingDriverRide.passengerRating} • Regular Passenger</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400">2.5 km away</span>
          </div>

          {/* Route details */}
          <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <p className="text-slate-700 font-medium truncate">
                Pickup: <strong className="text-slate-900">{incomingDriverRide.pickup.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <p className="text-slate-700 font-medium truncate">
                Drop-off: <strong className="text-slate-900">{incomingDriverRide.dropoff.name}</strong>
              </p>
            </div>
          </div>

          {/* Fare & Time estimates */}
          <div className="flex items-center justify-between text-xs px-1">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Estimated Fare</span>
              <span className="text-base font-black text-slate-900">₱{incomingDriverRide.fare.toFixed(0)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Est. Time</span>
              <span className="text-xs font-bold text-slate-700">{incomingDriverRide.durationMins || 18} mins</span>
            </div>
          </div>

          {/* Action Buttons (Slide 8) */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => driverDeclineRide(incomingDriverRide.id)}
              id="btn-driver-decline"
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={() => driverAcceptRide(incomingDriverRide.id)}
              id="btn-driver-accept"
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Accept Ride
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE TRIP NAVIGATION HUD (when driver has an active trip) */}
      {activeRide && (activeRide.status === 'accepted' || activeRide.status === 'arriving' || activeRide.status === 'in_progress') && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-amber-500/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  {activeRide.status === 'accepted' ? 'En Route to Pickup' :
                   activeRide.status === 'arriving' ? 'At Pickup Location' : 'Trip in Progress'}
                </span>
                <h4 className="text-xs font-bold text-slate-100">
                  {activeRide.status === 'in_progress' ? activeRide.dropoff.name : activeRide.pickup.name}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigateToChat(activeRide.id)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 flex items-center justify-center"
                title="Chat with Passenger"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <a
                href={`tel:${activeRide.passengerPhone}`}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center"
                title="Call Passenger"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Interactive Live Map HUD */}
          <InteractiveMap
            pickup={activeRide.pickup}
            dropoff={activeRide.dropoff}
            routeProgress={activeRide.routeProgress || 30}
            driverName={driver.name}
            driverPlate={driver.vehicle.plateNumber}
            height="h-32"
          />

          {/* Turn Guidance */}
          <div className="bg-slate-800/80 p-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-700">
            <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-slate-200 truncate font-medium">
              {activeRide.status === 'accepted' ? 'Head north on Commonwealth Ave (1.8 km)' : 'Follow EDSA Northbound lane to destination'}
            </p>
          </div>

          {/* Progressive Action Workflow Buttons */}
          <div className="pt-1">
            {activeRide.status === 'accepted' && (
              <button
                onClick={() => driverArriveAtPickup(activeRide.id)}
                id="btn-driver-arrived"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                ✓ I Have Arrived at Pickup
              </button>
            )}

            {activeRide.status === 'arriving' && (
              <button
                onClick={() => startRideTrip(activeRide.id)}
                id="btn-driver-start-trip"
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                ▶ Passenger Boarded - Start Trip
              </button>
            )}

            {activeRide.status === 'in_progress' && (
              <button
                onClick={() => completeRideTrip(activeRide.id)}
                id="btn-driver-complete-trip"
                className="w-full py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                🏁 Complete Trip & Collect ₱{activeRide.fare.toFixed(0)}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Motivational Goal Banner (Slide 8) */}
      <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Complete more trips, earn more!</p>
            <p className="text-[10px] text-slate-600">Aim for 20 trips this week and get ₱100 bonus.</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      {/* Idle Radar Map (when online but no active ride) */}
      {!activeRide && !incomingDriverRide && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Driver Radar & Demand Zone</h3>
            <span className="text-[10px] text-emerald-600 font-bold">High Demand in SM Fairview</span>
          </div>
          <InteractiveMap height="h-44" />
        </div>
      )}
    </div>
  );
};
