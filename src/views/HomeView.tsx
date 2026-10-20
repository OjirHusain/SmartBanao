import React, { useState } from 'react';
import {
  ArrowUpRight,
  Plus,
  Minus,
  Search,
  Check,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Bundle, Product, Review } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { BundleCard } from '../components/BundleCard.tsx';
import { LookInsideModal } from '../components/LookInsideModal.tsx';
import { BrandLogo } from '../components/BrandLogo.tsx';
import { AdBanner } from '../components/AdBanner.tsx';
import { AdSettings } from '../types/index.ts';

interface HomeViewProps {
  products: Product[];
  bundles: (Bundle & { included_products?: Product[]; regular_sum?: number })[];
  reviews: Review[];
  onSelectProduct: (p: Product) => void;
  onBuyProduct: (p: Product) => void;
  onSelectBundle: (b: Bundle) => void;
  onBuyBundle: (b: Bundle) => void;
  onNavigate: (view: string) => void;
  userOwnedProductIds: string[];
  adsSettings?: AdSettings;
  isVipUser?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  bundles,
  reviews,
  onSelectProduct,
  onBuyProduct,
  onSelectBundle,
  onBuyBundle,
  onNavigate,
  userOwnedProductIds,
  adsSettings,
  isVipUser,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'ebook' && p.product_type !== 'ebook') return false;
    if (activeTab === 'template' && p.product_type !== 'template' && p.product_type !== 'pdf') return false;
    if (activeTab === 'course' && p.product_type !== 'video_course') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const faqs = [
    {
      q: 'Are these one-time purchases?',
      a: 'Yes, 100%. Every product and bundle is a single one-time payment. There are no recurring subscriptions, surprise renewals, or memberships. Pay once, own it forever.',
    },
    {
      q: 'How will I receive my digital product?',
      a: 'Immediately after your payment is confirmed, your products appear in your personal "My Library" dashboard. You can download the PDF guides, templates, and stream the video workshops instantly.',
    },
    {
      q: 'Can I access products on my phone?',
      a: 'Yes. All PDFs, e-books, and video courses are mobile-responsive and formatted to read cleanly on iPhone, Android phones, iPads, tablets, and desktop computers.',
    },
    {
      q: 'Can I get a refund?',
      a: 'Because digital products are delivered immediately with permanent offline files, we do not offer unconditional refunds. However, if you experience any technical access issues, our support team will help you immediately.',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-[#faf9f5] text-[#16221c]">
      {/* ==============================================================
          1. HERO SECTION (Identical to Screenshot with Enhanced Beauty)
          ============================================================== */}
      <section className="pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
        {/* Kicker */}
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#54685c] mb-3">
          <span className="w-2 h-2 rounded-full bg-[#3c7155] animate-pulse" />
          <span>Small steps. Real progress.</span>
        </div>

        {/* Big Headline with artistic underline curve */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#14231b] leading-[1.05]">
          Make your next<br />
          chapter{' '}
          <span className="text-[#25523d] relative inline-block">
            happen.
            <svg
              className="absolute -bottom-1.5 left-0 w-full h-2.5 text-[#3d7a5b]/40 pointer-events-none"
              viewBox="0 0 100 8"
              preserveAspectRatio="none"
            >
              <path
                d="M0,5 Q50,0 100,5"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#5c6d62] max-w-xl leading-relaxed">
          Thoughtfully made digital guides, practical courses and creator resources to help you learn a skill, build something useful, and keep moving.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => scrollToSection('shelf-section')}
            className="px-5 py-3 rounded-full bg-[#1b3428] hover:bg-[#12261d] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs hover:shadow-md hover:scale-[1.02]"
          >
            <span>Explore the collection</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToSection('bundles-section')}
            className="px-5 py-3 rounded-full bg-white hover:bg-[#f2f1eb] text-[#1b3428] border border-[#dedad0] text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs"
          >
            See the bundles
          </button>
        </div>

        {/* Social Proof Line */}
        <div className="mt-7 flex items-center gap-3 text-xs text-[#526358]">
          <div className="flex -space-x-1.5 overflow-hidden">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#e3d7bf] text-[10px] font-bold text-[#5c4d32] border border-white shadow-2xs">
              AK
            </span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#d6decb] text-[10px] font-bold text-[#3d502f] border border-white shadow-2xs">
              SM
            </span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#dfd3cb] text-[10px] font-bold text-[#5c4032] border border-white shadow-2xs">
              RJ
            </span>
          </div>
          <span className="text-[11px] sm:text-xs">
            Made for curious people who like to <strong className="font-semibold text-[#14231b]">get things done.</strong>
          </span>
        </div>

        {/* Hero Showcase Card (Tactile Realistic Editorial Book) */}
        <div className="mt-8 rounded-3xl bg-gradient-to-b from-[#eeebe3] to-[#e4e0d4] p-4 sm:p-7 relative overflow-hidden border border-[#dedad0] shadow-sm">
          {/* Inner Book / Guide Mockup */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 max-w-lg mx-auto shadow-[0_12px_40px_rgba(20,35,27,0.08)] border border-[#e5e2d6] relative">
            {/* Book spine gradient on left */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/5 to-transparent rounded-l-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-6 border-b border-[#f3f1ea]">
              <BrandLogo size="sm" />
              <div className="text-right">
                <p className="text-[11px] font-bold text-[#14231b] flex items-center justify-end gap-1">
                  <Check className="w-3 h-3 text-[#3c7155]" />
                  <span>Pay once. Keep it.</span>
                </p>
                <p className="text-[10px] text-[#718277]">One-time purchase · Instant access</p>
              </div>
            </div>

            <div className="py-6 space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#3c7155] font-mono">
                A BETTER WAY TO BEGIN
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight leading-snug">
                Ideas into<br />something real.
              </h3>
              <p className="text-xs sm:text-sm text-[#5d6e63] max-w-sm pt-1 leading-relaxed">
                A practical little guide for your next big move. Clear steps, useful prompts, no unnecessary noise.
              </p>
            </div>

            {/* Overlapping organic circles visual */}
            <div className="pt-4 flex items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#dbe4df] shadow-inner" />
              <div className="w-20 h-20 -ml-8 rounded-full bg-[#234b38] shadow-md" />
              <div className="w-12 h-12 -ml-6 rounded-full bg-[#8ba89a] shadow-xs" />
            </div>

            {/* Floating pill badge */}
            <div className="mt-4 p-2.5 rounded-xl bg-[#faf9f5] border border-[#e8e6dc] inline-flex flex-col text-[10px] shadow-2xs">
              <span className="font-bold text-[#14231b]">Made to use, not just save.</span>
              <span className="text-[#65776c] flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3c7155]" />
                Practical, step-by-step resources
              </span>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges under Hero */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-xs font-bold text-[#14231b]">Good resources should feel simple.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-[#44564c]">
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#dedad0] shadow-2xs hover:shadow-xs transition-shadow">
              🪄 Clear, practical lessons
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#dedad0] shadow-2xs hover:shadow-xs transition-shadow">
              ⬇️ Digital access
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#dedad0] shadow-2xs hover:shadow-xs transition-shadow">
              ✔️ One-time payment
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#dedad0] shadow-2xs hover:shadow-xs transition-shadow">
              🤍 Made for real life
            </span>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. BUNDLES SECTION (Plan A & Plan B)
          ============================================================== */}
      <section id="bundles-section" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#54685c]">
            <span className="w-2 h-2 rounded-full bg-[#3c7155]" />
            <span>Start with a little more</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">
            Bundles that make sense.
          </h2>
          <p className="text-xs sm:text-sm text-[#5c6d62] max-w-xl">
            Pick a set that matches where you are right now. One payment, a focused collection, and room to make it your own.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        <p className="mt-3 text-[11px] text-[#7d8e83]">
          Sample bundle pricing for layout preview. Replace with your confirmed product details before publishing.
        </p>
      </section>

      {/* ==============================================================
          3. DIGITAL SHELF / CATALOG (2 Per Row on Mobile)
          ============================================================== */}
      <section id="shelf-section" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
        <div className="space-y-1 mb-5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#54685c]">
            <span className="w-2 h-2 rounded-full bg-[#3c7155]" />
            <span>The Digital Shelf</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">
            Find your next useful thing.
          </h2>
          <p className="text-xs sm:text-sm text-[#5c6d62] max-w-xl">
            Guides, templates and learning resources, designed to be clear, considered and easy to put to work.
          </p>
        </div>

        {/* Search & Filter pills matching screenshot */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8b9c91] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search guides, templates, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = searchQuery.trim().toLowerCase();
                    if (q === 'admin' || q === 'admin.php' || q === '/admin' || q.includes('admin')) {
                      onNavigate('admin-portal');
                    }
                  }
                }}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white rounded-full border border-[#dedad0] text-[#14231b] placeholder-[#8b9c91] focus:outline-none focus:ring-1 focus:ring-[#1b3428] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#8b9c91] hover:text-[#14231b]"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-full transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#1b3428] text-white shadow-xs'
                  : 'bg-white text-[#44564c] border border-[#dedad0] hover:bg-[#f2f1eb]'
              }`}
            >
              Everything
            </button>
          </div>

          {/* Discreet admin shortcut hint ONLY if user explicitly types "admin" */}
          {searchQuery.toLowerCase().includes('admin') && (
            <div
              onClick={() => onNavigate('admin-portal')}
              className="p-3 bg-slate-900 text-cyan-300 rounded-2xl border border-slate-800 text-xs flex items-center justify-between cursor-pointer hover:bg-slate-850 shadow-md animate-in fade-in duration-150"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono font-bold text-white">🔒 Administrator Security Gateway Detected</span>
              </div>
              <span className="text-[11px] underline text-cyan-400 font-semibold">Open Login Portal →</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {[
              { id: 'ebook', label: 'eBooks' },
              { id: 'template', label: 'Templates' },
              { id: 'course', label: 'Courses' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(activeTab === tab.id ? 'all' : tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1b3428] text-white border-[#1b3428] shadow-2xs'
                    : 'bg-white text-[#56685c] border-[#dedad0] hover:bg-[#f2f1eb]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2 Product Cards per row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {filteredProducts.map((product) => {
            const isOwned = userOwnedProductIds.includes(product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onBuyNow={onBuyProduct}
                onLookInside={(p) => setPreviewProduct(p)}
                isOwned={isOwned}
              />
            );
          })}
        </div>

        <p className="mt-4 text-[11px] text-[#7d8e83]">
          The titles, artwork and prices above are design placeholders. Add only products you actually sell; do not publish fabricated claims.
        </p>
      </section>

      {/* Responsive In-Feed Ad Banner (Admin Controlled) */}
      <AdBanner position="in_feed" adsSettings={adsSettings} isVipUser={isVipUser} />

      {/* ==============================================================
          4. NOTE FROM THE COMMUNITY (Customer Feedback)
          ============================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#54685c]">
            <span className="w-2 h-2 rounded-full bg-[#3c7155]" />
            <span>A note from the community</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">
            Good work speaks quietly.
          </h2>
          <p className="text-xs sm:text-sm text-[#5c6d62] max-w-xl">
            We want this space to earn trust through useful products and honest feedback—not inflated promises.
          </p>
        </div>

        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white rounded-2xl border border-[#dedad0] shadow-2xs space-y-3 hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-1 text-[#224b38]">
                {'★★★★★'}
              </div>
              <p className="text-xs sm:text-sm text-[#27382f] leading-relaxed font-normal">
                "{rev.comment}"
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-full bg-[#e3e0d5] text-[#44564c] font-bold text-xs flex items-center justify-center">
                  {rev.author_name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#14231b]">{rev.author_name}</p>
                  <p className="text-[10px] text-[#7d8e83]">{rev.author_role || 'Replace with a verified customer'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[11px] text-[#7d8e83]">
          These are illustrative review placeholders, not real testimonials. Replace them with genuine customer feedback before launch.
        </p>
      </section>

      {/* ==============================================================
          5. FAQS ACCORDION
          ============================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#54685c]">
            <span className="w-2 h-2 rounded-full bg-[#3c7155]" />
            <span>Before you begin</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">
            A few things worth knowing.
          </h2>
          <p className="text-xs sm:text-sm text-[#5c6d62] max-w-xl">
            Clear answers, no fine-print surprises. If something is still unclear, contact us before purchasing.
          </p>
        </div>

        <div className="divide-y divide-[#dedad0] border-y border-[#dedad0]">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left py-1 group"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#14231b] group-hover:text-[#234c37] transition-colors">
                    {faq.q}
                  </span>
                  <span className="text-base text-[#56685c] group-hover:text-[#14231b] transition-colors">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-[#526358] leading-relaxed pr-6 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Look Inside Modal */}
      {previewProduct && (
        <LookInsideModal
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
          onBuyNow={onBuyProduct}
          isOwned={userOwnedProductIds.includes(previewProduct.id)}
        />
      )}
    </div>
  );
};
