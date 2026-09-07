import React, { useState } from 'react';
import { 
  Users, 
  Car, 
  Compass, 
  DollarSign, 
  Clock, 
  LifeBuoy, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  X, 
  Eye, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend 
} from 'recharts';
import { useRide } from '../../context/RideContext';
import { InteractiveMap } from '../common/InteractiveMap';
import { AdminTab } from './AdminSidebar';

const BOOKING_CHART_DATA = [
  { day: 'Mon', bookings: 420 },
  { day: 'Tue', bookings: 580 },
  { day: 'Wed', bookings: 720 },
  { day: 'Thu', bookings: 690 },
  { day: 'Fri', bookings: 860 },
  { day: 'Sat', bookings: 940 },
  { day: 'Sun', bookings: 780 },
];

const REVENUE_CHART_DATA = [
  { month: 'Jan', revenue: 2.1 },
  { month: 'Feb', revenue: 2.4 },
  { month: 'Mar', revenue: 2.8 },
  { month: 'Apr', revenue: 3.2 },
  { month: 'May', revenue: 3.9 },
  { month: 'Jun', revenue: 4.8 },
];

const PASSENGER_GROWTH_DATA = [
  { month: 'Jan', users: 6200 },
  { month: 'Feb', users: 8400 },
  { month: 'Mar', users: 10100 },
  { month: 'Apr', users: 11200 },
  { month: 'May', users: 12542 },
];

const DRIVER_PIE_DATA = [
  { name: 'Active', value: 1650, color: '#10B981' },
  { name: 'On Trip', value: 420, color: '#F59E0B' },
  { name: 'Offline', value: 245, color: '#64748B' },
];

