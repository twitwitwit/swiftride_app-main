import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  Car, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Receipt,
  Download,
  X
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { RideRequest } from '../../types';

export const AdminBookings: React.FC = () => {
  const { rideHistory, activeRide, showNotification } = useRide();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<RideRequest | null>(null);

  // Combine active ride with history
  const allBookings: RideRequest[] = [
    ...(activeRide ? [activeRide] : []),
    ...rideHistory.filter(r => !activeRide || r.id !== activeRide.id)
  ];

  const filtered = allBookings.filter(b => {
    if (filterStatus !== 'All' && b.status !== filterStatus.toLowerCase().replace(' ', '_')) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.passengerName.toLowerCase().includes(q) ||
        (b.driverName && b.driverName.toLowerCase().includes(q)) ||
        b.pickup.name.toLowerCase().includes(q) ||
        b.dropoff.name.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display">Ride Bookings & Dispatch Log</h2>
          <p className="text-xs text-slate-400">Track all ongoing and archived ride requests across Metro Manila</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by passenger, driver, ID..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            onClick={() => showNotification('Audit Export', 'All ride records exported to CSV format.', 'success')}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Export All
          </button>
        </div>
      </div>

      {/* Filter Status Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto no-scrollbar gap-1">
        {['All', 'Requested', 'Accepted', 'Arriving', 'In Progress', 'Completed', 'Cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === status
                ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="p-4 font-bold">Booking ID & Time</th>
                <th className="p-4 font-bold">Passenger</th>
                <th className="p-4 font-bold">Driver Assigned</th>
                <th className="p-4 font-bold">Route (Pickup → Dropoff)</th>
                <th className="p-4 font-bold">Fare & Payment</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(booking => {
                const isCompleted = booking.status === 'completed';
                const isCancelled = booking.status === 'cancelled';
                const isLive = ['requested', 'accepted', 'arriving', 'in_progress'].includes(booking.status);

                return (
                  <tr key={booking.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-amber-400">#{booking.id.toUpperCase()}</p>
                      <p className="text-[10px] text-slate-400">{booking.createdAt || 'Today'}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{booking.passengerName}</p>
                      <p className="text-[10px] text-slate-400">{booking.passengerPhone || '0912 345 6789'}</p>
                    </td>
                    <td className="p-4">
                      {booking.driverName ? (
                        <div>
                          <p className="font-bold text-slate-200">{booking.driverName}</p>
                          <p className="text-[10px] text-amber-400 font-mono">{booking.driverPlate || 'NDA 1234'}</p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-400 italic">Matching nearby driver...</span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="space-y-0.5 truncate">
                        <p className="text-slate-300 truncate">🟢 {booking.pickup.name}</p>
                        <p className="text-slate-300 truncate">🔴 {booking.dropoff.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-black text-emerald-400 text-xs">₱{booking.fare.toFixed(2)}</span>
                      <p className="text-[10px] text-slate-400">{booking.paymentMethod}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isCancelled ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                        title="View Receipt & Waybill"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Receipt Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl relative">
            <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black font-display text-white">Trip Dispatch Waybill</h3>
            <p className="text-xs text-amber-400 font-mono">Trip ID: #{selectedBooking.id}</p>

            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Passenger</span>
                <span className="font-bold text-white">{selectedBooking.passengerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Driver Partner</span>
                <span className="font-bold text-white">{selectedBooking.driverName || 'Pending Driver'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Pickup</span>
                <span className="font-medium text-slate-200">{selectedBooking.pickup.address}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Drop-off</span>
                <span className="font-medium text-slate-200">{selectedBooking.dropoff.address}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Payment Gateway</span>
                <span className="font-bold text-white">{selectedBooking.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black">
                <span className="text-slate-300">Total Charged Fare</span>
                <span className="text-emerald-400">₱{selectedBooking.fare.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                showNotification('Waybill PDF Generated', 'Official trip manifest saved.', 'success');
                setSelectedBooking(null);
              }}
              className="w-full py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl text-xs"
            >
              Print Official LTFRB Waybill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
