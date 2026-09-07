import React, { useState } from 'react';
import { SwiftRideLogo } from '../common/SwiftRideLogo';
import { Shield, Lock, User, ArrowRight, AlertCircle, Key } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminAuthProps {
  onLogin: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate authentication delay
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid administrative credentials. Access denied.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-full w-full bg-black flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <SwiftRideLogo size="lg" variant="full" theme="dark" className="mb-2" />
          <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
              Secure Admin Gateway
            </span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="absolute -top-3 left-8 px-4 py-1 bg-amber-500 text-black text-[10px] font-black rounded-lg shadow-lg uppercase tracking-widest border border-amber-400/50">
            Internal Access Only
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-black text-white mb-1 tracking-tight">Admin Authentication</h2>
            <p className="text-xs text-slate-500 font-medium">Enter your credentials to manage the SwiftRide platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-amber-500">
                  <User className="w-4 h-4 text-slate-600 group-focus-within:text-amber-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all"
                  placeholder="admin_id"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-amber-500">
                  <Key className="w-4 h-4 text-slate-600 group-focus-within:text-amber-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-rose-400 leading-snug">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-slate-600 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98] cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/50 flex items-center justify-center gap-4 text-slate-600 font-mono text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>SSL SECURE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>ENCRYPTED V4</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
          SwiftRide Infrastructure Management Console &copy; 2024
        </p>
      </motion.div>
    </div>
  );
};
