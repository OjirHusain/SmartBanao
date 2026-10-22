import React from 'react';
import { BrandLogo } from './BrandLogo.tsx';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2B1D14] text-[#d6cdb7] py-8 sm:py-10 border-t border-[#442f21] select-none font-sans">
      <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 space-y-5 text-xs text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="focus-visible:outline-none cursor-pointer"
          >
            <BrandLogo size="md" light showTagline />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#c7beaa]">
            <button
              onClick={() => onNavigate('refund')}
              className="hover:text-[#87A96B] transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <span className="text-[#87A96B]/50">·</span>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-[#87A96B] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-[#87A96B]/50">·</span>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-[#87A96B] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-[#87A96B]/50">·</span>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-[#87A96B] transition-colors cursor-pointer"
            >
              Support
            </button>
          </div>
        </div>

        <div className="text-[10px] text-[#9c897a] pt-4 border-t border-[#3d2a1d]">
          <p>© {new Date().getFullYear()} SmartBanao. All rights reserved.</p>
          <p className="mt-0.5 text-[#87A96B]/90 font-medium">Ultra-Premium Digital Library · Pay Once, Keep Forever</p>
        </div>
      </div>
    </footer>
  );
};
