import React, { useState } from 'react';
import { ExternalLink, Info, X, Sparkles, ShieldCheck } from 'lucide-react';
import { AdSettings } from '../types/index.ts';

interface AdBannerProps {
  position: 'header' | 'in_feed' | 'footer';
  adsSettings?: AdSettings;
  isVipUser?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  position,
  adsSettings,
  isVipUser = false,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (dismissed || !adsSettings || !adsSettings.master_ads_enabled) {
    return null;
  }

  // VIP Ad-Free check
  if (isVipUser && adsSettings.ad_free_for_vip) {
    return null;
  }

  // Check specific slot enable status
  const slotConfig =
    position === 'header'
      ? adsSettings.header_ad
      : position === 'in_feed'
      ? adsSettings.in_feed_ad
      : adsSettings.footer_ad;

  if (!slotConfig?.enabled) {
    return null;
  }

  // 1. Custom Raw HTML snippet for in-feed or footer
  const customHtml =
    position === 'in_feed'
      ? adsSettings.custom_infeed_html
      : position === 'footer'
      ? adsSettings.custom_footer_html
      : '';

  if (customHtml && customHtml.trim().length > 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 my-4 select-none">
        <div className="p-3 bg-white/80 rounded-2xl border border-[#e2dfd5] shadow-2xs relative">
          <div className="flex items-center justify-between text-[10px] text-[#718277] mb-2 px-1">
            <span className="font-mono uppercase tracking-wider">
              {adsSettings.custom_network_name || 'Sponsored Partner'}
            </span>
            <button
              onClick={() => setDismissed(true)}
              className="hover:text-black transition-colors"
              title="Dismiss ad"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div dangerouslySetInnerHTML={{ __html: customHtml }} />
        </div>
      </div>
    );
  }

  // 2. Sponsor / Affiliate Banner
  if (adsSettings.sponsor_ad_enabled && adsSettings.sponsor_title) {
    return (
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 select-none ${
          position === 'header' ? 'mt-3 mb-1' : position === 'in_feed' ? 'my-6' : 'my-4'
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#172c20] via-[#1f3f2f] to-[#12241a] text-white p-4 sm:p-5 shadow-sm border border-[#2e5741] transition-all hover:border-[#427b5c]">
          {/* Top Label */}
          <div className="flex items-center justify-between text-[10px] text-emerald-300 font-mono tracking-widest uppercase mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SPONSORED PARTNER</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="hover:text-white transition-colors"
                title="Ad Transparency"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="hover:text-white transition-colors cursor-pointer"
                title="Hide this ad"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ad Transparency Note */}
          {showInfo && (
            <div className="mb-3 p-2.5 bg-black/40 rounded-xl text-[11px] text-emerald-100 border border-emerald-500/30">
              Verified partner promotion. Supports SmartBanao digital guide development without increasing retail prices.
            </div>
          )}

          {/* Content Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {adsSettings.sponsor_banner_img && (
                <img
                  src={adsSettings.sponsor_banner_img}
                  alt={adsSettings.sponsor_title}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-emerald-500/30 shadow-xs"
                />
              )}
              <div className="min-w-0 space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-white truncate">
                  {adsSettings.sponsor_title}
                </h4>
                <p className="text-xs text-emerald-100/80 line-clamp-2 leading-relaxed">
                  {adsSettings.sponsor_subtitle}
                </p>
              </div>
            </div>

            <a
              href={adsSettings.sponsor_link_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#14261d] hover:bg-emerald-50 text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-center"
            >
              <span>{adsSettings.sponsor_cta || 'Learn More'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. Google AdSense Responsive Unit Preview
  if (adsSettings.adsense_enabled) {
    return (
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 select-none ${
          position === 'header' ? 'mt-3 mb-1' : position === 'in_feed' ? 'my-6' : 'my-4'
        }`}
      >
        <div className="p-3 sm:p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-[#dedad0] shadow-2xs relative text-center">
          <div className="flex items-center justify-between text-[10px] text-[#718277] mb-2 px-1">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>GOOGLE ADSENSE · SLOT #{slotConfig.slot_id || '928401'}</span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-[#88998e] hover:text-[#112318] transition-colors cursor-pointer"
              title="Close Ad"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-5 px-4 bg-[#faf9f5] rounded-xl border border-dashed border-[#dcd8cb] flex flex-col items-center justify-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-[#5a6c61] uppercase font-bold">
              Google AdSense Placement ({position})
            </span>
            <p className="text-xs text-[#2b3d32] font-semibold">
              Live Responsive Ad Slot Active · Publisher: {adsSettings.adsense_client_id}
            </p>
            <span className="text-[10px] text-[#819286]">
              Ads are served securely via Google Ad Network protocol
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
