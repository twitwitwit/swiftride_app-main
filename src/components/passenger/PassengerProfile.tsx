import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  QrCode, 
  Star, 
  Bookmark, 
  Tag, 
  CreditCard, 
  MapPin, 
  Clock, 
  Award, 
  Share2, 
  HelpCircle, 
  Shield, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { useRide } from '../../context/RideContext';
import { SwiftRideLogo } from '../common/SwiftRideLogo';

interface PassengerProfileProps {
  onLogout: () => void;
  onNavigateToHistory: () => void;
}

export const PassengerProfile: React.FC<PassengerProfileProps> = ({ onLogout, onNavigateToHistory }) => {
  const { passenger, topUpWallet, showNotification } = useRide();
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showSavedPlacesModal, setShowSavedPlacesModal] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [topUpMethod, setTopUpMethod] = useState<string>('GCash');

  const handleTopUpSubmit = () => {
    topUpWallet(topUpAmount, topUpMethod);
    setShowTopUpModal(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-50 overflow-y-auto space-y-4">
      {/* User Header (Slide 5) */}
      <div className="flex items-center gap-3.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <img
          src={passenger.avatar}
          alt={passenger.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-sm"
        />
        <div className="flex-1">
          <h2 className="text-base font-extrabold text-slate-900 font-display">{passenger.name}</h2>
          <p className="text-xs text-slate-500 font-medium">{passenger.phone}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Account</span>
            </span>
          </div>
        </div>
      </div>

      {/* Wallet Balance Card (Slide 5) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Wallet Balance</p>
              <h3 className="text-xl font-black font-display text-amber-400">
                ₱{passenger.walletBalance.toFixed(2)}
              </h3>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowTopUpModal(true)}
              id="btn-passenger-topup"
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold rounded-xl shadow transition-all active:scale-95 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Top Up</span>
            </button>
            <button
              onClick={() => setShowQrModal(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-slate-700 transition-colors"
              title="My QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Quad Grid (Slide 5) */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="block text-base font-black text-slate-900 font-display">{passenger.completedRides}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">Completed Rides</span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <div className="flex items-center justify-center gap-0.5 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="text-base font-black text-slate-900 font-display">{passenger.rating}</span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase">Your Rating</span>
        </div>
        <div 
          onClick={() => setShowSavedPlacesModal(true)}
          className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs cursor-pointer hover:border-amber-300 transition-all"
        >
          <span className="block text-base font-black text-slate-900 font-display">{passenger.savedPlacesCount}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">Saved Places</span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="block text-base font-black text-amber-600 font-display">{passenger.promoVouchersCount}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">Promo Vouchers</span>
        </div>
      </div>

      {/* Menu List Items (Slide 5) */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
        <button
          onClick={() => showNotification('Personal Information', 'Account details: John Michael Nabung, 0912 345 6789, Metro Manila', 'info')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
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
          onClick={() => showNotification('Payment Methods', 'Active methods: GCash (0912***6789), VISA (•••• 1234), Cash', 'info')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Payment Methods</p>
              <p className="text-[10px] text-slate-400">Manage cards and payment options</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setShowSavedPlacesModal(true)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Saved Places</p>
              <p className="text-[10px] text-slate-400">Manage your saved locations</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onNavigateToHistory}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Ride History</p>
              <p className="text-[10px] text-slate-400">View your past rides</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => showNotification('Your Reviews', 'Average score: 4.8 stars across 25 completed rides.', 'info')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
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
          onClick={() => showNotification('Refer & Earn', 'Share referral code SWIFTJOHN to earn ₱100 credit on their first ride!', 'success')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Share2 className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">Refer & Earn</p>
              <p className="text-[10px] text-slate-400">Invite friends and earn rewards</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => showNotification('Help Center', '24/7 SwiftRide Manila Support hotline: (02) 8 123 4567', 'info')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
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
          onClick={() => showNotification('Safety Center', 'Emergency Contacts, Driver Screening Verification, 24/7 GPS Fleet Monitoring active.', 'info')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
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
          onClick={() => showNotification('Settings', 'Preferences: English language, metric units (km), push notifications enabled.', 'info')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
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

      {/* Log Out Button (Slide 5) */}
      <button
        onClick={onLogout}
        id="btn-passenger-logout"
        className="w-full py-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>

      {/* Top Up Wallet Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl relative">
            <button onClick={() => setShowTopUpModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-extrabold text-slate-900 font-display">Top Up SwiftRide Wallet</h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Select Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {[200, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      topUpAmount === amt ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ₱{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Payment Gateway</label>
              <select
                value={topUpMethod}
                onChange={e => setTopUpMethod(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="GCash">GCash E-Wallet</option>
                <option value="Maya">Maya Pay</option>
                <option value="BPI / BDO Online">Online Bank Transfer (InstaPay)</option>
                <option value="Credit / Debit Card">Visa / Mastercard</option>
              </select>
            </div>

            <button
              onClick={handleTopUpSubmit}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow transition-all"
            >
              Pay ₱{topUpAmount}.00 via {topUpMethod}
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl text-center relative">
            <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <SwiftRideLogo size="sm" variant="horizontal" />
            <h4 className="font-extrabold text-slate-900 font-display">SwiftRide In-App QR</h4>
            <div className="p-4 bg-slate-100 rounded-2xl inline-block border border-slate-200">
              <QrCode className="w-36 h-36 mx-auto text-slate-900" />
            </div>
            <p className="text-[11px] text-slate-500 font-mono">SWIFT-PASS-{passenger.id.toUpperCase()}</p>
            <p className="text-xs text-slate-600">Scan to receive wallet balance or quick rider verification.</p>
          </div>
        </div>
      )}

      {/* Saved Places Modal */}
      {showSavedPlacesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs space-y-3 shadow-2xl relative max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-slate-900 font-display text-sm">Saved Places ({(passenger?.savedPlaces || []).length})</h4>
              <button onClick={() => setShowSavedPlacesModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto no-scrollbar space-y-2 flex-1">
              {(passenger?.savedPlaces || []).map(p => (
                <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900">{p.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{p.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
