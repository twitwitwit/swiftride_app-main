import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  Star, 
  Award, 
  Car, 
  FileText, 
  CreditCard, 
  Clock, 
  Share2, 
  HelpCircle, 
  Shield, 
  Settings, 
  Power, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  X,
  FileCheck
} from 'lucide-react';
import { useRide } from '../../context/RideContext';

interface DriverProfileProps {
  onLogout: () => void;
  onNavigateToTrips: () => void;
  onNavigateToEarnings: () => void;
}

export const DriverProfile: React.FC<DriverProfileProps> = ({
  onLogout,
  onNavigateToTrips,
  onNavigateToEarnings
}) => {
  const { driver, toggleDriverOnline, showNotification } = useRide();
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);
  const [showVehicleModal, setShowVehicleModal] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 overflow-y-auto space-y-3.5">
      {/* Driver Header Card (Slide 9) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-13 h-13 rounded-full object-cover border-2 border-amber-400 shadow-sm"
              />
              <span className={`w-3 h-3 rounded-full ring-2 ring-white absolute bottom-0 right-0 ${
                driver.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
              }`}></span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h2 className="text-base font-extrabold text-slate-900 font-display">{driver.name}</h2>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              </div>
              <p className="text-[11px] text-slate-500 font-mono font-medium">Driver ID: {driver.driverIdCode}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold ${
                  driver.status === 'online' ? 'text-emerald-600' : 'text-slate-500'
                }`}>
                  ● {driver.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Balance Pill */}
          <div 
            onClick={onNavigateToEarnings}
            className="bg-slate-900 text-white px-3 py-2 rounded-xl text-right cursor-pointer hover:bg-slate-800 transition-colors shadow-xs"
          >
            <span className="text-[9px] text-slate-400 block font-medium">Wallet Balance</span>
            <span className="text-xs font-black text-amber-400">₱{driver.walletBalance.toFixed(2)}</span>
            <span className="text-[8px] text-slate-400 block hover:underline">View Wallet ›</span>
          </div>
        </div>
      </div>

      {/* 4 Driver Performance Stats (Slide 9) */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="block text-base font-black text-slate-900 font-display">{driver.totalTrips}</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">Total Trips</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <div className="flex items-center justify-center gap-0.5 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="text-base font-black text-slate-900 font-display">{driver.rating}</span>
          </div>
          <span className="text-[8px] font-bold text-slate-400 uppercase">Your Rating</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="block text-base font-black text-slate-900 font-display">{driver.acceptanceRate}%</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">Acceptance Rate</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="block text-base font-black text-amber-600 font-display">3</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase">Promo Vouchers</span>
        </div>
      </div>

      {/* My Vehicle Card (Slide 9) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">My Vehicle</h4>
          <button 
            onClick={() => setShowVehicleModal(true)}
            className="text-[11px] text-amber-600 font-bold hover:underline"
          >
            Manage ›
          </button>
        </div>

        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">{driver.vehicle.model}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] bg-slate-900 text-amber-400 font-bold px-1.5 py-0.5 rounded">
                {driver.vehicle.plateNumber}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">{driver.vehicle.type.toUpperCase()} • {driver.vehicle.seats} Seats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Settings Menu (Slide 9) */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
        <button
          onClick={() => showNotification('Personal Information', `Driver: ${driver.name}, Phone: ${driver.phone}, City: ${driver.city}`, 'info')}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Personal Information</p>
              <p className="text-[10px] text-slate-400">Manage your personal details</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onNavigateToEarnings}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Payment Methods</p>
              <p className="text-[10px] text-slate-400">Manage cards and payout options</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setShowDocsModal(true)}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Documents</p>
              <p className="text-[10px] text-slate-400">View and update your documents</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onNavigateToTrips}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Trip History</p>
              <p className="text-[10px] text-slate-400">View your past trips</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => showNotification('Driver Ratings', '5-star rating breakdown: 96% 5-stars, 4% 4-stars.', 'info')}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Your Reviews</p>
              <p className="text-[10px] text-slate-400">View and manage your reviews</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => showNotification('Refer Driver Partner', 'Invite fellow drivers with code DRV-JUAN and earn ₱500 bonus after their 10th trip!', 'success')}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Share2 className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Referrals & Earn</p>
              <p className="text-[10px] text-slate-400">Invite friends and earn rewards</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => showNotification('Help Center', 'Driver Partner Support Hotline: (02) 8 123 4567 • Available 24/7', 'info')}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Help Center</p>
              <p className="text-[10px] text-slate-400">Get help and support</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => showNotification('Safety Center', 'SwiftRide Emergency Safety Toolkit, Roadside Assistance & Live Telemetry active.', 'info')}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Safety Center</p>
              <p className="text-[10px] text-slate-400">Safety tools and emergency contacts</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => showNotification('Settings', 'Navigation voice: On, Auto-accept: Off, Night mode: Auto.', 'info')}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Settings</p>
              <p className="text-[10px] text-slate-400">App preferences and notifications</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Action Buttons: Go Offline & Log Out (Slide 9) */}
      <div className="space-y-2 pt-1">
        <button
          onClick={toggleDriverOnline}
          className={`w-full py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors ${
            driver.status === 'online'
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{driver.status === 'online' ? 'Go Offline' : 'Go Online'}</span>
        </button>

        <button
          onClick={onLogout}
          id="btn-driver-logout"
          className="w-full py-2.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Documents Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl relative">
            <button onClick={() => setShowDocsModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-extrabold text-slate-900 font-display">Driver Verification Documents</h3>
            
            <div className="space-y-2.5 text-xs">
              {[
                { title: "Professional Driver's License", status: 'Verified', date: 'Valid until 2028' },
                { title: 'NBI / Police Clearance', status: 'Verified', date: 'Valid until 2026' },
                { title: 'Vehicle OR/CR Certificate', status: 'Verified', date: 'Toyota Vios NDA 1234' },
                { title: 'LTFRB CPC Franchise Permit', status: 'Verified', date: 'Active TNVS' }
              ].map((doc, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-900">{doc.title}</p>
                      <p className="text-[10px] text-slate-400">{doc.date}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                showNotification('Document Update', 'Upload new renewals via web admin or photo scan.', 'info');
                setShowDocsModal(false);
              }}
              className="w-full py-2 bg-slate-900 text-amber-400 font-bold rounded-xl text-xs shadow"
            >
              Upload Renewal
            </button>
          </div>
        </div>
      )}

      {/* Manage Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl relative">
            <button onClick={() => setShowVehicleModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-extrabold text-slate-900 font-display">Manage Active Vehicle</h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-semibold">Model & Make</p>
                <p className="text-sm font-black text-slate-900">{driver.vehicle.model}</p>
                <p className="text-[11px] text-slate-600">Plate: {driver.vehicle.plateNumber} • Color: {driver.vehicle.color}</p>
              </div>
            </div>

            <button
              onClick={() => {
                showNotification('Vehicle Settings', 'Vehicle details verified and synced with LTFRB registration.', 'success');
                setShowVehicleModal(false);
              }}
              className="w-full py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow"
            >
              Save & Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
