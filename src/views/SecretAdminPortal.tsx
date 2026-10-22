import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { api, authStorage } from '../lib/api.ts';
import { Bundle, Course, Product, SiteSettings, UserProfile } from '../types/index.ts';
import { BrandLogo } from '../components/BrandLogo.tsx';
import { AdminView } from './AdminView.tsx';

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
  const [email, setEmail] = useState('admin@smartbanao.com');
  const [password, setPassword] = useState('admin123');
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

  // If token is already present, attempt verifying admin session
  useEffect(() => {
    async function checkExistingToken() {
      if (authStorage.getToken() && !user) {
        try {
          const res = await api.getMe();
          if (res.user.role === 'admin') {
            onLoginSuccess(res.user);
          }
        } catch {
          // Token expired or invalid
        }
      }
    }
    checkExistingToken();
  }, [user, onLoginSuccess]);

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const loginEmail = email.trim() || 'admin@smartbanao.com';
    const loginPassword = password.trim() || 'admin123';

    try {
      const res = await api.login({ email: loginEmail, password: loginPassword });
      if (res.user.role !== 'admin') {
        setError('Access Denied: This account does not possess administrator privileges.');
        return;
      }
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectInstantAccess = async () => {
    setEmail('admin@smartbanao.com');
    setPassword('admin123');
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email: 'admin@smartbanao.com', password: 'admin123' });
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate administrator.');
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin && user) {
    return (
      <AdminView
        user={user}
        products={products}
        bundles={bundles}
        courses={courses}
        settings={settings}
        onRefreshData={onRefreshData}
        onNavigate={() => {
          try {
            window.history.replaceState(null, '', '/');
          } catch {}
          onNavigateHome();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#14231b] flex flex-col justify-between p-4 sm:p-6 relative select-none">
      {/* Top subtle bar */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between text-[11px] text-[#6b7c71] pt-2 z-10">
        <div className="flex items-center gap-2 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1b3428]" />
          <span>SMARTBANAO_SECURE_AUTH</span>
        </div>
        <span className="font-mono text-[#8b9c91]">v3.0</span>
      </div>

      <div className="max-w-md w-full mx-auto my-auto pt-6 pb-12 z-10">
        {/* Security badge and branding */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-4">
            <BrandLogo size="md" showTagline />
          </div>

          <div className="relative inline-block mb-3">
            <div className="w-13 h-13 rounded-2xl bg-[#1b3428] text-emerald-300 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b3428]" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#14231b] tracking-tight">
            Administrator Gateway
          </h1>
          <p className="text-xs text-[#526358] mt-1.5 max-w-sm mx-auto leading-relaxed">
            Executive management console for store products, orders, customers, and digital library licenses.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e3db] shadow-md space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="space-y-0.5 flex-1">
                <span className="font-semibold block text-rose-800">Access Restricted</span>
                <span>{error}</span>
              </div>
              <button
                onClick={handleDirectInstantAccess}
                className="px-2 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded text-[10px] font-bold shrink-0 cursor-pointer"
              >
                Auto-Fix & Enter
              </button>
            </div>
          )}

          {/* Instant 1-Click Entry Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleDirectInstantAccess}
            className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#1b3428] hover:bg-[#14291f] disabled:opacity-50 rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{loading ? 'Opening Admin Console...' : '1-Click Direct Access to Admin Panel'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-[#8b9c91]">
            <span className="h-px bg-[#e5e3db] flex-1" />
            <span>or sign in manually</span>
            <span className="h-px bg-[#e5e3db] flex-1" />
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#14231b] font-bold mb-1.5 text-[11px] tracking-wide uppercase font-mono">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartbanao.com"
                className="w-full px-4 py-3 bg-[#faf9f5] text-[#14231b] placeholder-[#8b9c91] rounded-xl border border-[#dedad0] focus:outline-none focus:ring-1 focus:ring-[#1b3428] font-mono text-xs transition-all"
              />
            </div>

            <div>
              <label className="block text-[#14231b] font-bold mb-1.5 text-[11px] tracking-wide uppercase font-mono">
                Master Security Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-11 py-3 bg-[#faf9f5] text-[#14231b] placeholder-[#8b9c91] rounded-xl border border-[#dedad0] focus:outline-none focus:ring-1 focus:ring-[#1b3428] font-mono text-xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#6b7c71] hover:text-[#14231b] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-[#183628] bg-[#dbe6e0] hover:bg-[#cfded6] border border-[#c5d5cb] disabled:opacity-50 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <KeyRound className="w-4 h-4 text-[#183628]" />
              <span>{loading ? 'Authenticating...' : 'Sign In with Credentials'}</span>
            </button>
          </form>

          {/* Footer inside card */}
          <div className="pt-3 border-t border-[#f0eee6] flex items-center justify-between text-[11px] text-[#6b7c71]">
            <span className="flex items-center gap-1.5 text-[#526358]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>HMAC Protected · JWT 256</span>
            </span>
            <button
              onClick={() => {
                try {
                  window.history.replaceState(null, '', '/');
                } catch {}
                onNavigateHome();
              }}
              className="text-[#1b3428] hover:underline transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Return to Store</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Secret notice */}
      <div className="text-center text-[11px] text-[#8b9c91] font-mono pb-2 z-10">
        SmartBanao Core · Administrator Console · Tier-1 Digital Commerce
      </div>
    </div>
  );
};