interface AdminOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { 
    platformStats, 
    pendingApplications, 
    approveDriverApplication, 
    rejectDriverApplication, 
    activities, 
    showNotification,
    emergencyRequests
  } = useRide();

  const [selectedDriverDetails, setSelectedDriverDetails] = useState<any | null>(null);
  const [appPage, setAppPage] = useState<number>(1);
  const PAGE_SIZE = 4;
  const activeEmergencies = emergencyRequests.filter(e => e.status === 'active' || e.status === 'responding');

  return (
    <div className="space-y-6 overflow-y-auto pb-6">
      {/* Critical Active Emergency SOS Banner (If any active) */}
      {activeEmergencies.length > 0 && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wide flex items-center gap-2">
                <span>{activeEmergencies.length} Active User Emergency Request(s)</span>
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              </h4>
              <p className="text-xs text-slate-200 mt-0.5">
                Latest: <strong className="text-white">{activeEmergencies[0].userName}</strong> triggered <strong className="text-rose-300">{activeEmergencies[0].emergencyType}</strong> at {activeEmergencies[0].location.name}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('emergency')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Open Emergency Desk</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6 Key Real-Time KPI Bento Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Passengers */}
        <div 
          onClick={() => onNavigateTab('passengers')}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl shadow-xl hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Passengers</span>
            <div className="w-8 h-8 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white font-display mt-2">
            {platformStats.totalPassengers.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-mono font-semibold text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+12.5% vs yesterday</span>
          </div>
        </div>

        {/* Active Drivers */}
        <div 
          onClick={() => onNavigateTab('drivers')}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl shadow-xl hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Active Drivers</span>
            <div className="w-8 h-8 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white font-display mt-2">
            {platformStats.activeDrivers.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-mono font-semibold text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+8.3% vs yesterday</span>
          </div>
        </div>

        {/* Trips Today */}
        <div 
          onClick={() => onNavigateTab('bookings')}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl shadow-xl hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Trips Today</span>
            <div className="w-8 h-8 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white font-display mt-2">
            {platformStats.tripsToday.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-mono font-semibold text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+15.7% vs yesterday</span>
          </div>
        </div>

        {/* Revenue Today */}
        <div 
          onClick={() => onNavigateTab('earnings')}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl shadow-xl hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Revenue Today</span>
            <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-amber-400 font-display mt-2">
            ₱{platformStats.revenueToday.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-mono font-semibold text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+18.6% vs yesterday</span>
          </div>
        </div>

        {/* Pending Drivers */}
        <div 
          onClick={() => onNavigateTab('drivers')}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl shadow-xl hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Pending Drivers</span>
            <div className="w-8 h-8 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white font-display mt-2">
            {platformStats.pendingDrivers}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-mono font-semibold text-slate-400">
            <TrendingDown className="w-3 h-3 text-amber-400" />
            <span>-5.2% vs yesterday</span>
          </div>
        </div>

        {/* Support Tickets */}
        <div 
          onClick={() => onNavigateTab('support')}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl shadow-xl hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Support Desk</span>
            <div className="w-8 h-8 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <LifeBuoy className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white font-display mt-2">
            {platformStats.supportTickets}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[10px] font-mono font-semibold text-rose-400">
            <TrendingUp className="w-3 h-3" />
            <span>+10.0% vs yesterday</span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Charts Grid in Bento Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Chart 1: Daily Bookings */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Daily Bookings</h4>
              <p className="text-[10px] text-slate-500 font-mono">7-Day Request Volume</p>
            </div>
            <span className="text-xs font-mono font-black text-amber-400">860 Peak</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={BOOKING_CHART_DATA}>
                <defs>
                  <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272A', borderRadius: '12px', color: '#FFF', fontSize: '11px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="bookings" stroke="#F59E0B" strokeWidth={2.5} fill="url(#bookingGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly Revenue */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Weekly Revenue</h4>
              <p className="text-[10px] text-slate-500 font-mono">Gross Fare Volume (₱)</p>
            </div>
            <span className="text-xs font-mono font-black text-emerald-400">₱2.75M Total</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${v / 1000}k`} />
                <Tooltip 
                  formatter={(val: any) => [`₱${val.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272A', borderRadius: '12px', color: '#FFF', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Driver Activity Donut */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Driver Activity</h4>
              <p className="text-[10px] text-slate-500 font-mono">2,315 Fleet Total</p>
            </div>
            <span className="text-xs font-mono font-black text-emerald-400">71.3% Active</span>
          </div>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DRIVER_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {DRIVER_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272A', borderRadius: '12px', color: '#FFF', fontSize: '11px', fontFamily: 'monospace' }} />
                <Legend 
                  verticalAlign="bottom" 
                  height={24} 
                  wrapperStyle={{ fontSize: '10px', color: '#71717A', fontFamily: 'monospace' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Passenger Growth */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Passenger Growth</h4>
              <p className="text-[10px] text-slate-500 font-mono">Monthly Acquisition</p>
            </div>
            <span className="text-xs font-mono font-black text-blue-400">12,542 Active</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PASSENGER_GROWTH_DATA}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#09090B', border: '1px solid #27272A', borderRadius: '12px', color: '#FFF', fontSize: '11px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2.5} fill="url(#userGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3 Live Operational Bento Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Panel 1: Recent Activities Feed */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <h3 className="text-sm font-bold text-white font-display">Recent Activities</h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Live Stream</span>
          </div>

          <div className="space-y-2.5">
            {(activities || []).slice(0, 5).map(act => (
              <div key={act.id} className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 leading-snug">{act.text}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('notifications')}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-xs font-mono font-bold rounded-2xl transition-colors cursor-pointer border border-zinc-700"
          >
            View Full Activity Log
          </button>
        </div>

        {/* Panel 2: Pending Driver Applications Approval Workflow */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-2xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-display">Pending Driver Partner Audits</h3>
              <p className="text-xs text-slate-400">Review vehicle registration and grant platform access</p>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold rounded-full">
              {pendingApplications.filter(a => a.status === 'pending').length} Pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-slate-500 uppercase text-[10px] font-mono tracking-wider">
                  <th className="pb-2.5 font-bold">Driver Name</th>
                  <th className="pb-2.5 font-bold">Vehicle Info</th>
                  <th className="pb-2.5 font-bold">Plate Number</th>
                  <th className="pb-2.5 font-bold">Submitted</th>
                  <th className="pb-2.5 font-bold text-center">Status</th>
                  <th className="pb-2.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {pendingApplications.slice((appPage - 1) * PAGE_SIZE, appPage * PAGE_SIZE).map(app => (
                  <tr key={app.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={app.avatar}
                          alt={app.driverName}
                          className="w-8 h-8 rounded-xl object-cover border border-zinc-700"
                        />
                        <div>
                          <p className="font-bold text-white font-display">{app.driverName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300 font-medium">{app.vehicle}</td>
                    <td className="py-3 font-mono font-bold text-amber-400">{app.plateNumber}</td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">{app.submittedDate}</td>
                    <td className="py-3 text-center">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                        app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        app.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {app.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveDriverApplication(app.id)}
                            id={`btn-approve-driver-${app.id}`}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                            title="Approve Driver Application"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => rejectDriverApplication(app.id)}
                            id={`btn-reject-driver-${app.id}`}
                            className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
                            title="Reject Application"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-600 font-mono italic">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-zinc-800">
            <span>
              Showing {Math.min((appPage - 1) * PAGE_SIZE + 1, pendingApplications.length)}–{Math.min(appPage * PAGE_SIZE, pendingApplications.length)} of {pendingApplications.length} entries
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setAppPage(p => Math.max(1, p - 1))}
                disabled={appPage === 1}
                className="px-2.5 py-1 bg-zinc-800 rounded-lg text-[10px] text-slate-400 border border-zinc-700 disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >Prev</button>
              {Array.from({ length: Math.ceil(pendingApplications.length / PAGE_SIZE) }, (_, i) => i + 1).map(pg => (
                <button
                  key={pg}
                  onClick={() => setAppPage(pg)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] cursor-pointer ${appPage === pg ? 'bg-amber-500 text-black font-black' : 'bg-zinc-800 text-slate-400 border border-zinc-700'}`}
                >{pg}</button>
              ))}
              <button
                onClick={() => setAppPage(p => Math.min(Math.ceil(pendingApplications.length / PAGE_SIZE), p + 1))}
                disabled={appPage >= Math.ceil(pendingApplications.length / PAGE_SIZE)}
                className="px-2.5 py-1 bg-zinc-800 rounded-lg text-[10px] text-slate-400 border border-zinc-700 disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Fleet Dispatch Radar Bento Box */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white font-display">Live Fleet Dispatch Radar</h3>
            <p className="text-xs text-slate-500 font-mono">Real-time GPS coordinate telemetry across Metro Manila</p>
          </div>

          {/* 4 Live Count Badges */}
          <div className="flex items-center gap-2 flex-wrap font-mono">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold border border-amber-500/20">
              On Trip: 420
            </span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
              Pending: 86
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
              Completed: 1,012
            </span>
            <span className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full text-xs font-bold border border-rose-500/20">
              Cancelled: 67
            </span>
          </div>
        </div>

        <InteractiveMap height="h-72" />
      </div>
    </div>
  );
};
