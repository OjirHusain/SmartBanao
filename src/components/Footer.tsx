import React from 'react';
import { BrandLogo } from './BrandLogo.tsx';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0b1510] text-[#a4b8ab] py-10 sm:py-14 border-t border-[#182d22] select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-left focus-visible:outline-none cursor-pointer"
          >
            <BrandLogo size="md" light showTagline />
          </button>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-[#8ca394]">
            <button
              onClick={() => onNavigate('products')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Collection
            </button>
            <button
              onClick={() => onNavigate('bundles')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Bundles
            </button>
            <button
              onClick={() => onNavigate('refund')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#586c60] pt-5 border-t border-[#182d22]">
          <p>© {new Date().getFullYear()} SmartBanao. All rights reserved.</p>
          <p>Ultra-Premium Digital Products · One-Time Access · No Subscriptions</p>
        </div>
      </div>
    </footer>
  );
};
