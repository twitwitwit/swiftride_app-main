import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Car, MapPin, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { SwiftRideLogo } from '../common/SwiftRideLogo';
import { useRide } from '../../context/RideContext';
import { VehicleCategory } from '../../types';

interface DriverAuthProps {
  onSuccess: () => void;
  onSwitchRole?: (role: 'passenger' | 'driver') => void;
}

export const DriverAuth: React.FC<DriverAuthProps> = ({ onSuccess, onSwitchRole }) => {
  const { driver, updateDriver, showNotification } = useRide();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form fields
  const [fullName, setFullName] = useState<string>(driver.name || 'Juan Dela Cruz');
  const [phone, setPhone] = useState<string>(driver.phone || '0917 888 1234');
  const [email, setEmail] = useState<string>(driver.email || 'juan.delacruz@swiftride.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [confirmPassword, setConfirmPassword] = useState<string>('••••••••');
  const [vehicleType, setVehicleType] = useState<VehicleCategory>(driver.vehicle.type || 'sedan');
  const [plateNumber, setPlateNumber] = useState<string>(driver.vehicle.plateNumber || 'NDA 1234');
  const [city, setCity] = useState<string>(driver.city || 'Caloocan City');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!fullName.trim() || !phone.trim() || !plateNumber.trim()) {
        showNotification('Missing Information', 'Please complete vehicle and contact details.', 'warning');
        return;
      }
      updateDriver({
        name: fullName,
        phone,
        email,
        city,
        vehicle: {
          ...driver.vehicle,
          type: vehicleType,
          plateNumber
        }
      });
      showNotification('Driver Partner Registered', 'Welcome to SwiftRide Driver Fleet!', 'success');
    } else {
      showNotification('Welcome Back Driver', `Logged in as ${driver.name}`, 'success');
    }
    onSuccess();
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-white overflow-y-auto">
      {/* Top SwiftRide Brand Hero (Slide 7) */}
      <div className="flex flex-col items-center justify-center pt-1 pb-4">
        <SwiftRideLogo size="lg" variant="full" />
      </div>

      <div className="mb-4 text-center">
        <h2 className="text-2xl font-extrabold text-slate-900 font-display">
          {isSignUp ? 'Create Driver Account' : 'Welcome Back!'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isSignUp ? 'Sign up to start driving with SwiftRide' : 'Log in to start accepting rides and earning'}
        </p>
      </div>

      {/* Role Toggle Switch (Slide 7) */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-4 shadow-inner">
        <button
          type="button"
          id="tab-auth-passenger-switch"
          onClick={() => onSwitchRole?.('passenger')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>PASSENGER</span>
        </button>
        <button
          type="button"
          id="tab-auth-driver"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 shadow-sm transition-all"
        >
          <span className="text-sm">🚗</span>
          <span>DRIVER</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
        {isSignUp && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-driver-fullname"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {isSignUp ? 'Phone Number' : 'Email or Phone Number'}
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-driver-phone"
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="0917 888 1234"
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              required
            />
          </div>
        </div>

        {isSignUp && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-driver-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-700">Password</label>
            {!isSignUp && (
              <button 
                type="button" 
                onClick={() => showNotification('Driver Support', 'SMS reset pin sent to driver phone.', 'info')}
                className="text-[11px] font-semibold text-amber-600 hover:underline"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-driver-pwd"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Driver Specific Information (Slide 7) */}
        {isSignUp && (
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Driver Information</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Vehicle Type</label>
                <div className="relative">
                  <Car className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value as any)}
                    className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="sedan">Sedan (4 Seats)</option>
                    <option value="suv">SUV (6 Seats)</option>
                    <option value="van">Van (10 Seats)</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Plate Number</label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={e => setPlateNumber(e.target.value.toUpperCase())}
                  placeholder="NDA 1234"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Operating City</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="Caloocan City">Caloocan City</option>
                  <option value="Quezon City">Quezon City</option>
                  <option value="Manila">Manila City</option>
                  <option value="Pasig City">Pasig City</option>
                  <option value="Makati City">Makati City</option>
                  <option value="Taguig City (BGC)">Taguig (BGC)</option>
                </select>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-xl border border-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-900">
                <strong>Drive with Confidence:</strong> Your data is secured with enterprise-grade encryption.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          id="btn-driver-auth-submit"
          className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-md transition-all active:scale-[0.98] mt-2 cursor-pointer"
        >
          {isSignUp ? 'Sign Up as Driver' : 'Log In to Driver Partner'}
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-600">
            {isSignUp ? 'Already have a driver account?' : "Don't have a driver account?"}{' '}
            <button
              type="button"
              id="btn-toggle-driver-auth-mode"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-amber-600 font-bold hover:underline ml-1"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
