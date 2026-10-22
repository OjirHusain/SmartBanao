import React, { useState } from 'react';
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck,
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
  const [searchQuery, setSearchQuery] = useState('');

  const handleNav = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onNavigate('products');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-[#e8e4da] transition-all select-none">
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

          {/* Right Action Bar: Menu button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-9 h-9 rounded-full border transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer ${
                mobileMenuOpen
                  ? 'bg-[#5A3E2B] border-[#5A3E2B] text-white shadow-xs'
                  : 'bg-white border-[#ded9ce] hover:bg-[#f5f2ec] text-[#5A3E2B]'
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

      {/* 
        =============================================================================
        MENU BAR EXACT REPLICATION (Screenshot_2026_1022_191702_1c29cd27.png)
        Clean search at top + Uppercase navigation options with brand colors
        =============================================================================
      */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-50 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-md ml-auto mr-3 sm:mr-6 mt-2 bg-white rounded-3xl border border-[#e4ded3] shadow-2xl overflow-hidden animate-in slide-in-from-top-3 duration-200 select-none font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Search for products input matching screenshot */}
            <form onSubmit={handleSearchSubmit} className="relative p-3.5 border-b border-gray-100 bg-[#FAF8F5]">
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white text-[#3D291C] placeholder-[#9c897a] rounded-xl border border-[#ded9ce] focus:outline-none focus:ring-1.5 focus:ring-[#87A96B]"
              />
              <button
                type="submit"
                className="absolute right-6 top-6 text-[#7A6453] hover:text-[#5A3E2B] cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Menu Options List matching screenshot structure */}
            <div className="divide-y divide-gray-100 text-xs font-bold tracking-wider uppercase">
              
              {/* 1. HOME */}
              <button
                onClick={() => handleNav('home')}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  currentView === 'home'
                    ? 'text-[#5A3E2B] bg-[#87A96B]/10 font-extrabold'
                    : 'text-[#3D291C] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>HOME</span>
                {currentView === 'home' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5851F]" />
                )}
              </button>

              {/* 2. PRIVACY POLICY */}
              <button
                onClick={() => handleNav('privacy')}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  currentView === 'privacy'
                    ? 'text-[#5A3E2B] bg-[#87A96B]/10 font-extrabold'
                    : 'text-[#3D291C] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>PRIVACY POLICY</span>
                {currentView === 'privacy' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5851F]" />
                )}
              </button>

              {/* 3. REFUND AND RETURNS POLICY */}
              <button
                onClick={() => handleNav('refund')}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  currentView === 'refund'
                    ? 'text-[#5A3E2B] bg-[#87A96B]/10 font-extrabold'
                    : 'text-[#3D291C] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>REFUND AND RETURNS POLICY</span>
                {currentView === 'refund' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5851F]" />
                )}
              </button>

              {/* 4. CONTACT US */}
              <button
                onClick={() => handleNav('contact')}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  currentView === 'contact'
                    ? 'text-[#5A3E2B] bg-[#87A96B]/10 font-extrabold'
                    : 'text-[#3D291C] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>CONTACT US</span>
                {currentView === 'contact' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5851F]" />
                )}
              </button>

              {/* 5. TERMS AND CONDITIONS */}
              <button
                onClick={() => handleNav('terms')}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  currentView === 'terms'
                    ? 'text-[#5A3E2B] bg-[#87A96B]/10 font-extrabold'
                    : 'text-[#3D291C] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>TERMS AND CONDITIONS</span>
                {currentView === 'terms' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5851F]" />
                )}
              </button>

              {/* 6. ABOUT US */}
              <button
                onClick={() => handleNav('about')}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  currentView === 'about'
                    ? 'text-[#5A3E2B] bg-[#87A96B]/10 font-extrabold'
                    : 'text-[#3D291C] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>ABOUT US</span>
                {currentView === 'about' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5851F]" />
                )}
              </button>

              {/* 7. LOGIN / REGISTER or ACCOUNT STATUS */}
              {user ? (
                <div className="p-3.5 bg-[#FAF8F5] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="w-4 h-4 text-[#87A96B] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#5A3E2B] truncate">{user.full_name}</p>
                      <p className="text-[10px] text-gray-500 font-normal truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>EXIT</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full px-5 py-3.5 flex items-center gap-2.5 text-left text-[#3D291C] hover:text-[#5A3E2B] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#87A96B]" />
                  <span>LOGIN / REGISTER</span>
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};
