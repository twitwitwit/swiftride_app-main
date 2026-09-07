import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  CheckCircle2, 
  Download 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useRide } from '../../context/RideContext';

const REVENUE_BREAKDOWN_DATA = [
  { day: 'Mon', gross: 280000, commission: 42000, driverPayout: 238000 },
  { day: 'Tue', gross: 310000, commission: 46500, driverPayout: 263500 },
  { day: 'Wed', gross: 350000, commission: 52500, driverPayout: 297500 },
  { day: 'Thu', gross: 420000, commission: 63000, driverPayout: 357000 },
  { day: 'Fri', gross: 480000, commission: 72000, driverPayout: 408000 },
  { day: 'Sat', gross: 520000, commission: 78000, driverPayout: 442000 },
  { day: 'Sun', gross: 390000, commission: 58500, driverPayout: 331500 },
];

export const AdminEarnings: React.FC = () => {
  const { platformStats, showNotification } = useRide();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display">Revenue & Financial Settlement</h2>
          <p className="text-xs text-slate-400">Track platform commission, driver partner disbursements, and gross volume</p>
        </div>

        <button
          onClick={() => showNotification('Financial Report Downloaded', 'Audit reconciliation report generated in Excel & PDF formats.', 'success')}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Financial Ledger</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform Volume (Today)</span>
          <h3 className="text-2xl font-black text-white font-display mt-1">₱{platformStats.revenueToday.toLocaleString()}</h3>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.6% vs yesterday
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SwiftRide Commission (15%)</span>
          <h3 className="text-2xl font-black text-amber-400 font-display mt-1">
            ₱{(platformStats.revenueToday * 0.15).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-amber-300 font-semibold mt-1">Net platform revenue</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Driver Partner Payouts (85%)</span>
          <h3 className="text-2xl font-black text-emerald-400 font-display mt-1">
            ₱{(platformStats.revenueToday * 0.85).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Automated GCash / Maya settlement</p>
        </div>
      </div>

      {/* Financial Chart */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-white font-display">Weekly Settlement Breakdown</h4>
          <span className="text-xs text-slate-400">Commission vs Driver Share</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_BREAKDOWN_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${v/1000}k`} />
              <Tooltip 
                formatter={(val: any) => [`₱${val.toLocaleString()}`]}
                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#FFF', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              <Bar dataKey="driverPayout" name="Driver Net (85%)" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="commission" name="Platform Take (15%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
