import React from 'react';
import {
  ArrowLeft,
  CheckCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Lock,
  Zap,
} from 'lucide-react';
import { Bundle, Product } from '../types/index.ts';

interface BundleDetailViewProps {
  bundle: Bundle & { included_products?: Product[]; regular_sum?: number };
  onBack: () => void;
  onBuyNow: (bundle: Bundle) => void;
  onSelectProduct: (product: Product) => void;
  isAllOwned: boolean;
}

export const BundleDetailView: React.FC<BundleDetailViewProps> = ({
  bundle,
  onBack,
  onBuyNow,
  onSelectProduct,
  isAllOwned,
}) => {
  const savings = bundle.original_price
    ? bundle.original_price - bundle.price
    : bundle.regular_sum
    ? bundle.regular_sum - bundle.price
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Bundles</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Bundle Info & Itemized Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950 text-white shadow-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Consolidated Digital Bundle</span>
              {bundle.badge && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-300 font-bold">{bundle.badge}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {bundle.title}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {bundle.description}
            </p>

            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div>
                <span className="text-slate-500 block">Pricing Model</span>
                <span className="text-white font-semibold">100% One-Time Purchase</span>
              </div>
              <div className="h-6 w-px bg-slate-800 hidden sm:block" />
              <div>
                <span className="text-slate-500 block">Deliverables</span>
                <span className="text-white font-semibold">
                  {bundle.included_products?.length || bundle.included_product_ids.length} Digital Assets
                </span>
              </div>
              <div className="h-6 w-px bg-slate-800 hidden sm:block" />
              <div>
                <span className="text-slate-500 block">License Type</span>
                <span className="text-emerald-400 font-semibold">Perpetual Lifetime Access</span>
              </div>
            </div>
          </div>

          {/* Itemized Included Products */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Everything Included in This Bundle
            </h3>

            <div className="space-y-3">
              {bundle.included_products && bundle.included_products.length > 0 ? (
                bundle.included_products.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                          {item.product_type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {item.short_description || item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="text-xs font-mono font-bold text-slate-700">
                        ₹{item.price} Value
                      </span>
                      <button
                        onClick={() => onSelectProduct(item)}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700 underline"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500">
                  Products are being loaded...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Pricing & Action */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Bundle Package Deal
              </span>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  ₹{bundle.price}
                </span>
                {(bundle.original_price || bundle.regular_sum) && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    ₹{bundle.original_price || bundle.regular_sum}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-xs font-bold text-emerald-600 mt-1">
                  You save ₹{savings} with this package!
                </p>
              )}
            </div>

            <button
              onClick={() => onBuyNow(bundle)}
              className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-sky-400" />
              <span>{isAllOwned ? 'You Own This Bundle' : `Buy Bundle for ₹${bundle.price}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant access granted to all bundled products</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>One-time purchase · No recurring subscriptions</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Cryptographically verified payment & delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
