import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { api } from '../lib/api.ts';
import { UserProfile } from '../types/index.ts';
import { BrandLogo } from './BrandLogo.tsx';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.register({
        email,
        password,
        full_name: fullName,
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Unable to complete registration. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await api.resetPassword(email, 'Pass' + Math.floor(100000 + Math.random() * 900000));
      setSuccessMsg(res.message || 'Password reset link has been dispatched to your email.');
    } catch (err: any) {
      setError(err.message || 'No registered account found with this email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Ambient multi-million-dollar subtle glow */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-600/15 rounded-[36px] blur-2xl opacity-80 pointer-events-none" />

        <div className="relative bg-[#ffffff]/98 backdrop-blur-3xl rounded-[32px] shadow-[0_30px_90px_-20px_rgba(14,28,20,0.22)] border border-[#e5e3d8] overflow-hidden">
          {/* Subtle Top Accent Ribbon */}
          <div className="h-1 bg-gradient-to-r from-[#173827] via-[#2d6a4f] to-[#173827]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#718277] hover:text-[#112318] w-8 h-8 rounded-full bg-[#f4f3ec] hover:bg-[#e9e7dc] flex items-center justify-center transition-all cursor-pointer z-10 active:scale-90"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Brand Header */}
          <div className="pt-7 pb-4 px-6 sm:px-8 text-center flex flex-col items-center">
            <BrandLogo size="md" />

            <p className="text-xs text-[#52665a] mt-2.5 font-medium">
              {mode === 'login' && 'Sign in to access your digital library, guides & courses.'}
              {mode === 'register' && 'Create your account for instant lifetime access.'}
              {mode === 'forgot' && 'Enter your registered email to reset your security credentials.'}
            </p>

            {/* Ultra-Luxury Segmented Switcher */}
            {mode !== 'forgot' && (
              <div className="mt-5 p-1 bg-[#edebe1] rounded-2xl flex items-center w-full max-w-[280px] border border-[#dddad0]">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('login');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-[#112318] shadow-xs'
                      : 'text-[#617467] hover:text-[#112318]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMode('register');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-[#112318] shadow-xs'
                      : 'text-[#617467] hover:text-[#112318]'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 pt-2">
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200/90 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5 shadow-2xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200/90 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5 shadow-2xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-[#4f6458] mb-1.5 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8a9c90] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#faf9f5] hover:bg-white focus:bg-white text-[#14231b] placeholder-[#9caea2] rounded-2xl border border-[#dedad0] focus:border-[#1b3428] focus:outline-none focus:ring-2 focus:ring-[#1b3428]/10 transition-all shadow-2xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold tracking-wider uppercase text-[#4f6458] font-mono">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setSuccessMsg('');
                        setMode('forgot');
                      }}
                      className="text-[11px] text-[#24523b] hover:text-[#112318] font-semibold transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8a9c90] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm bg-[#faf9f5] hover:bg-white focus:bg-white text-[#14231b] placeholder-[#9caea2] rounded-2xl border border-[#dedad0] focus:border-[#1b3428] focus:outline-none focus:ring-2 focus:ring-[#1b3428]/10 transition-all shadow-2xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#8a9c90] hover:text-[#14231b] transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-5 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#173325] via-[#1b3b2b] to-[#12281d] hover:from-[#11241a] hover:to-[#0c1b13] disabled:opacity-50 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-5 cursor-pointer active:scale-[0.99]"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In to Your Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 2. CREATE ACCOUNT FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-[#4f6458] mb-1.5 font-mono">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8a9c90] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#faf9f5] hover:bg-white focus:bg-white text-[#14231b] placeholder-[#9caea2] rounded-2xl border border-[#dedad0] focus:border-[#1b3428] focus:outline-none focus:ring-2 focus:ring-[#1b3428]/10 transition-all shadow-2xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-[#4f6458] mb-1.5 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8a9c90] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#faf9f5] hover:bg-white focus:bg-white text-[#14231b] placeholder-[#9caea2] rounded-2xl border border-[#dedad0] focus:border-[#1b3428] focus:outline-none focus:ring-2 focus:ring-[#1b3428]/10 transition-all shadow-2xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-[#4f6458] mb-1.5 font-mono">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8a9c90] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm bg-[#faf9f5] hover:bg-white focus:bg-white text-[#14231b] placeholder-[#9caea2] rounded-2xl border border-[#dedad0] focus:border-[#1b3428] focus:outline-none focus:ring-2 focus:ring-[#1b3428]/10 transition-all shadow-2xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-[#8a9c90] hover:text-[#14231b] transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#788a80] mt-1 pl-1">
                    Minimum 6 characters with letters or numbers
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-5 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#173325] via-[#1b3b2b] to-[#12281d] hover:from-[#11241a] hover:to-[#0c1b13] disabled:opacity-50 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-5 cursor-pointer active:scale-[0.99]"
                >
                  <span>{loading ? 'Creating Account...' : 'Complete Registration & Access'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD FORM */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-[#4f6458] mb-1.5 font-mono">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8a9c90] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#faf9f5] hover:bg-white focus:bg-white text-[#14231b] placeholder-[#9caea2] rounded-2xl border border-[#dedad0] focus:border-[#1b3428] focus:outline-none focus:ring-2 focus:ring-[#1b3428]/10 transition-all shadow-2xs font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-5 text-xs sm:text-sm font-extrabold text-white bg-[#1b3428] hover:bg-[#12261d] disabled:opacity-50 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{loading ? 'Sending Recovery...' : 'Send Password Recovery'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setSuccessMsg('');
                      setMode('login');
                    }}
                    className="text-xs font-bold text-[#24523b] hover:text-[#112318] transition-colors cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Trust and Encryption Footnote */}
            <div className="mt-6 pt-4 border-t border-[#f0eee6] flex items-center justify-center gap-2 text-[11px] text-[#788a80]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#24523b]" />
              <span>256-Bit SSL Encrypted · Instant Private Digital Library Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
