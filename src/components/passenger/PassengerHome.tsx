import React from 'react';
import { Search, Bell, Star, ArrowRight, Tag, Clock, MapPin, Car, Bus, Bike } from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { VEHICLE_OPTIONS, POPULAR_LOCATIONS } from '../../data/mockData';
import { SwiftRideLogo } from '../common/SwiftRideLogo';

interface PassengerHomeProps {
  onNavigateToBook: (destination?: string, vehicleType?: any) => void;
  onNavigateToNotifications?: () => void;
}

export const PassengerHome: React.FC<PassengerHomeProps> = ({
  onNavigateToBook,
  onNavigateToNotifications
}) => {
  const { passenger, showNotification } = useRide();

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 overflow-y-auto space-y-4">
      {/* Top Header Profile & Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <img
            src={passenger.avatar}
            alt={passenger.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-sm"
          />
          <div>
            <h1 className="text-base font-extrabold text-slate-900 font-display">
              Hello, {passenger.name.split(' ')[0]}!
            </h1>
            <p className="text-xs text-slate-500">Where are you going today?</p>
          </div>
        </div>
        <button
          onClick={() => showNotification('Notifications', 'You have 2 promo vouchers expiring soon.', 'info')}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm relative hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
        </button>
      </div>

      {/* Main Search Input */}
      <div 
        onClick={() => onNavigateToBook()}
        className="w-full bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3 cursor-pointer hover:border-amber-400 transition-all group"
      >
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
          <Search className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-800">Where are you going?</p>
          <p className="text-[11px] text-slate-400">Search destinations, malls, offices...</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
      </div>

      {/* Featured Promo Hero Card (Slide 4) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 p-5 shadow-md">
        <div className="relative z-10 max-w-[68%]">
          <span className="inline-block px-3 py-1 bg-slate-950/20 backdrop-blur-sm rounded-full text-[11px] font-bold text-slate-950 uppercase tracking-wider mb-1.5">
            Fast and Safe Travel
          </span>
          <h3 className="text-lg font-black font-display leading-tight flex items-center gap-2">
            <span>Ride with</span>
            <span className="font-fc-fast text-xl italic tracking-wide text-slate-950">SWIFTRIDE</span>
          </h3>
          <p className="text-sm font-semibold text-slate-900 mt-1.5 mb-3.5">
            Get <span className="font-extrabold text-slate-950 underline decoration-slate-950">50% OFF</span> on your first ride!
          </p>
          <button
            onClick={() => onNavigateToBook()}
            className="px-4 py-2 bg-slate-950 text-amber-400 text-xs sm:text-sm font-extrabold rounded-xl shadow-md hover:bg-slate-900 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 50% OFF Badge */}
        <div className="absolute top-3.5 right-3.5 bg-slate-950 text-amber-400 px-3 py-1.5 rounded-xl shadow-lg border border-amber-300/40 text-center leading-none">
          <span className="block text-base font-black">50%</span>
          <span className="text-[9px] font-extrabold tracking-tight">OFF</span>
        </div>

        {/* Vehicle graphic preview in background */}
        <div className="absolute -right-2 -bottom-2 w-36 h-24 opacity-85 pointer-events-none">
          <SwiftRideLogo size="md" variant="icon-only" />
        </div>
      </div>

      {/* Choose a Ride Category (Slide 4) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Choose a ride</h2>
          <button onClick={() => onNavigateToBook()} className="text-[11px] text-amber-600 font-semibold hover:underline">
            See all
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {VEHICLE_OPTIONS.map((v) => {
            const getIcon = () => {
              switch (v.id) {
                case 'sedan': return <Car className="w-5 h-5 text-amber-600" />;
                case 'suv': return <Car className="w-5 h-5 text-indigo-600" />;
                case 'van': return <Bus className="w-5 h-5 text-emerald-600" />;
                case 'motorcycle': return <Bike className="w-5 h-5 text-rose-600" />;
              }
            };

            return (
              <button
                key={v.id}
                onClick={() => onNavigateToBook(undefined, v.id)}
                className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:border-amber-400 hover:shadow transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  {getIcon()}
                </div>
                <span className="text-xs font-bold text-slate-900">{v.name}</span>
                <span className="text-[9px] text-slate-400 text-center line-clamp-1">{v.capacity}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Destinations (Slide 4) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Recent destinations</h2>
          <button onClick={() => onNavigateToBook()} className="text-[11px] text-amber-600 font-semibold hover:underline">
            See all
          </button>
        </div>

        <div className="space-y-2">
          {(passenger?.savedPlaces || []).slice(0, 3).map((place) => (
            <div
              key={place.id}
              onClick={() => onNavigateToBook(place.title)}
              className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/70 hover:border-amber-300 hover:bg-amber-50/20 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100/70 flex items-center justify-center text-amber-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{place.title}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{place.address}</p>
                </div>
              </div>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Special Offers For You (Slide 4) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-2xl border border-amber-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-900">₱50 OFF</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-amber-200 text-amber-900 font-bold rounded">TNV550</span>
            </div>
            <p className="text-[10px] text-slate-600">Valid for all ride types</p>
          </div>
        </div>
        <button
          onClick={() => {
            showNotification('Promo Code Applied', 'Code TNV550 (₱50 OFF) applied to next booking!', 'success');
            onNavigateToBook(undefined, undefined);
          }}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all"
        >
          Use Now
        </button>
      </div>
    </div>
  );
};
