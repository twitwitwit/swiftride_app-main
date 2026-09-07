import React, { useState } from 'react';
import { 
  Search, 
  Receipt, 
  Calendar, 
  MapPin, 
  Car, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  Share2, 
  X,
  RotateCcw
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { RideRequest } from '../../types';
import { SwiftRideLogo } from '../common/SwiftRideLogo';

interface PassengerTripsProps {
  onRebookTrip?: (pickup: string, dropoff: string) => void;
}

export const PassengerTrips: React.FC<PassengerTripsProps> = ({ onRebookTrip }) => {
  const { rideHistory, showNotification } = useRide();
  const [filterTab, setFilterTab] = useState<'All' | 'Completed' | 'Cancelled' | 'Upcoming'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReceipt, setSelectedReceipt] = useState<RideRequest | null>(null);

  const filteredTrips = rideHistory.filter(trip => {
    if (filterTab === 'Completed' && trip.status !== 'completed') return false;
    if (filterTab === 'Cancelled' && trip.status !== 'cancelled') return false;
    if (filterTab === 'Upcoming' && trip.status !== 'accepted' && trip.status !== 'arriving' && trip.status !== 'in_progress') return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        trip.pickup.name.toLowerCase().includes(q) ||
        trip.dropoff.name.toLowerCase().includes(q) ||
        (trip.driverName && trip.driverName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 overflow-y-auto space-y-3">
      {/* Title */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 font-display">Ride History</h2>
        <p className="text-xs text-slate-500">View and manage all your past and upcoming trips</p>
      </div>

      {/* Tabs (Slide 4) */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl">
        {(['All', 'Completed', 'Cancelled', 'Upcoming'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === tab 
                ? 'bg-amber-400 text-slate-950 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar (Slide 4) */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by location or driver..."
          className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
        />
      </div>

      {/* Trips List */}
      <div className="space-y-3 pt-1">
        {filteredTrips.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Car className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
            <p className="text-xs font-bold">No rides found in this category.</p>
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const isCompleted = trip.status === 'completed';
            const isCancelled = trip.status === 'cancelled';

            return (
              <div
                key={trip.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5 hover:border-amber-300 transition-all"
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-semibold text-[11px]">{trip.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' :
                      isCancelled ? 'bg-rose-100 text-rose-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {trip.status}
                    </span>
                    <span className="font-black text-slate-900 text-xs">₱{trip.fare.toFixed(2)}</span>
                  </div>
                </div>

                {/* Route */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <p className="text-slate-700 truncate font-medium">{trip.pickup.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                    <p className="text-slate-700 truncate font-medium">{trip.dropoff.name}</p>
                  </div>
                </div>

                {/* Driver / Cancellation note */}
                {isCancelled ? (
                  <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg font-medium">
                    {trip.cancellationReason || 'Ride was cancelled'}
                  </p>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        {trip.driverName ? trip.driverName.charAt(0) : 'D'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{trip.driverName || 'SwiftRide Driver'}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {trip.driverVehicle || 'Toyota Vios'} • ★ {trip.driverRating || 4.9}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReceipt(trip)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                      {onRebookTrip && (
                        <button
                          onClick={() => onRebookTrip(trip.pickup.name, trip.dropoff.name)}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                          title="Rebook this route"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Digital Receipt Modal (Slide 4) */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pt-2">
              <SwiftRideLogo size="sm" variant="horizontal" />
              <h3 className="text-base font-extrabold text-slate-900 font-display mt-2">Official E-Receipt</h3>
              <p className="text-[10px] text-slate-400 font-mono">Trip #{selectedReceipt.id}</p>
            </div>

            {/* Receipt Breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({selectedReceipt.vehicleType.toUpperCase()})</span>
                <span>₱{selectedReceipt.originalFare ? selectedReceipt.originalFare.toFixed(2) : selectedReceipt.fare.toFixed(2)}</span>
              </div>
              {selectedReceipt.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount ({selectedReceipt.promoCode || 'TNV550'})</span>
                  <span>-₱{selectedReceipt.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Distance ({selectedReceipt.distanceKm} km)</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Govt VAT / Tax (12%)</span>
                <span>Included</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Paid</span>
                <span className="text-amber-600">₱{selectedReceipt.fare.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-slate-400 text-right">
                Paid via {selectedReceipt.paymentMethod}
              </div>
            </div>

            {/* Trip endpoints */}
            <div className="text-xs space-y-1 text-slate-600">
              <p className="truncate"><strong>From:</strong> {selectedReceipt.pickup.address}</p>
              <p className="truncate"><strong>To:</strong> {selectedReceipt.dropoff.address}</p>
              <p><strong>Driver:</strong> {selectedReceipt.driverName || 'Juan Dela Cruz'} ({selectedReceipt.driverPlate || 'NDA 1234'})</p>
            </div>

            {/* Receipt Action buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => showNotification('Receipt Downloaded', 'PDF receipt saved to your device.', 'success')}
                className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => showNotification('Receipt Shared', 'Receipt link copied to clipboard.', 'info')}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
