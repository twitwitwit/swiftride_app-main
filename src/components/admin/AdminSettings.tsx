import React, { useState } from 'react';
import { Settings, DollarSign, Shield, Save } from 'lucide-react';
import { useRide } from '../../context/RideContext';

export const AdminSettings: React.FC = () => {
  const { showNotification, savePlatformSettings } = useRide();

  // Fare settings state
  const [baseFare, setBaseFare] = useState<number>(45.00);
  const [perKmRate, setPerKmRate] = useState<number>(12.50);
  const [commission, setCommission] = useState<number>(20);
  const [surgeMax, setSurgeMax] = useState<number>(3.5);

  // Security toggles state
  const [twoFactor, setTwoFactor] = useState<boolean>(true);
  const [vehicleVerification, setVehicleVerification] = useState<boolean>(true);
  const [autoSuspend, setAutoSuspend] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      await savePlatformSettings({ baseFare, perKmRate, commission, surgeMax, twoFactor, vehicleVerification, autoSuspend });
      showNotification('Settings Applied', `Platform configuration saved. Base fare ₱${baseFare}, commission ${commission}%.`, 'success');
    } catch (error) {
      showNotification('Settings Save Failed', error instanceof Error ? error.message : 'Please try again.', 'warning');
    }
  };

  const toggleClass = (active: boolean) =>
    `w-12 h-6 rounded-full relative transition-colors cursor-pointer ${active ? 'bg-amber-500' : 'bg-zinc-800'}`;
  const knobClass = (active: boolean) =>
    `absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? 'left-7' : 'left-1'}`;

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Fare Settings Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <DollarSign className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Fare & Commission Configuration</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest ml-1">Base Ride Fare (₱)</label>
            <input
              type="number"
              value={baseFare}
              onChange={e => setBaseFare(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest ml-1">Per Kilometer Rate (₱)</label>
            <input
              type="number"
              value={perKmRate}
              onChange={e => setPerKmRate(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest ml-1">Platform Commission (%)</label>
            <input
              type="number"
              value={commission}
              onChange={e => setCommission(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest ml-1">Surge Max Multiplier</label>
            <input
              type="number"
              value={surgeMax}
              step="0.1"
              onChange={e => setSurgeMax(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Security & Access Section */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Security & Access Control</h3>
        </div>

        <div className="space-y-3">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500 font-medium">Enforce 2FA for all driver and admin logins</p>
            </div>
            <div className={toggleClass(twoFactor)} onClick={() => setTwoFactor(v => !v)} role="switch" aria-checked={twoFactor}>
              <div className={knobClass(twoFactor)} />
            </div>
          </div>

          {/* Vehicle Verification Protocol */}
          <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-white">Vehicle Verification Protocol</p>
              <p className="text-xs text-slate-500 font-medium">Require manual audit for all new vehicle registrations</p>
            </div>
            <div className={toggleClass(vehicleVerification)} onClick={() => setVehicleVerification(v => !v)} role="switch" aria-checked={vehicleVerification}>
              <div className={knobClass(vehicleVerification)} />
            </div>
          </div>

          {/* Auto Suspension */}
          <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-white">Automatic Account Suspension</p>
              <p className="text-xs text-slate-500 font-medium">Suspend users with average rating below 3.5 stars</p>
            </div>
            <div className={toggleClass(autoSuspend)} onClick={() => setAutoSuspend(v => !v)} role="switch" aria-checked={autoSuspend}>
              <div className={knobClass(autoSuspend)} />
            </div>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          className="flex items-center gap-2.5 px-8 py-3 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20 cursor-pointer uppercase tracking-widest text-xs"
        >
          <Save className="w-4 h-4" />
          <span>Apply System Changes</span>
        </button>
      </div>
    </div>
  );
};
