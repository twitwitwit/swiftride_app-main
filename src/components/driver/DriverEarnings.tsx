import React, { useState } from 'react';
import { 
  Wallet, 
  Calendar, 
  Clock, 
  Star, 
  TrendingUp, 
  ArrowDownRight, 
  CreditCard, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  X,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useRide } from '../../context/RideContext';
import { SwiftRideLogo } from '../common/SwiftRideLogo';

const DAILY_CHART_DATA = [
  { label: '12 AM', earnings: 0 },
  { label: '3 AM', earnings: 0 },
  { label: '6 AM', earnings: 150 },
  { label: '9 AM', earnings: 450 },
  { label: '12 PM', earnings: 780 },
  { label: '3 PM', earnings: 1020 },
  { label: '6 PM', earnings: 1250 },
  { label: '9 PM', earnings: 1250 },
  { label: '12 AM', earnings: 1250 },
];

const WEEKLY_CHART_DATA = [
  { label: 'Mon', earnings: 850 },
  { label: 'Tue', earnings: 1100 },
  { label: 'Wed', earnings: 950 },
  { label: 'Thu', earnings: 1300 },
  { label: 'Fri', earnings: 1650 },
  { label: 'Sat', earnings: 1900 },
  { label: 'Sun', earnings: 1250 },
];

export const DriverEarnings: React.FC = () => {
  const { driver, withdrawEarnings, showNotification } = useRide();
  const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Custom'>('Daily');
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [payoutMethod, setPayoutMethod] = useState<string>('GCash');

  const handleWithdraw = () => {
    withdrawEarnings(withdrawAmount, payoutMethod);
    setShowWithdrawModal(false);
  };

  const chartData = period === 'Weekly' ? WEEKLY_CHART_DATA : DAILY_CHART_DATA;

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 overflow-y-auto space-y-3.5">
      {/* Title */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 font-display">Earnings</h2>
        <p className="text-xs text-slate-500">Track your earnings and transactions</p>
      </div>

      {/* Hero Earnings Card (Slide 9) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 p-4 shadow-md">
        <div className="relative z-10 max-w-[65%]">
          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Today's Earnings</p>
          <h3 className="text-2xl font-black font-display text-slate-950 mt-0.5">
            ₱{driver.todayEarnings.toFixed(2)}
          </h3>

          <div className="flex items-center gap-1.5 mt-2 bg-slate-950/20 backdrop-blur-xs px-2.5 py-1 rounded-lg w-fit">
            <Wallet className="w-3.5 h-3.5 text-slate-950" />
            <span className="text-[10px] font-extrabold text-slate-950">
              Wallet: ₱{driver.walletBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Background Car Silhouette */}
        <div className="absolute -right-3 -top-2 w-32 h-20 opacity-80 pointer-events-none">
          <SwiftRideLogo size="sm" variant="icon-only" />
        </div>
      </div>

      {/* 4 Performance Metrics (Slide 9) */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="block text-sm font-extrabold text-slate-900">{driver.totalTrips}</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">Completed Trips</span>
        </div>

        <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="block text-sm font-extrabold text-slate-900">{driver.onlineHours}</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">Online Time</span>
        </div>

        <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="block text-sm font-extrabold text-slate-900">₱185.00</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">Average Fare</span>
        </div>

        <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-2xs">
          <div className="flex items-center justify-center gap-0.5 text-amber-500">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="text-sm font-extrabold text-slate-900">{driver.rating}</span>
          </div>
          <span className="text-[8px] font-bold text-slate-400 uppercase">Average Rating</span>
        </div>
      </div>

      {/* Earnings Overview Chart Card (Slide 9) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Earnings Overview</h4>
          <span className="text-[10px] text-amber-600 font-semibold">Today, Live</span>
        </div>

        {/* Period Selector Tabs (Slide 9) */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['Daily', 'Weekly', 'Monthly', 'Custom'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                period === tab ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-36 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="earningsGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 9, fill: '#94A3B8' }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 9, fill: '#94A3B8' }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(v) => `₱${v}`}
              />
              <Tooltip 
                formatter={(value: any) => [`₱${value}`, 'Earnings']}
                contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px', border: 'none' }}
              />
              <Area 
                type="monotone" 
                dataKey="earnings" 
                stroke="#F59E0B" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#earningsGlow)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Total Period Earnings</span>
            <span className="font-extrabold text-slate-900 text-sm">₱{driver.todayEarnings.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Online Time</span>
            <span className="font-bold text-slate-700">{driver.onlineHours}</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions List (Slide 9) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Recent Transactions</h4>
          <span className="text-[10px] text-amber-600 font-semibold cursor-pointer hover:underline">View All</span>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { name: 'Maria Santos', route: 'SM Fairview → SM North EDSA', amount: 150.00, method: 'Cash', date: '08:35 AM • Today' },
            { name: 'Juan Dela Cruz', route: 'SM Fairview → UP Diliman', amount: 150.00, method: 'GCash', date: '10:15 AM • Today' },
            { name: 'Carla Reyes', route: 'Caloocan City Hall → Robinsons', amount: 210.00, method: 'GCash', date: '11:40 AM • Today' },
            { name: 'Mark Reyes', route: 'Novaliches → Cubao', amount: 175.00, method: 'GCash', date: '07:20 PM • Yesterday' },
            { name: 'Incentive Bonus', route: 'Daily Trip Incentive (10+ trips)', amount: 100.00, method: 'Bonus', date: 'Yesterday' }
          ].map((tx, idx) => (
            <div key={idx} className="py-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{tx.name}</p>
                <p className="text-[10px] text-slate-400">{tx.route}</p>
                <span className="text-[9px] text-slate-400">{tx.date}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-600">+₱{tx.amount.toFixed(2)}</span>
                <p className="text-[9px] text-slate-400">{tx.method}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Earnings Button (Slide 9) */}
      <button
        onClick={() => setShowWithdrawModal(true)}
        id="btn-driver-withdraw"
        className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-2xl text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
      >
        <Wallet className="w-4 h-4" />
        <span>Withdraw Earnings (Instant Payout)</span>
      </button>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl relative">
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-extrabold text-slate-900 font-display">Withdraw Driver Earnings</h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Select Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {[300, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setWithdrawAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      withdrawAmount === amt ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ₱{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Disbursement Channel</label>
              <select
                value={payoutMethod}
                onChange={e => setPayoutMethod(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="GCash">GCash Instant (0917 888 1234)</option>
                <option value="Maya">Maya Pay</option>
                <option value="BDO Bank Account">BDO Unibank (•••• 8912)</option>
                <option value="BPI Bank Account">BPI Express (•••• 4321)</option>
              </select>
            </div>

            <button
              onClick={handleWithdraw}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow transition-all"
            >
              Transfer ₱{withdrawAmount}.00 Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
