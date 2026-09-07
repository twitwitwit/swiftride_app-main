import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { RideProvider, useRide } from './context/RideContext';
import { AdminDashboard } from './components/admin/AdminDashboard';

function AppContent() {
  const { 
    notification, 
    closeNotification
  } = useRide();

  return (
    <div className="h-screen w-full bg-black text-slate-200 flex flex-col font-sans select-none antialiased overflow-hidden">
      {/* Main Screen: Directly Renders Administrator Web Portal */}
      <main className="flex-1 w-full h-full flex flex-col overflow-hidden bg-black">
        <AdminDashboard />
      </main>

      {/* Floating Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 max-w-sm ${
            notification.type === 'success' ? 'bg-zinc-900 text-white border-emerald-500/40' :
            notification.type === 'warning' ? 'bg-zinc-900 text-white border-amber-500/40' :
            'bg-zinc-900 text-white border-blue-500/40'
          }`}>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              notification.type === 'success' ? 'bg-emerald-500 text-black' :
              notification.type === 'warning' ? 'bg-amber-400 text-black' :
              'bg-blue-500 text-white'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
               notification.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
               <Info className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-white font-mono">{notification.title}</h5>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">{notification.message}</p>
            </div>
            <button onClick={closeNotification} className="text-slate-400 hover:text-white p-0.5 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <RideProvider>
      <AppContent />
    </RideProvider>
  );
}
