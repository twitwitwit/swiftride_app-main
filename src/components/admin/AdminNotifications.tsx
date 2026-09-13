import React, { useState } from 'react';
import { Bell, Info, AlertTriangle, ShieldCheck, Server, ShieldAlert, Siren, Phone } from 'lucide-react';
import { useRide } from '../../context/RideContext';

export const AdminNotifications: React.FC = () => {
  const { emergencyRequests, showNotification } = useRide();
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [showOlder, setShowOlder] = useState<boolean>(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <span>System Activity & Emergency Notifications</span>
          {emergencyRequests.filter(e => e.status === 'active').length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] animate-pulse">
              {emergencyRequests.filter(e => e.status === 'active').length} Emergency Alert(s)
            </span>
          )}
        </h3>
        <button
          onClick={() => setReadIds(new Set([0, 1, 2, 3, 4]))}
          className="text-[10px] font-mono font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-3 font-mono">
        {/* Dynamic User Emergency Notifications */}
        {emergencyRequests.map(req => (
          <div 
            key={req.id} 
            className={`p-4 rounded-2xl border flex gap-4 transition-all ${
              req.status === 'active' 
                ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500/50 shadow-lg' 
                : req.status === 'responding'
                ? 'bg-amber-950/30 border-amber-500/50'
                : 'bg-zinc-950 border-zinc-800'
            }`}
          >
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border ${
              req.status === 'active' 
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-rose-400">Emergency SOS #{req.id}</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-medium border border-rose-500/30">
                    {req.emergencyType}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    req.userRole === 'driver' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {req.userRole}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase">{req.createdAt}</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-bold">
                {req.userName} ({req.userPhone}): {req.notes || 'Emergency Safety SOS triggered during trip.'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                <span>Location: <strong className="text-amber-300">{req.location.name}</strong></span>
                {req.assignedResponder && (
                  <span className="text-amber-400">• Unit: {req.assignedResponder}</span>
                )}
              </p>
            </div>
          </div>
        ))}

        {/* Regular System Notifications */}
        {[
          { 
            title: 'Critical Server Load', 
            time: '12 mins ago', 
            desc: 'Main production cluster at 85% CPU usage. Auto-scaling initiated.',
            icon: Server,
            color: 'text-rose-400',
            bg: 'bg-rose-400/10',
            border: 'border-rose-400/20'
          },
          { 
            title: 'New Regulatory Compliance Notice', 
            time: '45 mins ago', 
            desc: 'LTFRB has updated the maximum base fare guidelines for Region IV-A.',
            icon: ShieldCheck,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            border: 'border-blue-400/20'
          },
          { 
            title: 'Driver Strike Warning', 
            time: '2 hours ago', 
            desc: 'Monitoring social sentiment regarding upcoming fuel price increases.',
            icon: AlertTriangle,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            border: 'border-amber-400/20'
          },
          { 
            title: 'Platform Maintenance Scheduled', 
            time: '4 hours ago', 
            desc: 'Weekly database optimization scheduled for Sunday at 02:00 AM PHT.',
            icon: Info,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            border: 'border-purple-400/20'
          },
          { 
            title: 'Successful Backup', 
            time: '6 hours ago', 
            desc: 'Full system backup completed successfully. 4.2TB archived to Cold Storage.',
            icon: ShieldCheck,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            border: 'border-emerald-400/20'
          },
        ].map((note, i) => (
          <div key={i} onClick={() => setReadIds(prev => new Set(prev).add(i))} className={`p-4 rounded-2xl border ${note.border} ${note.bg} flex gap-4 hover:brightness-110 transition-all cursor-pointer ${readIds.has(i) ? 'opacity-50' : ''}`}>
            <div className={`w-10 h-10 shrink-0 rounded-xl bg-zinc-950 flex items-center justify-center border ${note.border}`}>
              <note.icon className={`w-5 h-5 ${note.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-black text-white">{note.title}</p>
                <span className="text-[10px] text-slate-500 uppercase">{note.time}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {note.desc}
              </p>
            </div>
          </div>
        ))}
        {showOlder && (
          <>
            <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950 flex gap-4"><div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center"><Info className="w-5 h-5 text-slate-500" /></div><div><p className="text-sm font-black text-white">Monthly reconciliation completed</p><p className="text-xs text-slate-500">Yesterday · Finance export archived successfully.</p></div></div>
            <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950 flex gap-4"><div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center"><Server className="w-5 h-5 text-slate-500" /></div><div><p className="text-sm font-black text-white">Service health check passed</p><p className="text-xs text-slate-500">2 days ago · All central services reported healthy.</p></div></div>
          </>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <button onClick={() => setShowOlder(true)} className="px-6 py-2 bg-zinc-900 border border-zinc-800 text-slate-400 text-xs font-mono font-black rounded-xl hover:text-white transition-colors cursor-pointer uppercase tracking-widest">
          {showOlder ? 'Older Notifications Loaded' : 'Load Older Notifications'}
        </button>
      </div>
    </div>
  );
};
