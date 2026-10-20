import React from 'react';
import { Layers, ShieldCheck, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { Bundle, Product } from '../types/index.ts';
import { BundleCard } from '../components/BundleCard.tsx';

interface BundlesViewProps {
  bundles: (Bundle & { included_products?: Product[]; regular_sum?: number })[];
  onSelectBundle: (b: Bundle) => void;
  onBuyBundle: (b: Bundle) => void;
  userOwnedProductIds: string[];
}

export const BundlesView: React.FC<BundlesViewProps> = ({
  bundles,
  onSelectBundle,
  onBuyBundle,
  userOwnedProductIds,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-semibold mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>Curated Digital Bundles · Save up to 59%</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Bundle A, Bundle B & Packages
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          One-time digital product purchases. Every bundle grants permanent lifetime access to all included guides, templates, and video lessons with zero recurring billing.
        </p>
      </div>

      {/* Bundle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {bundles.map((bundle) => {
          const isAllOwned = bundle.included_product_ids?.every((pid) =>
            userOwnedProductIds.includes(pid)
          );
          return (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onSelect={onSelectBundle}
              onBuyNow={onBuyBundle}
              isAllOwned={isAllOwned}
            />
          );
        })}
      </div>

      {/* Bundle Policy Notice */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
        <div className="flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">No Subscriptions</span>
            <span>Pay once, own perpetually. Zero automatic renewals or surprise charges.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Full Included Assets</span>
            <span>Instant delivery of every individual product listed inside the bundle.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block">Verified Signatures</span>
            <span>Cryptographically checked server-side authorization upon checkout.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
