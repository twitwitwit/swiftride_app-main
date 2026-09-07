import React, { useState } from 'react';
import { 
  Search, 
  Receipt, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  Car, 
  X, 
  Download, 
  Share2 
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { RideRequest } from '../../types';
import { SwiftRideLogo } from '../common/SwiftRideLogo';

export const DriverTrips: React.FC = () => {
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
        trip.passengerName.toLowerCase().includes(q) ||
        trip.pickup.name.toLowerCase().includes(q) ||
        trip.dropoff.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 overflow-y-auto space-y-3">
      {/* Title */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 font-display">My Trips</h2>
        <p className="text-xs text-slate-500">View and manage your passenger trips</p>
      </div>

      {/* Filter Tabs (Slide 8) */}
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

      {/* Search Bar (Slide 8) */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by passenger or location..."
          className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
        />
      </div>

      {/* Trips list (Slide 8) */}
      <div className="space-y-3 pt-1">
        {filteredTrips.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Car className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
            <p className="text-xs font-bold">No trips found in this category.</p>
          </div>
        ) : (
          filteredTrips.map(trip => {
            const isCompleted = trip.status === 'completed';
            const isCancelled = trip.status === 'cancelled';

            return (
              <div
                key={trip.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 hover:border-amber-300 transition-all"
              >
                {/* Header time & status */}
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
                    <span className="font-black text-slate-900 text-xs">
                      {isCancelled ? '₱0.00' : `₱${trip.fare.toFixed(2)}`}
                    </span>
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

                {/* Passenger Info & Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      {trip.passengerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{trip.passengerName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        ★ {trip.passengerRating || 4.9} • Regular Passenger
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReceipt(trip)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl relative">
            <button onClick={() => setSelectedReceipt(null)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center pt-2">
              <SwiftRideLogo size="sm" variant="horizontal" />
              <h3 className="text-base font-extrabold text-slate-900 font-display mt-2">Driver Trip Settlement</h3>
              <p className="text-[10px] text-slate-400 font-mono">ID #{selectedReceipt.id}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Gross Passenger Fare</span>
                <span>₱{selectedReceipt.fare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>SwiftRide Commission (15%)</span>
                <span>-₱{(selectedReceipt.fare * 0.15).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-emerald-700 text-sm">
                <span>Driver Net Income</span>
                <span>₱{(selectedReceipt.fare * 0.85).toFixed(2)}</span>
              </div>
            </div>

            <div className="text-xs space-y-1 text-slate-600">
              <p><strong>Passenger:</strong> {selectedReceipt.passengerName}</p>
              <p><strong>Payment:</strong> {selectedReceipt.paymentMethod}</p>
              <p><strong>Pickup:</strong> {selectedReceipt.pickup.address}</p>
              <p><strong>Dropoff:</strong> {selectedReceipt.dropoff.address}</p>
            </div>

            <button
              onClick={() => {
                showNotification('Settlement Statement Downloaded', 'PDF copy generated.', 'success');
                setSelectedReceipt(null);
              }}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Statement</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
