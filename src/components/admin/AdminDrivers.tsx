import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  Check, 
  X, 
  Star, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  Eye, 
  Award,
  Clock,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useRide } from '../../context/RideContext';

export const AdminDrivers: React.FC = () => {
  const { 
    driver, 
    pendingApplications, 
    approveDriverApplication, 
    rejectDriverApplication, 
    showNotification 
  } = useRide();

  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [search, setSearch] = useState<string>('');

  // Sample fleet list
  const [activeFleet, setActiveFleet] = useState<any[]>([
    {
      id: 'd1',
      name: 'Juan Dela Cruz',
      phone: '0917 888 1234',
      email: 'juan.delacruz@swiftride.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      vehicle: 'Toyota Vios (Sedan)',
      plateNumber: 'NDA 1234',
      rating: 4.9,
      totalTrips: 542,
      acceptanceRate: 98,
      status: 'Online',
      city: 'Caloocan City'
    },
    {
      id: 'd2',
      name: 'Mark Reyes',
      phone: '0918 222 3344',
      email: 'mark.reyes@swiftride.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      vehicle: 'Honda Click 125 (Motorcycle)',
      plateNumber: 'DEF 5678',
      rating: 4.8,
      totalTrips: 312,
      acceptanceRate: 95,
      status: 'On Trip',
      city: 'Quezon City'
    },
    {
      id: 'd3',
      name: 'Ana Garcia',
      phone: '0922 777 8899',
      email: 'ana.garcia@swiftride.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      vehicle: 'Mitsubishi Xpander (SUV)',
      plateNumber: 'GHI 9101',
      rating: 5.0,
      totalTrips: 680,
      acceptanceRate: 99,
      status: 'Online',
      city: 'Pasig City'
    },
    {
      id: 'd4',
      name: 'Rogelio Cruz',
      phone: '0933 111 4455',
      email: 'rogelio.cruz@swiftride.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      vehicle: 'Yamaha NMAX (Motorcycle)',
      plateNumber: 'JKL 2345',
      rating: 4.7,
      totalTrips: 189,
      acceptanceRate: 92,
      status: 'Offline',
      city: 'Manila'
    }
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display">Driver Fleet & Partner Verification</h2>
          <p className="text-xs text-slate-400">Review fleet performance, track status, and audit driver onboarding applications</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'approved' ? 'bg-amber-400 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Fleet ({activeFleet.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                activeTab === 'pending' ? 'bg-amber-400 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending Applications
              {pendingApplications.filter(a => a.status === 'pending').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px]">
                  {pendingApplications.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'approved' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="p-4 font-bold">Driver Partner</th>
                  <th className="p-4 font-bold">Vehicle Details</th>
                  <th className="p-4 font-bold">Plate Number</th>
                  <th className="p-4 font-bold">Rating & Trips</th>
                  <th className="p-4 font-bold">Acceptance Rate</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeFleet.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={d.avatar}
                          alt={d.name}
                          className="w-9 h-9 rounded-full object-cover border border-amber-400"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{d.name}</p>
                          <p className="text-[10px] text-slate-400">{d.phone} • {d.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-200 font-medium">{d.vehicle}</td>
                    <td className="p-4 font-mono font-bold text-amber-400">{d.plateNumber}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                          <span>{d.rating}</span>
                        </div>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300 font-semibold">{d.totalTrips} trips</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">{d.acceptanceRate}%</td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        d.status === 'Online' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        d.status === 'On Trip' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => showNotification('Driver Audit File', `Viewing telemetry & LTFRB compliance records for ${d.name}`, 'info')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white font-display">Applications Pending Document Verification</h3>
            <span className="text-xs text-amber-400 font-semibold">Government NBI + LTFRB Review</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApplications.map(app => (
              <div key={app.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={app.avatar} alt={app.driverName} className="w-11 h-11 rounded-full object-cover border border-amber-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{app.driverName}</h4>
                      <p className="text-xs text-slate-400">{app.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                    app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-xl text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Vehicle Model</span>
                    <strong className="text-white">{app.vehicleModel || (app as any).vehicle || 'Standard Vehicle'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Plate Number</span>
                    <strong className="text-amber-400 font-mono">{app.plateNumber}</strong>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-[11px] text-slate-400">Attached Verification Documents:</p>
                  <div className="flex gap-2 flex-wrap text-[10px]">
                    {(app.documents || ['Driver License', 'NBI Clearance', 'OR/CR Vehicle Registration']).map((doc, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                        📄 {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => approveDriverApplication(app.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Activate</span>
                    </button>
                    <button
                      onClick={() => rejectDriverApplication(app.id)}
                      className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold rounded-xl text-xs border border-rose-600/30 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
