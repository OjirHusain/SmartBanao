import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Eye,
  Check,
  Plus,
  Star,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Quote,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../types/index.ts';
import { LookInsideModal } from '../components/LookInsideModal.tsx';

interface HomeViewProps {
  products: Product[];
  bundles?: any[];
  reviews?: any[];
  onSelectProduct: (p: Product) => void;
  onBuyProduct: (p: Product) => void;
  onSelectBundle?: (b: any) => void;
  onBuyBundle?: (b: any) => void;
  onNavigate?: (view: string) => void;
  userOwnedProductIds: string[];
  adsSettings?: any;
  isVipUser?: boolean;
}

// Wisdom quotes by Acharya Prashant matching the 5 carousel dots from Screenshot 908
const ACHARYA_QUOTES = [
  {
    quote:
      'व्यवसाय तब ही सफल होता है जब वह सिर्फ़ कमाई नहीं, सेवा का माध्यम बन जाए। जब तुम यह समझ पाओ कि ग्राहक कोई ज़रूरतमंद आत्मा है',
    highlight: 'सेवा ही सफलता की सच्ची नींव है',
  },
  {
    quote:
      'सच्ची शिक्षा वह है जो तुम्हें आत्मनिर्भर बनाए और तुम्हारी सोच को स्वतंत्र करे, न कि केवल डिग्री का बोझ थमा दे।',
    highlight: 'आत्मनिर्भरता और वास्तविक कौशल',
  },
  {
    quote:
      'जब तुम कुछ ऐसा बनाते हो जो किसी के जीवन को सरल और सार्थक बनाए, तो वह काम कभी व्यर्थ नहीं जाता।',
    highlight: 'मूल्य सृजन और सार्थक समाधान',
  },
  {
    quote:
      'दूसरों की नकल करके सफलता नहीं मिलती। अपनी समझ, अपने विवेक और अपनी सच्चाई पर टिके रहो।',
    highlight: 'मौलिकता में ही अनंत शक्ति है',
  },
  {
    quote:
      'युवाओं को नौकरी मांगने वाला नहीं, बल्कि मूल्य सृजन करने वाला और आत्मनिर्भर समाधानकर्ता बनना चाहिए।',
    highlight: 'स्वतंत्र सोच और कर्मनिष्ठा',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onBuyProduct,
  onSelectProduct,
  userOwnedProductIds,
}) => {
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isQuoteFading, setIsQuoteFading] = useState(false);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  // Auto-slide quotes carousel with smooth fade transition
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextQuote();
    }, 7000);
    return () => clearInterval(timer);
  }, [activeQuoteIndex]);

  const handleNextQuote = (targetIndex?: number) => {
    setIsQuoteFading(true);
    setTimeout(() => {
      if (typeof targetIndex === 'number') {
        setActiveQuoteIndex(targetIndex);
      } else {
        setActiveQuoteIndex((prev) => (prev + 1) % ACHARYA_QUOTES.length);
      }
      setIsQuoteFading(false);
    }, 250);
  };

  // Trigger quick tactile spring on purchase
  const handleBuyWithAnimation = (product: Product) => {
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 600);
    onBuyProduct(product);
  };

  // The two core products from Screenshot 637
  const launchKitProduct = products.find(
    (p) => p.slug === 'digital-product-launch-kit' || p.id === 'prod-launch-kit'
  ) || {
    id: 'prod-launch-kit',
    title: 'Digital Product Launch Kit',
    slug: 'digital-product-launch-kit',
    description: 'Keep the essential launch tasks together in one tidy checklist.',
    short_description: 'Keep the essential launch tasks together in one tidy checklist.',
    product_type: 'pdf',
    price: 89,
    original_price: 349,
    status: 'published',
  } as Product;

  const ideaWorkbookProduct = products.find(
    (p) => p.slug === 'idea-to-action-workbook' || p.id === 'prod-idea-to-action-workbook'
  ) || {
    id: 'prod-idea-to-action-workbook',
    title: 'The Idea-to-Action Workbook',
    slug: 'idea-to-action-workbook',
    description: 'Prompts to sort your thoughts and turn one idea into a plan.',
    short_description: 'Prompts to sort your thoughts and turn one idea into a plan.',
    product_type: 'pdf',
    price: 69,
    original_price: 299,
    status: 'published',
  } as Product;

  const scrollToShelf = () => {
    document.getElementById('section-products-637')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen py-4 sm:py-7 px-3 sm:px-4 md:px-6 flex flex-col items-center select-none font-sans">
      
      {/* 
        NO TOGGLE SWITCHER BOX:
        Rendered as pure, 100% authentic, living website directly in production mode.
      */}

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto space-y-5 sm:space-y-6 animate-card-entrance">

        {/* =========================================================================
            1. TOP HERO BANNER: (IMG 459)
            "A GOOD PLACE TO BEGIN" / "Your next big idea starts right here."
            Custom Editorial Palette: Walnut Brown (#5A3E2B), Sage Green (#87A96B), Amber Glow (#D5851F)
            ========================================================================= */}
        <section
          onClick={scrollToShelf}
          className="group relative w-full rounded-[26px] sm:rounded-[30px] p-5 sm:p-7 overflow-hidden shadow-[0_16px_45px_rgba(90,62,43,0.18)] border border-[#5A3E2B]/40 bg-gradient-to-br from-[#332216] via-[#483121] to-[#243522] text-white cursor-pointer transition-all duration-500 hover:shadow-[0_22px_55px_rgba(90,62,43,0.26)] hover:-translate-y-0.5"
        >
          {/* Concentric Organic Curved Ripples matching 459 with Sage and Amber Glow */}
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full border border-[#87A96B]/15 pointer-events-none group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full border border-[#D5851F]/20 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute left-10 -bottom-4 w-44 h-44 rounded-full bg-[#87A96B]/15 blur-2xl pointer-events-none" />
          <div className="absolute right-10 -top-8 w-36 h-36 rounded-full bg-[#D5851F]/10 blur-xl pointer-events-none" />

          {/* Ambient luminous sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            {/* Left Column: Text Content */}
            <div className="space-y-2.5 sm:space-y-3 flex-1 min-w-0 pr-1">
              {/* Kicker badge with Amber Glow */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D5851F] animate-pulse shadow-[0_0_8px_rgba(213,133,31,0.8)]" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#D5851F] font-mono">
                  A GOOD PLACE TO BEGIN
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#FAF8F5] leading-[1.12]">
                Your next big idea<br />
                <span className="text-[#87A96B]">starts right here.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#ddd7cc] leading-relaxed max-w-xs font-normal">
                Your digital bookshelf is ready for the things you choose to learn.
              </p>

              {/* Action Pill with Amber Glow Accent */}
              <div className="pt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D5851F] hover:bg-[#bd7417] text-white text-[11px] font-bold shadow-sm transition-all group-hover:scale-105 active:scale-95 cursor-pointer">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>

            {/* Right Column: 3D Animated Floating Booklet (SMART BANAO VOL. 01) in Sage Green & Walnut Brown */}
            <div className="shrink-0 w-24 sm:w-32 md:w-36 animate-float-slow">
              <div className="relative aspect-[3/4] rounded-2xl bg-[#87A96B] text-[#2F2116] p-3 sm:p-4 shadow-[0_18px_32px_rgba(0,0,0,0.4)] border border-[#a2c287] flex flex-col justify-between overflow-hidden transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                {/* Book Spine Shading */}
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/25 to-transparent" />

                {/* Booklet Header */}
                <div className="relative z-10 pl-1">
                  <p className="text-[8px] sm:text-[9px] font-black tracking-widest font-mono uppercase text-[#3D291C]">
                    SMART BANAO · VOL. 01
                  </p>
                </div>

                {/* Booklet Title */}
                <div className="relative z-10 pl-1 space-y-1">
                  <p className="text-[11px] sm:text-[13px] font-extrabold leading-tight tracking-tight text-[#2B1D14]">
                    Make room for growth.
                  </p>
                  <div className="w-6 h-1 rounded-full bg-[#D5851F] mt-1" />
                </div>

                {/* Corner Fold */}
                <div className="absolute right-0 top-0 w-4 h-4 bg-black/15 rounded-bl-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. SECOND SECTION: TWO FEATURED PRODUCTS (IMG 637)
            - Digital Product Launch Kit (₹89)
            - The Idea-to-Action Workbook (₹69)
            Palette: Warm Terracotta & Sage Green with Walnut Brown Typography & Amber Accents
            ========================================================================= */}
        <section id="section-products-637" className="w-full space-y-3 scroll-mt-20">
          <div className="grid grid-cols-2 gap-3 sm:gap-4.5">
            
            {/* Product Card 1: Digital Product Launch Kit (Warm Terracotta / Peach) */}
            <div
              className={`group bg-white rounded-[24px] border border-[#e8e2d8] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                addedAnimationId === launchKitProduct.id ? 'ring-2 ring-[#5A3E2B] scale-[0.98]' : ''
              }`}
            >
              {/* Header Artwork Graphic: Clicking opens payment page directly */}
              <div
                onClick={() => handleBuyWithAnimation(launchKitProduct)}
                className="cursor-pointer p-4 sm:p-5 aspect-[1.12/1] bg-[#eddcd5] text-[#4a2e26] relative overflow-hidden flex flex-col justify-between select-none border-b border-[#dfcbbe] group-hover:brightness-[1.02] transition-all"
              >
                {/* Fluid Organic Curves */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#dfc5ba] opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute right-4 -bottom-4 w-20 h-20 rounded-full bg-[#d2b4a7] opacity-75 pointer-events-none group-hover:scale-105 transition-transform duration-500" />

                <div className="relative z-10 space-y-0.5">
                  <p className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase opacity-80 font-mono text-[#5A3E2B]">
                    A SMALL LAUNCH PLAN
                  </p>
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug text-[#3d241d]">
                    Ready when<br />you are.
                  </h3>
                </div>

                <div className="relative z-10 pt-2 flex items-center justify-between text-[8px] sm:text-[9px] font-mono tracking-wider uppercase opacity-90">
                  <span className="text-[#5A3E2B] font-bold">LAUNCH TOOLKIT</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#D5851F]/15 text-[#5A3E2B] font-extrabold border border-[#D5851F]/30">05 / PDF</span>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-medium text-[#7d7065] mb-1">
                    <span className="uppercase font-mono tracking-wider">CHECKLIST · PDF</span>
                    <span className="text-[#D5851F] font-bold">Quick start</span>
                  </div>

                  <h4
                    onClick={() => handleBuyWithAnimation(launchKitProduct)}
                    className="text-xs sm:text-sm font-bold text-[#5A3E2B] hover:text-[#87A96B] transition-colors cursor-pointer leading-tight line-clamp-1"
                  >
                    Digital Product Launch Kit
                  </h4>

                  <p className="text-[11px] text-[#716358] mt-1 leading-relaxed line-clamp-2">
                    Keep the essential launch tasks together in one tidy checklist.
                  </p>
                </div>

                {/* Pricing and Spring Plus Button */}
                <div className="pt-2 border-t border-[#f2ede4] flex items-center justify-between gap-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-black text-[#5A3E2B] font-mono">
                      ₹89
                    </span>
                    <span className="text-[11px] text-[#a49589] line-through font-mono">
                      ₹349
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyWithAnimation(launchKitProduct)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f4f0e9] hover:bg-[#5A3E2B] text-[#5A3E2B] hover:text-white border border-[#e4ddcf] flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-md hover:scale-110 active:scale-90 cursor-pointer"
                    aria-label="Buy Digital Product Launch Kit"
                  >
                    {userOwnedProductIds.includes(launchKitProduct.id) ? (
                      <Check className="w-4 h-4 text-[#87A96B] stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2: The Idea-to-Action Workbook (Sage Green Tint) */}
            <div
              className={`group bg-white rounded-[24px] border border-[#e8e2d8] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                addedAnimationId === ideaWorkbookProduct.id ? 'ring-2 ring-[#5A3E2B] scale-[0.98]' : ''
              }`}
            >
              {/* Header Artwork Graphic: Clicking opens payment page directly */}
              <div
                onClick={() => handleBuyWithAnimation(ideaWorkbookProduct)}
                className="cursor-pointer p-4 sm:p-5 aspect-[1.12/1] bg-[#dce8d5] text-[#2d3923] relative overflow-hidden flex flex-col justify-between select-none border-b border-[#c8dac0] group-hover:brightness-[1.02] transition-all"
              >
                {/* Fluid Organic Curves */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#c6dcbc] opacity-60 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute right-4 -bottom-4 w-20 h-20 rounded-full bg-[#b8d2ad] opacity-75 pointer-events-none group-hover:scale-105 transition-transform duration-500" />

                <div className="relative z-10 space-y-0.5">
                  <p className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase opacity-80 font-mono text-[#435934]">
                    A LITTLE CLARITY
                  </p>
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug text-[#2b3a20]">
                    Make the<br />idea clearer.
                  </h3>
                </div>

                <div className="relative z-10 pt-2 flex items-center justify-between text-[8px] sm:text-[9px] font-mono tracking-wider uppercase opacity-90">
                  <span className="text-[#3c502f] font-bold">IDEA WORKBOOK</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#87A96B]/25 text-[#2a381f] font-extrabold border border-[#87A96B]/40">06 / PDF</span>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-medium text-[#7d7065] mb-1">
                    <span className="uppercase font-mono tracking-wider">WORKBOOK · PDF</span>
                    <span className="text-[#87A96B] font-bold">Printable</span>
                  </div>

                  <h4
                    onClick={() => handleBuyWithAnimation(ideaWorkbookProduct)}
                    className="text-xs sm:text-sm font-bold text-[#5A3E2B] hover:text-[#87A96B] transition-colors cursor-pointer leading-tight line-clamp-1"
                  >
                    The Idea-to-Action Workbook
                  </h4>

                  <p className="text-[11px] text-[#716358] mt-1 leading-relaxed line-clamp-2">
                    Prompts to sort your thoughts and turn one idea into a plan.
                  </p>
                </div>

                {/* Pricing and Spring Plus Button */}
                <div className="pt-2 border-t border-[#f2ede4] flex items-center justify-between gap-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-black text-[#5A3E2B] font-mono">
                      ₹69
                    </span>
                    <span className="text-[11px] text-[#a49589] line-through font-mono">
                      ₹299
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyWithAnimation(ideaWorkbookProduct)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f4f0e9] hover:bg-[#5A3E2B] text-[#5A3E2B] hover:text-white border border-[#e4ddcf] flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-md hover:scale-110 active:scale-90 cursor-pointer"
                    aria-label="Buy The Idea-to-Action Workbook"
                  >
                    {userOwnedProductIds.includes(ideaWorkbookProduct.id) ? (
                      <Check className="w-4 h-4 text-[#87A96B] stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            3. THIRD SECTION: THREE VERIFIED CUSTOMER REVIEWS (IMG 817)
            Amber Glow 5-Star Ratings (#D5851F), Sage Green Rings (#87A96B), Walnut Typography (#5A3E2B)
            ========================================================================= */}
        <section className="w-full space-y-3">
          {/* Card 1: Reviewer R */}
          <div className="p-4 sm:p-5 bg-white rounded-[22px] border border-[#e8e2d8] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 space-y-2.5">
            <div className="flex items-center gap-1 text-[#D5851F]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D5851F] text-[#D5851F]" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#3A2A1E] leading-relaxed font-normal">
              “I finally had a clear place to start instead of saving another hundred tips.”
            </p>
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="w-7 h-7 rounded-full bg-[#87A96B]/20 text-[#5A3E2B] font-bold text-xs flex items-center justify-center shrink-0 border border-[#87A96B]/40">
                R
              </div>
              <div>
                <p className="text-xs font-bold text-[#5A3E2B] flex items-center gap-1">
                  <span>Review example</span>
                  <CheckCircle2 className="w-3 h-3 text-[#87A96B]" />
                </p>
                <p className="text-[10px] text-[#8c7d71]">Verified customer</p>
              </div>
            </div>
          </div>

          {/* Card 2: Reviewer S */}
          <div className="p-4 sm:p-5 bg-white rounded-[22px] border border-[#e8e2d8] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 space-y-2.5">
            <div className="flex items-center gap-1 text-[#D5851F]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D5851F] text-[#D5851F]" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#3A2A1E] leading-relaxed font-normal">
              “Simple to follow, and I could put the steps to use straight away.”
            </p>
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="w-7 h-7 rounded-full bg-[#87A96B]/20 text-[#5A3E2B] font-bold text-xs flex items-center justify-center shrink-0 border border-[#87A96B]/40">
                S
              </div>
              <div>
                <p className="text-xs font-bold text-[#5A3E2B] flex items-center gap-1">
                  <span>Review example</span>
                  <CheckCircle2 className="w-3 h-3 text-[#87A96B]" />
                </p>
                <p className="text-[10px] text-[#8c7d71]">Verified customer</p>
              </div>
            </div>
          </div>

          {/* Card 3: Reviewer A */}
          <div className="p-4 sm:p-5 bg-white rounded-[22px] border border-[#e8e2d8] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 space-y-2.5">
            <div className="flex items-center gap-1 text-[#D5851F]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D5851F] text-[#D5851F]" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-[#3A2A1E] leading-relaxed font-normal">
              “I liked that it focused on the useful bits without making things complicated.”
            </p>
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="w-7 h-7 rounded-full bg-[#87A96B]/20 text-[#5A3E2B] font-bold text-xs flex items-center justify-center shrink-0 border border-[#87A96B]/40">
                A
              </div>
              <div>
                <p className="text-xs font-bold text-[#5A3E2B] flex items-center gap-1">
                  <span>Review example</span>
                  <CheckCircle2 className="w-3 h-3 text-[#87A96B]" />
                </p>
                <p className="text-[10px] text-[#8c7d71]">Verified customer</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. FOURTH SECTION: INSPIRED BY ACHARYA PRASHANT & OUR AIMS (IMG 908)
            Walnut Brown (#5A3E2B), Sage Green Halo (#87A96B), Amber Glow Dots (#D5851F)
            ========================================================================= */}
        <section className="w-full bg-white rounded-[28px] p-5 sm:p-7 border border-[#e8e2d8] shadow-sm space-y-7 relative overflow-hidden transition-all duration-300">
          
          {/* 1. Inspired By ~ Acharya Prashant */}
          <div className="text-center space-y-3.5">
            <h3 className="text-base sm:text-lg font-bold font-serif text-[#5A3E2B] tracking-wide">
              Inspired By ~
            </h3>

            {/* Circular Portrait with Ambient Sage Green & Amber Glow Ring */}
            <div className="flex justify-center">
              <div className="relative group/portrait">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white shadow-lg ring-3 ring-[#87A96B] bg-[#3B291D]">
                  <img
                    src="/assets/aistudio/IMG_20261021_120908_081522ec.jpg"
                    alt="Acharya Prashant"
                    className="w-full h-full object-cover object-[center_17%] scale-135 group-hover/portrait:scale-145 transition-transform duration-700"
                  />
                </div>
                {/* Micro accent badge */}
                <div className="absolute -bottom-1 right-1 w-6 h-6 rounded-full bg-[#D5851F] text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Name */}
            <h4 className="text-lg sm:text-xl font-extrabold text-[#3D291C] tracking-tight">
              Acharya Prashant
            </h4>

            {/* Hindi Wisdom Quote with Smooth Fade Slide */}
            <div className="max-w-md mx-auto px-2 min-h-[75px] flex items-center justify-center">
              <p
                className={`text-xs sm:text-sm font-medium text-[#4D3A2C] leading-relaxed transition-opacity duration-300 ${
                  isQuoteFading ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
                }`}
              >
                "{ACHARYA_QUOTES[activeQuoteIndex].quote}"
              </p>
            </div>

            {/* 5 Carousel Dots with Amber Glow Indicator */}
            <div className="flex items-center justify-center gap-2 pt-0.5">
              {ACHARYA_QUOTES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNextQuote(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeQuoteIndex === idx
                      ? 'w-6 bg-[#D5851F] shadow-[0_2px_8px_rgba(213,133,31,0.5)]'
                      : 'w-2.5 bg-[#e4ded5] hover:bg-[#87A96B]'
                  }`}
                  aria-label={`Show wisdom quote ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-[#f2ede4]" />

          {/* 2. Our Aims (Exact text from Screenshot 908) */}
          <div className="text-center space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#5A3E2B] tracking-tight">
              Our Aims
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm text-[#5D4A3C] leading-relaxed text-center sm:text-justify px-1 sm:px-4 font-normal">
              <p>
                हमारा उद्देश्य है कि हम भारत में ज़्यादा से ज़्यादा लोगों को रोज़गार दे सकें, इसलिए हमने एक ऐसा बिज़नेस मॉडल तैयार किया है जो युवाओं को स्किल के साथ-साथ इनकम भी प्रदान करता है।
              </p>
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border-l-4 border-[#87A96B] text-[#3D291C] font-semibold text-left">
                अभी के समय में हर एक बच्चे को ऑनलाइन बिज़नेस करना ही चाहिए, चाहे वह स्कूल में हो या कॉलेज में, क्योंकि हर किसी को रोज़गार देना सरकार के लिए भी संभव नहीं है।
              </div>
              <p>
                हम जो बिज़नेस आइडिया प्रदान करते हैं, उससे यूज़र्स अनलिमिटेड आइडिया खुद भी क्रिएट कर सकते हैं, जिसकी वजह से इस बिज़नेस मॉडल में कभी कोई कॉम्पटीशन नहीं आता है।
              </p>
            </div>
          </div>
        </section>

      </div>

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
