import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  Users, 
  SlidersHorizontal, 
  CreditCard, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  X,
  Car,
  Bike,
  Bus,
  ArrowRight,
  ArrowLeft,
  Clock,
  Radio,
  Sparkles
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { POPULAR_LOCATIONS, VEHICLE_OPTIONS } from '../../data/mockData';
import { LocationPoint, VehicleCategory } from '../../types';
import { InteractiveMap } from '../common/InteractiveMap';

interface PassengerBookRideProps {
  initialDestination?: string;
  initialVehicle?: VehicleCategory;
  onNavigateToChat: (rideId: string) => void;
  onBack?: () => void;
}

export const PassengerBookRide: React.FC<PassengerBookRideProps> = ({
  initialDestination,
  initialVehicle = 'sedan',
  onNavigateToChat,
  onBack
}) => {
  const { 
    passenger, 
    activeRide, 
    requestRide, 
    cancelActiveRide, 
    showNotification,
    triggerEmergencyRequest
  } = useRide();

  // Booking form state
  const [pickup, setPickup] = useState<LocationPoint>({
    name: 'Bagong Silang',
    address: 'Bagong Silang, Caloocan City',
    lat: 14.7735,
    lng: 121.0428
  });

  const [dropoff, setDropoff] = useState<LocationPoint>(() => {
    if (initialDestination) {
      const match = POPULAR_LOCATIONS.find(l => l.name.toLowerCase().includes(initialDestination.toLowerCase()));
      if (match) return { name: match.name.split(',')[0], address: match.name, lat: match.lat, lng: match.lng };
    }
    return {
      name: 'SM North EDSA',
      address: 'SM North EDSA, Quezon City',
      lat: 14.6565,
      lng: 121.0289
    };
  });

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory>(initialVehicle);
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Visa' | 'Cash' | 'Wallet'>('GCash');
  const [promoCode, setPromoCode] = useState<string>('TNV550');
  const [promoApplied, setPromoApplied] = useState<boolean>(true);
  const [showLocationPicker, setShowLocationPicker] = useState<'pickup' | 'dropoff' | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('Driver taking too long');

  // Calculate fare
  const currentVehicle = VEHICLE_OPTIONS.find(v => v.id === selectedVehicle) || VEHICLE_OPTIONS[0];
  const distanceKm = 14.2;
  const baseFare = currentVehicle.baseFare;
  const rawFare = baseFare + (distanceKm - 2) * (currentVehicle.perKmRate * 0.4);
  const discountAmount = promoApplied ? 50 : 0;
  const finalFare = Math.max(rawFare - discountAmount, 60);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'TNV550' || promoCode.toUpperCase() === 'SWIFT50') {
      setPromoApplied(true);
      showNotification('Promo Applied', '₱50 discount applied successfully!', 'success');
    } else {
      showNotification('Invalid Promo', 'Please check promo code and try again.', 'warning');
    }
  };

  const handleConfirmBooking = () => {
    requestRide({
      pickup,
      dropoff,
      vehicleType: selectedVehicle,
      fare: Math.round(finalFare),
      originalFare: Math.round(rawFare),
      discount: discountAmount,
      promoCode: promoApplied ? promoCode : undefined,
      distanceKm,
      durationMins: 28,
      paymentMethod
    });
  };

  // If there's an active ride for this passenger, render the Live Tracking View
  if (activeRide && activeRide.passengerId === passenger.id && activeRide.status !== 'completed' && activeRide.status !== 'cancelled') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 overflow-hidden h-full">
        {/* Mobile Top Header */}
        <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-black text-slate-900 font-display">Live Trip Status</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            #{activeRide.id.toUpperCase()}
          </span>
        </div>

        {/* Mobile Map Section (Live Route and Driver Car) */}
        <div className="h-52 w-full relative shrink-0 border-b border-slate-200 shadow-inner">
          <InteractiveMap
            pickup={activeRide.pickup}
            dropoff={activeRide.dropoff}
            routeProgress={activeRide.routeProgress || 20}
            driverName={activeRide.driverName}
            driverPlate={activeRide.driverPlate}
            height="h-full"
            className="w-full h-full"
          />
        </div>

        {/* Mobile Scrollable Trip Details Card */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
          {/* Status Header Badge */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                activeRide.status === 'requested' ? 'bg-amber-100 text-amber-900 animate-pulse' :
                activeRide.status === 'accepted' ? 'bg-blue-100 text-blue-900' :
                activeRide.status === 'arriving' ? 'bg-emerald-100 text-emerald-900 animate-bounce' :
                'bg-indigo-100 text-indigo-900'
              }`}>
                {activeRide.status === 'requested' ? 'Searching for Driver...' :
                 activeRide.status === 'accepted' ? 'Driver on the way' :
                 activeRide.status === 'arriving' ? 'Driver has arrived' : 'In Transit'}
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-1 font-display">
                {activeRide.status === 'requested' ? 'Connecting to nearest vehicle' :
                 activeRide.status === 'arriving' ? 'Driver is waiting at pickup' :
                 `Arriving in ~${activeRide.etaMins || 4} mins`}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-amber-600">₱{activeRide.fare.toFixed(2)}</span>
              <p className="text-[10px] text-slate-500 font-medium">{activeRide.paymentMethod}</p>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
              <span className={activeRide.status === 'requested' ? 'text-amber-600' : ''}>1. Request</span>
              <span className={activeRide.status === 'accepted' ? 'text-blue-600' : ''}>2. Accepted</span>
              <span className={activeRide.status === 'arriving' ? 'text-emerald-600' : ''}>3. Arrived</span>
              <span className={activeRide.status === 'in_progress' ? 'text-indigo-600' : ''}>4. On Trip</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: activeRide.status === 'requested' ? '25%' :
                         activeRide.status === 'accepted' ? '50%' :
                         activeRide.status === 'arriving' ? '75%' : '100%'
                }}
              />
            </div>
          </div>

          {/* Driver Card if accepted */}
          {activeRide.driverName ? (
            <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-400/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeRide.driverAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'} 
                    alt={activeRide.driverName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 font-display">{activeRide.driverName}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">{activeRide.driverVehicle}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] bg-slate-900 text-amber-400 font-mono font-black px-2 py-0.5 rounded">
                        {activeRide.driverPlate}
                      </span>
                      <span className="text-[11px] font-bold text-amber-600">★ {activeRide.driverRating || 4.92}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Call & Chat Action buttons */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => onNavigateToChat(activeRide.id)}
                    className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 flex items-center justify-center transition-colors cursor-pointer"
                    title="Live Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <a
                    href={`tel:${activeRide.driverPhone || '09178881234'}`}
                    className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center justify-center transition-colors"
                    title="Call Driver"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Route endpoints */}
              <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <p className="text-slate-600 font-medium truncate">
                    Pickup: <strong className="text-slate-900">{activeRide.pickup.name}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                  <p className="text-slate-600 font-medium truncate">
                    Drop-off: <strong className="text-slate-900">{activeRide.dropoff.name}</strong>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 animate-bounce">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">Matching with Driver</h4>
                <p className="text-[10px] text-amber-800">
                  Broadcasting dispatch to nearby active drivers in Metro Manila...
                </p>
              </div>
            </div>
          )}

          {/* Safety & Cancel Options */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                triggerEmergencyRequest({
                  userId: passenger.id,
                  userName: passenger.name,
                  userRole: 'passenger',
                  userPhone: passenger.phone,
                  userAvatar: passenger.avatar,
                  rideId: activeRide?.id,
                  location: activeRide?.pickup,
                  emergencyType: 'Safety SOS',
                  notes: 'Passenger pressed Safety SOS alert on live dispatch session.'
                });
              }}
              className="flex-1 py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Safety SOS</span>
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel Ride
            </button>
          </div>
        </div>

        {/* Cancel Ride Modal */}
        {showCancelModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-3 shadow-2xl text-slate-900">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 font-display text-sm">Cancel Booking?</h4>
                <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500">Please select a cancellation reason:</p>
              <div className="space-y-1.5">
                {[
                  'Driver taking too long',
                  'Changed my mind',
                  'Booked by mistake',
                  'Found other transport'
                ].map(r => (
                  <label key={r} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl text-[11px] text-slate-700 cursor-pointer hover:bg-amber-50">
                    <input 
                      type="radio" 
                      name="cancel_reason" 
                      checked={cancelReason === r} 
                      onChange={() => setCancelReason(r)}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Keep
                </button>
                <button
                  onClick={() => {
                    cancelActiveRide(activeRide.id, cancelReason);
                    setShowCancelModal(false);
                  }}
                  className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow hover:bg-rose-700 cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile Booking Configuration Screen
  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden h-full">
      {/* Mobile Top Bar */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-sm font-black text-slate-900 font-display">Book a Ride</h2>
            <p className="text-[10px] text-slate-500">Fast & safe across Metro Manila</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
          ~28 mins
        </span>
      </div>

      {/* Mobile Map Route Preview */}
      <div className="h-44 w-full relative shrink-0 border-b border-slate-200 shadow-inner">
        <InteractiveMap
          pickup={pickup}
          dropoff={dropoff}
          routeProgress={0}
          vehicleType={selectedVehicle}
          height="h-full"
          className="w-full h-full"
        />
      </div>

      {/* Mobile Scrollable Booking Sheet */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50">
        {/* Pickup & Destination Inputs */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          {/* Pickup Input */}
          <div>
            <label className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">Pickup Location</label>
            <div 
              onClick={() => setShowLocationPicker('pickup')}
              className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 mt-0.5 cursor-pointer hover:border-amber-400 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
              <input 
                type="text" 
                readOnly 
                value={pickup.address}
                className="bg-transparent text-xs font-bold text-slate-900 w-full cursor-pointer focus:outline-none truncate"
              />
            </div>
          </div>

          {/* Dropoff Input */}
          <div>
            <label className="text-[9px] font-bold text-red-800 uppercase tracking-wider">Drop-off Destination</label>
            <div 
              onClick={() => setShowLocationPicker('dropoff')}
              className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 mt-0.5 cursor-pointer hover:border-amber-400 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
              <input 
                type="text" 
                readOnly 
                value={dropoff.address}
                className="bg-transparent text-xs font-bold text-slate-900 w-full cursor-pointer focus:outline-none truncate"
              />
            </div>
          </div>

          {/* Quick Location Shortcuts */}
          <div className="flex items-center gap-1 pt-1 overflow-x-auto no-scrollbar">
            {(passenger?.savedPlaces || []).slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => setDropoff({ name: p.title, address: p.address, lat: p.lat, lng: p.lng })}
                className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 border border-slate-200 text-slate-700 hover:text-amber-900 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {p.label === 'Home' ? '🏠 Home' : p.label === 'Work' ? '💼 Work' : '⭐ ' + p.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Selection List */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <h3 className="text-[11px] font-extrabold text-slate-900 tracking-tight uppercase">Select Vehicle</h3>
            <span className="text-[10px] text-slate-400 font-mono">14.2 km</span>
          </div>

          <div className="space-y-1.5">
            {VEHICLE_OPTIONS.map((v) => {
              const isSelected = selectedVehicle === v.id;
              const fare = Math.round(v.baseFare + (distanceKm - 2) * (v.perKmRate * 0.4));
              
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-400' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-100 text-slate-700'}`}>
                      {v.id === 'motorcycle' ? <Bike className="w-4 h-4" /> : v.id === 'van' ? <Bus className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-extrabold text-slate-900">{v.name}</h4>
                        <span className="text-[9px] text-slate-400">({v.capacity})</span>
                      </div>
                      <p className="text-[9px] text-slate-500">{v.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900">₱{fare}</span>
                    <p className="text-[9px] text-slate-400">{v.etaMins}m away</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method & Promo Code */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-900 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="GCash">GCash</option>
                <option value="Visa">VISA (•••• 1234)</option>
                <option value="Wallet">Wallet (₱{passenger.walletBalance.toFixed(2)})</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo"
                className="w-16 px-1.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] uppercase font-bold text-center"
              />
              <button
                onClick={handleApplyPromo}
                className="px-2 py-1 bg-slate-900 text-amber-400 text-[9px] font-bold rounded-lg cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {promoApplied && (
            <div className="flex items-center justify-between text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200">
              <span>Promo <strong>TNV550</strong> active</span>
              <span className="font-bold">-₱50.00</span>
            </div>
          )}
        </div>

        {/* Total & Request Button */}
        <div className="pt-1 pb-1">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] text-slate-500 font-medium">Estimated Total</span>
            <div className="text-right">
              <span className="text-base font-black text-slate-900">₱{Math.round(finalFare)}</span>
              {promoApplied && (
                <span className="text-[11px] text-slate-400 line-through ml-1.5">₱{Math.round(rawFare)}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            id="btn-confirm-booking"
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Book {currentVehicle.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded-3xl p-4 max-h-[80vh] w-full max-w-xs flex flex-col shadow-2xl text-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-xs text-slate-900 font-display">
                Select {showLocationPicker === 'pickup' ? 'Pickup' : 'Destination'}
              </h4>
              <button onClick={() => setShowLocationPicker(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto no-scrollbar py-1">
              {POPULAR_LOCATIONS.map((loc) => (
                <div
                  key={loc.name}
                  onClick={() => {
                    const selected: LocationPoint = {
                      name: loc.name.split(',')[0],
                      address: loc.name,
                      lat: loc.lat,
                      lng: loc.lng
                    };
                    if (showLocationPicker === 'pickup') {
                      setPickup(selected);
                    } else {
                      setDropoff(selected);
                    }
                    setShowLocationPicker(null);
                  }}
                  className="py-2 flex items-center gap-2 cursor-pointer hover:bg-amber-50 px-2 rounded-xl transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">{loc.name.split(',')[0]}</p>
                    <p className="text-[9px] text-slate-500 truncate">{loc.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
