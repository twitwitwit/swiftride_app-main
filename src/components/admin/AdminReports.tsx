import React from 'react';
import { BarChart3, TrendingUp, Users, MapPin, Clock } from 'lucide-react';

export const AdminReports: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₱2,450,000', change: '+12.5%', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Active Users', value: '45,230', change: '+5.2%', icon: Users, color: 'text-blue-400' },
          { label: 'Total Rides', value: '128,450', change: '+8.1%', icon: MapPin, color: 'text-amber-400' },
          { label: 'Avg. Response', value: '2.4 mins', change: '-15%', icon: Clock, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className={`text-[10px] font-mono font-bold ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Reports List */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Generated Reports</h3>
          <button className="px-3 py-1.5 bg-amber-500 text-black text-[10px] font-black rounded-xl hover:bg-amber-400 transition-colors cursor-pointer uppercase tracking-wider">
            Export Data
          </button>
        </div>
        <div className="divide-y divide-zinc-800">
          {[
            { name: 'Monthly Revenue Analysis', date: 'Sept 01, 2024', type: 'Financial', size: '2.4 MB' },
            { name: 'Driver Performance Report', date: 'Aug 28, 2024', type: 'Operations', size: '1.8 MB' },
            { name: 'Regional Ride Density Heatmap', date: 'Aug 25, 2024', type: 'Analytics', size: '5.2 MB' },
            { name: 'User Growth & Retention', date: 'Aug 20, 2024', type: 'Marketing', size: '1.1 MB' },
            { name: 'Safety Incident Summary', date: 'Aug 15, 2024', type: 'Compliance', size: '0.9 MB' },
          ].map((report, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{report.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{report.date} • {report.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-slate-400">{report.size}</p>
                <button className="text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest mt-1 cursor-pointer">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
