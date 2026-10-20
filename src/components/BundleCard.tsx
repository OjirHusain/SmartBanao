import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Bundle, Product } from '../types/index.ts';

interface BundleCardProps {
  bundle: Bundle & { included_products?: Product[]; regular_sum?: number };
  onSelect: (bundle: Bundle) => void;
  onBuyNow: (bundle: Bundle) => void;
  isAllOwned?: boolean;
}

export const BundleCard: React.FC<BundleCardProps> = ({
  bundle,
  onSelect,
  onBuyNow,
  isAllOwned = false,
}) => {
  const isPlanB = bundle.slug.includes('plan-b') || bundle.slug.includes('ultimate');

  return (
    <div
      className={`rounded-3xl p-5 sm:p-7 relative overflow-hidden flex flex-col justify-between transition-all duration-200 border ${
        isPlanB
          ? 'bg-[#1b3428] text-white border-[#274838] shadow-sm'
          : 'bg-[#ebe8e0] text-[#16251d] border-[#dedad0] shadow-2xs'
      }`}
    >
      <div>
        {/* Top Tag matching screenshot */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
              isPlanB
                ? 'bg-[#274838]/80 text-[#b5cebf] border-[#375e4b]'
                : 'bg-white/80 text-[#54685c] border-[#dcd8cb]'
            }`}
          >
            {isPlanB ? 'MORE ROOM TO GROW' : 'THE ESSENTIALS'}
          </span>
        </div>

        {/* Title & Description */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8 space-y-2">
            <h3
              onClick={() => onSelect(bundle)}
              className="text-xl sm:text-2xl font-extrabold tracking-tight cursor-pointer hover:opacity-90 transition-opacity"
            >
              {bundle.title}
            </h3>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isPlanB ? 'text-[#a2beae]' : 'text-[#56685c]'
              }`}
            >
              {bundle.description}
            </p>
          </div>

          {/* Right graphic showing stylized stacked cards matching screenshot */}
          <div className="sm:col-span-4 flex justify-end items-center pointer-events-none select-none">
            <div className="relative w-28 h-24 sm:w-32 sm:h-28">
              {/* Back card */}
              <div
                className={`absolute right-1 top-1 w-20 h-24 rounded-lg p-2 text-[9px] font-bold uppercase tracking-wider transform rotate-6 border shadow-sm ${
                  isPlanB
                    ? 'bg-[#294c3c] text-[#93b3a1] border-[#37614d]'
                    : 'bg-[#d8d4c7] text-[#69796e] border-[#c9c4b5]'
                }`}
              >
                <span>{isPlanB ? 'GO FURTHER' : 'THE WORKBOOK'}</span>
              </div>
              {/* Front card */}
              <div
                className={`absolute right-5 top-3 w-20 h-24 rounded-lg p-2 text-[9px] font-bold uppercase tracking-wider transform -rotate-3 border shadow-md ${
                  isPlanB
                    ? 'bg-[#315745] text-white border-[#427059]'
                    : 'bg-[#f7f5ed] text-[#1b3428] border-[#ded9ca]'
                }`}
              >
                <span>{isPlanB ? 'THE PLAYBOOK' : 'START HERE'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & CTA Button */}
      <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight">
            ₹{bundle.price}
          </span>
          {bundle.original_price && (
            <span
              className={`text-sm line-through font-mono ${
                isPlanB ? 'text-[#6c8f7b]' : 'text-[#909e94]'
              }`}
            >
              ₹{bundle.original_price}
            </span>
          )}
        </div>

        <button
          onClick={() => onBuyNow(bundle)}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-sm ${
            isPlanB
              ? 'bg-[#c3d9a3] hover:bg-[#d4eab5] text-[#1a382b]'
              : 'bg-[#1b3428] hover:bg-[#12261d] text-white'
          }`}
          aria-label={`Buy ${bundle.title}`}
        >
          {isAllOwned ? (
            <Check className="w-5 h-5 text-emerald-400" />
          ) : (
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>
      </div>
    </div>
  );
};
