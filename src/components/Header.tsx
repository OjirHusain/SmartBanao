import React, { useState } from 'react';
import {
  Menu,
  X,
  Library,
  LogOut,
  User,
  BookOpen,
  Layers,
  FileText,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';
import { BrandLogo } from './BrandLogo.tsx';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  user: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  const userInitial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#faf9f5]/95 backdrop-blur-xl border-b border-[#e8e7e1]/80 transition-all select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark: Ultra-Premium Luxury BrandLogo */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleNav('home')}
              className="group focus-visible:outline-none transition-transform active:scale-[0.98] cursor-pointer"
              aria-label="SmartBanao Home"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Right Action Bar: Profile icon completely removed from header bar as requested! Only sleek iOS Menu button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-9 h-9 rounded-full border transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer ${
                mobileMenuOpen
                  ? 'bg-[#1b3428] border-[#1b3428] text-white shadow-xs'
                  : 'bg-white border-[#dedcd5] hover:bg-[#f2f1eb] text-[#22352b]'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="w-4 h-4 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* iOS Ultra-Premium Navigation Sheet / Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-50 bg-black/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="max-w-md ml-auto mr-4 mt-2 sm:mr-8 bg-white/98 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border border-[#e4e2d8] shadow-2xl animate-in slide-in-from-top-3 duration-200 space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info / Account bar */}
            {user ? (
              <div className="p-3 bg-[#f5f4ed] rounded-2xl border border-[#e6e4dc] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#1b3428] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#14231b] truncate">{user.full_name}</p>
                    <p className="text-[11px] text-[#6b7c71] truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 inline mr-1" />
                  <span>Exit</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-gradient-to-br from-[#f5f8f6] to-[#edf4f0] rounded-2xl border border-[#dce8e1] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#14231b]">Welcome to SmartBanao</p>
                  <p className="text-[11px] text-[#55695d]">Sign in to access your digital library</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-[#1b3428] hover:bg-[#12261d] rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Menu Links */}
            <div className="space-y-1">
              <button
                onClick={() => handleNav('home')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-[#1b3428] text-white shadow-xs'
                    : 'text-[#1c2c23] hover:bg-[#f4f3ec]'
                }`}
              >
                <span>Home Showcase</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => handleNav('library')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'library'
                    ? 'bg-[#1b3428] text-white shadow-xs'
                    : 'text-[#1c2c23] hover:bg-[#f4f3ec]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Library className="w-4 h-4 text-[#2e5d45]" />
                  <span>My Digital Library</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e8eae8] text-[#1b3428]">
                  Cloud
                </span>
              </button>

              <button
                onClick={() => handleNav('products')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'products'
                    ? 'bg-[#1b3428] text-white shadow-xs'
                    : 'text-[#1c2c23] hover:bg-[#f4f3ec]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#5c6e63]" />
                  <span>Full Collection</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => handleNav('bundles')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'bundles'
                    ? 'bg-[#1b3428] text-white shadow-xs'
                    : 'text-[#1c2c23] hover:bg-[#f4f3ec]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#5c6e63]" />
                  <span>Bundles (Plan A & B)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Save 40%
                </span>
              </button>
            </div>

            {/* Quick Policies & Contact footer */}
            <div className="pt-2 border-t border-[#f0eee6] flex items-center justify-between text-[11px] text-[#6d7e73] px-1">
              <button
                onClick={() => handleNav('contact')}
                className="hover:text-[#1b3428] font-medium transition-colors cursor-pointer"
              >
                Support Inquiry
              </button>
              <button
                onClick={() => handleNav('refund')}
                className="hover:text-[#1b3428] font-medium transition-colors cursor-pointer"
              >
                Refund Policy
              </button>
              <button
                onClick={() => handleNav('terms')}
                className="hover:text-[#1b3428] font-medium transition-colors cursor-pointer"
              >
                Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
