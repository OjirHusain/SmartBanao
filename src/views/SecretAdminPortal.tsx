import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Terminal,
  Cpu,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, SiteSettings, Product, Bundle, Course } from '../types/index.ts';
import { AdminView } from './AdminView.tsx';
import { api } from '../lib/api.ts';
import { BrandLogo } from '../components/BrandLogo.tsx';

interface SecretAdminPortalProps {
  user: UserProfile | null;
  products: Product[];
  bundles: Bundle[];
  courses: Course[];
  settings: SiteSettings;
  onRefreshData: () => void;
  onNavigateHome: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const SecretAdminPortal: React.FC<SecretAdminPortalProps> = ({
  user,
  products,
  bundles,
  courses,
  settings,
  onRefreshData,
  onNavigateHome,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  // Ensure URL reflects secret route
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.pathname.includes('admin')) {
      try {
        window.history.replaceState(null, '', '/admin');
      } catch {}
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.user.role !== 'admin') {
        setError('Access Denied: This account does not possess administrator privileges.');
        return;
      }
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@smartbanao.com');
    setPassword('admin123');
    setError('');
  };

  if (isAdmin && user) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        {/* Admin Bar */}
        <div className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-8 py-3 flex items-center justify-between text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider uppercase font-mono text-cyan-300">
                Admin Console
              </span>
              <span className="text-slate-400 hidden sm:inline">|</span>
              <span className="text-slate-300 font-mono hidden sm:inline">{user.email}</span>
            </div>
          </div>
          <button
            onClick={() => {
              try {
                window.history.replaceState(null, '', '/');
              } catch {}
              onNavigateHome();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-xs font-semibold border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Admin & Return to Store</span>
          </button>
        </div>

        <AdminView
          user={user}
          products={products}
          bundles={bundles}
          courses={courses}
          settings={settings}
          onRefreshData={onRefreshData}
          onNavigate={onNavigateHome}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/10 via-sky-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top subtle bar */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between text-[11px] text-slate-500 pt-2 z-10">
        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>SMARTBANAO_SECURE_AUTH</span>
        </div>
        <span className="font-mono text-slate-600">PORTAL v2.4</span>
      </div>

      <div className="max-w-md w-full mx-auto my-auto pt-6 pb-12 z-10">
        {/* Security badge and branding */}
        <div className="text-center mb-7 flex flex-col items-center">
          <div className="mb-4">
            <BrandLogo size="md" light showTagline />
          </div>

          <div className="relative inline-block mb-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700/80 text-cyan-400 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-950/40">
              <Lock className="w-6 h-6" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#070b14] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#070b14]" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Administrative Security Gateway
          </h1>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Unlisted Route · /admin & /admin.php</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Restricted control interface. This portal is concealed from public navigation and requires verified administrator authorization.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-950/90 border border-rose-800/80 rounded-2xl text-xs text-rose-200 flex items-start gap-2.5 shadow-sm animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold block text-rose-300">Access Restricted</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Quick Admin Credential Autofill */}
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin credentials:</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-[11px] font-semibold rounded-xl transition-all border border-cyan-500/30 flex items-center gap-1 cursor-pointer"
            >
              <span>Fill Administrator Key</span>
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] tracking-wide uppercase font-mono">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smartbanao.com"
                  className="w-full px-4 py-3 bg-slate-950/90 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 font-mono text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] tracking-wide uppercase font-mono">
                Master Security Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-11 py-3 bg-slate-950/90 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 font-mono text-xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-5 cursor-pointer active:scale-[0.99]"
            >
              <span>{loading ? 'Authenticating System...' : 'Authenticate & Unlock Admin Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer inside card */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>HMAC Protected · JWT 256</span>
            </span>
            <button
              onClick={() => {
                try {
                  window.history.replaceState(null, '', '/');
                } catch {}
                onNavigateHome();
              }}
              className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-medium"
            >
              <span>Return to Store</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Secret notice */}
      <div className="text-center text-[11px] text-slate-600 font-mono pb-2 z-10">
        SmartBanao Core · Hidden Endpoint Protocol · Unauthorized access attempts are monitored
      </div>
    </div>
  );
};
