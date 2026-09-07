import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  Star, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Trash2,
  X
} from 'lucide-react';
import { useRide } from '../../context/RideContext';

export const AdminPassengers: React.FC = () => {
  const { passenger, showNotification } = useRide();
  const [search, setSearch] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Mock list of passengers
  const [passengersList, setPassengersList] = useState<any[]>([
    {
      id: 'p1',
      name: 'John Michael Nabung',
      phone: '0912 345 6789',
      email: 'john.nabung@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      walletBalance: 1250.00,
      completedRides: 25,
      rating: 4.8,
      status: 'Active',
      joinedDate: 'Jan 15, 2026'
    },
    {
      id: 'p2',
      name: 'Maria Santos',
      phone: '0917 123 4567',
      email: 'maria.santos@yahoo.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      walletBalance: 840.50,
      completedRides: 42,
      rating: 4.9,
      status: 'Active',
      joinedDate: 'Feb 02, 2026'
    },
    {
      id: 'p3',
      name: 'Ronaldo Dela Cruz',
      phone: '0928 987 6543',
      email: 'ronaldo.dc@outlook.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      walletBalance: 150.00,
      completedRides: 8,
      rating: 4.6,
      status: 'Active',
      joinedDate: 'Mar 10, 2026'
    },
    {
      id: 'p4',
      name: 'Carla Reyes',
      phone: '0905 555 1212',
      email: 'carla.reyes@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      walletBalance: 2400.00,
      completedRides: 67,
      rating: 5.0,
      status: 'Active',
      joinedDate: 'Dec 12, 2025'
    },
    {
      id: 'p5',
      name: 'Angelo Torres',
      phone: '0919 444 8899',
      email: 'angelo.torres@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      walletBalance: 0.00,
      completedRides: 3,
      rating: 4.2,
      status: 'Suspended',
      joinedDate: 'Apr 01, 2026'
    }
  ]);

  const filtered = passengersList.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setPassengersList(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Active' ? 'Suspended' : 'Active';
        showNotification('User Status Updated', `${p.name} is now ${nextStatus}`, 'info');
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display">Passenger Management</h2>
          <p className="text-xs text-slate-400">View, verify, and manage all passenger accounts</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search passengers..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            onClick={() => showNotification('Export Passenger List', 'CSV dataset generated and ready for export.', 'success')}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Passengers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="p-4 font-bold">Passenger</th>
                <th className="p-4 font-bold">Contact Info</th>
                <th className="p-4 font-bold">Wallet Balance</th>
                <th className="p-4 font-bold">Completed Rides</th>
                <th className="p-4 font-bold">Rating</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{p.name}</p>
                        <p className="text-[10px] text-slate-400">Joined {p.joinedDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-300 font-mono text-[11px]">{p.phone}</p>
                    <p className="text-[10px] text-slate-400">{p.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-amber-400 text-xs">₱{p.walletBalance.toFixed(2)}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-200">
                    {p.completedRides} rides
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{p.rating}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                      p.status === 'Active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser(p)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                          p.status === 'Active'
                            ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                        }`}
                      >
                        {p.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover" />
              <div>
                <h3 className="text-lg font-black font-display text-white">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
                  {selectedUser.status} Passenger
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div>
                <p className="text-slate-400 text-[10px]">Phone</p>
                <p className="font-bold text-white font-mono">{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Wallet Balance</p>
                <p className="font-black text-amber-400">₱{selectedUser.walletBalance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Completed Trips</p>
                <p className="font-bold text-white">{selectedUser.completedRides} rides</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px]">Passenger Rating</p>
                <p className="font-bold text-amber-400">★ {selectedUser.rating}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  showNotification('Wallet Credited', `₱500 promotional credit added to ${selectedUser.name}`, 'success');
                  setSelectedUser(null);
                }}
                className="flex-1 py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-500"
              >
                + Credit ₱500 Wallet
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
