import React from 'react';
import { Compass, RefreshCw, Layers, MapPin } from 'lucide-react';
import { InteractiveMap } from '../common/InteractiveMap';
import { useRide } from '../../context/RideContext';

export const AdminLiveMap: React.FC = () => {
  const { activeRide, driver, showNotification } = useRide();

  return (
    <div className="p-6 space-y-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display">Live Fleet Telemetry Radar</h2>
          <p className="text-xs text-slate-400">Real-time GPS tracking of active passenger rides and available driver units</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showNotification('Fleet Radar Refreshed', 'Synced with 2,315 active vehicle nodes.', 'success')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Refresh Ping</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 min-h-[480px] bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between relative shadow-xl overflow-hidden">
        <div className="flex items-center justify-between z-10 mb-2">
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-white font-bold">2,315 Vehicles Tracked</span>
          </div>

          <div className="flex gap-2 text-xs">
            <span className="px-2.5 py-1 bg-amber-400/20 text-amber-400 rounded-lg font-bold border border-amber-400/30">
              Active Dispatch: {activeRide ? '1 Live Ride' : '0 Idle'}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full relative rounded-2xl overflow-hidden">
          <InteractiveMap
            pickup={activeRide?.pickup}
            dropoff={activeRide?.dropoff}
            routeProgress={activeRide?.routeProgress}
            driverName={driver.name}
            driverPlate={driver.vehicle.plateNumber}
            height="h-full min-h-[400px]"
          />
        </div>
      </div>
    </div>
  );
};
