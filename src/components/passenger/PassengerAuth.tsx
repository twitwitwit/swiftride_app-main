import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { SwiftRideLogo } from '../common/SwiftRideLogo';
import { useRide } from '../../context/RideContext';

interface PassengerAuthProps {
  onSuccess: () => void;
  onSwitchRole?: (role: 'passenger' | 'driver') => void;
}

export const PassengerAuth: React.FC<PassengerAuthProps> = ({ onSuccess, onSwitchRole }) => {
  const { passenger, updatePassenger, showNotification } = useRide();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Form states
  const [fullName, setFullName] = useState(passenger.name || 'John Michael Nabung');
  const [phoneNumber, setPhoneNumber] = useState(passenger.phone || '0912 345 6789');
  const [email, setEmail] = useState(passenger.email || 'john.nabung@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!fullName.trim() || !phoneNumber.trim()) {
        showNotification('Missing Information', 'Please fill in your name and mobile number.', 'warning');
        return;
      }
      updatePassenger({
        name: fullName,
        phone: phoneNumber,
        email: email
      });
      showNotification('Account Created', `Welcome to SwiftRide, ${fullName}!`, 'success');
    } else {
      showNotification('Welcome Back', `Logged in as ${passenger.name}`, 'success');
    }
    onSuccess();
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-white overflow-y-auto">
      {/* Top SwiftRide Brand Hero (Slide 3) */}
      <div className="flex flex-col items-center justify-center pt-2 pb-5">
        <SwiftRideLogo size="lg" variant="full" />
      </div>

      <div className="mb-4 text-center">
        <h2 className="text-2xl font-extrabold text-slate-900 font-display">
          {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isSignUp ? 'Sign up as a passenger to start booking rides' : 'Log in to continue your journey'}
        </p>
      </div>

      {/* Role Toggle Switch (Slide 3 & 7) */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-5 shadow-inner">
        <button
          type="button"
          id="tab-auth-passenger"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 shadow-sm transition-all"
        >
          <User className="w-3.5 h-3.5" />
          <span>PASSENGER</span>
        </button>
        <button
          type="button"
          id="tab-auth-driver-switch"
          onClick={() => onSwitchRole?.('driver')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
        >
          <span className="text-sm">🚗</span>
          <span>DRIVER</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 flex-1">
        {isSignUp && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-passenger-fullname"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
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
              id="input-passenger-phone"
              type="text"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="0912 345 6789"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
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
                id="input-passenger-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
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
                onClick={() => showNotification('Password Reset', 'Password reset code sent to your mobile phone.', 'info')}
                className="text-[11px] font-semibold text-amber-600 hover:underline"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-passenger-pwd"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
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

        {isSignUp && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-passenger-confirmpwd"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                required
              />
            </div>
          </div>
        )}

        {isSignUp && (
          <div className="flex items-start gap-2.5 p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 mt-1">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-900 leading-tight">
              <strong>Your Safety is Our Priority:</strong> We never share your personal information with third parties.
            </p>
          </div>
        )}

        <button
          type="submit"
          id="btn-passenger-auth-submit"
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-2 cursor-pointer"
        >
          {isSignUp ? 'Sign Up' : 'Log In'}
        </button>

        {/* Social Logins */}
        <div className="relative my-2 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <span className="relative px-3 bg-white text-[11px] text-slate-400 uppercase tracking-wider">or</span>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              showNotification('Google Sign In', 'Authenticated successfully with Google.', 'success');
              onSuccess();
            }}
            className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2.5 shadow-sm transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>
          
          <button
            type="button"
            onClick={() => {
              showNotification('Facebook Sign In', 'Authenticated successfully with Facebook.', 'success');
              onSuccess();
            }}
            className="w-full py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2.5 shadow-sm transition-all"
          >
            <span className="text-blue-600 font-bold text-sm">f</span>
            Continue with Facebook
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              id="btn-toggle-auth-mode"
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
