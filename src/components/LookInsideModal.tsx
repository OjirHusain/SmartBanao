import React, { useState } from 'react';
import { X, BookOpen, Check, ArrowRight, ShieldCheck, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import { Product } from '../types/index.ts';

interface LookInsideModalProps {
  product: Product;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
  isOwned: boolean;
}

export const LookInsideModal: React.FC<LookInsideModalProps> = ({
  product,
  onClose,
  onBuyNow,
  isOwned,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // High-fidelity sample editorial pages tailored to the product
  const getSamplePages = () => {
    switch (product.slug) {
      case 'content-obsession':
        return [
          {
            title: 'Framework: The Clarity Matrix',
            chapter: 'Chapter 01 · Planning Before Writing',
            content: `The mistake most creators make is opening a blank document without an anchor thought. 

Before typing a sentence, answer three constraints:
1. What is the single unignorable observation?
2. Who is currently wasting time because they don't know this?
3. What is the smallest action they should take in the next 15 minutes?

When these three are locked, the prose writes itself.`,
            prompt: 'Prompt: Identify one repetitive question clients asked you this week. Draft the answer as a 3-step decision tree.',
          },
          {
            title: 'Editorial Rhythm & Pacing',
            chapter: 'Chapter 02 · Voice & Cadence',
            content: `Short sentences carry velocity. Longer sentences, woven with descriptive nuance and rhythmic clauses, allow the reader to pause and absorb the weight of the insight.

Alternate them deliberately. Never allow three sentences of identical syllable length to follow one another.`,
            prompt: 'Exercise: Read your latest draft aloud. Circle any sentence that causes your breath to stumble.',
          },
        ];
      case 'creators-planning-kit':
        return [
          {
            title: 'Weekly Focus Canvas',
            chapter: 'Section 01 · The 3 Big Rocks Framework',
            content: `A productive week is not measured by 40 checked boxes of low-leverage errands. It is measured by whether your 2 to 3 non-negotiable needle-movers moved from "Pending" to "Shipped".

Every Monday morning, select:
• Project Alpha: The primary revenue or product milestone.
• Project Beta: The operational cleanup or client deliverable.
• Daily Maintenance Cap: Maximum 90 minutes per day on email, messages, and administrative chatter.`,
            prompt: 'Rule: If an item does not directly serve Project Alpha or Beta, schedule it for Friday afternoon batching.',
          },
          {
            title: 'Daily Energy & Execution Flow',
            chapter: 'Section 02 · Protect Your Prime Hours',
            content: `Your brain has at most 3 to 4 hours of intense, high-fidelity cognitive output each day. 

Map your calendar to your circadian peaks:
- 08:30 – 11:30: Deep Creative Flow (Zero notifications, phone in airplane mode)
- 13:30 – 15:00: Asynchronous Communication & Coordination
- 16:00 – 17:30: Low-Cognitive Administrative Tasks & Filing`,
            prompt: 'Template: Use the accompanying Notion template to track energy levels over 14 days.',
          },
        ];
      default:
        return [
          {
            title: 'Foundations & Architecture',
            chapter: 'Section 01 · The Starting Signal',
            content: `Building something useful starts by removing what is non-essential. 

Most people fail to launch because they attempt to build a cathedral when the market merely needs a clean, sturdy park bench.

Keep your first version compact:
1. One problem solved exceptionally well.
2. Zero unnecessary configuration steps.
3. An obvious outcome delivered in under 10 minutes.`,
            prompt: 'Guiding Question: If you had to ship this in 48 hours, what 80% would you cut immediately?',
          },
          {
            title: 'Execution & Momentum',
            chapter: 'Section 02 · The Feedback Loop',
            content: `Momentum is fragile. The only cure for doubt is demonstrable progress. 

When you publish early, you trade hypothetical perfection for empirical truth. Feedback from three real customers will clarify your roadmap faster than three months of isolated speculation.`,
            prompt: 'Checklist: Verify license keys, packaging, and digital delivery flow before general public announcement.',
          },
        ];
    }
  };

  const pages = getSamplePages();
  const activePageData = pages[currentPage - 1] || pages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#faf9f5] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#dedad0] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-[#e8e5dc] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1b3428] text-white flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-[#b8d4c3]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3c7155] font-mono">
                Look Inside Preview
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#14231b] truncate max-w-[260px] sm:max-w-md">
                {product.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#dedad0] hover:bg-[#f0eee6] flex items-center justify-center text-[#55665c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Book Preview Body with realistic editorial paper look */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#fdfcfa]">
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-9 shadow-sm border border-[#e8e6dc] relative">
            {/* Subtle paper spine line */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-[#eae7dc] to-transparent rounded-l-2xl" />

            <div className="space-y-4 pl-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#7d8e83] border-b border-[#f0eee6] pb-2">
                <span>{activePageData.chapter}</span>
                <span>Page {currentPage} of {pages.length}</span>
              </div>

              <h4 className="text-lg sm:text-xl font-extrabold text-[#14231b] tracking-tight">
                {activePageData.title}
              </h4>

              <div className="text-xs sm:text-sm text-[#384a3f] leading-relaxed whitespace-pre-line font-serif">
                {activePageData.content}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#f5f4ed] border border-[#e5e3d7] text-xs text-[#2c3d32] space-y-1">
                <span className="font-bold font-sans text-[11px] text-[#25523d] uppercase tracking-wider block">
                  Actionable Prompt & Worksheet
                </span>
                <p className="leading-relaxed font-sans">{activePageData.prompt}</p>
              </div>
            </div>
          </div>

          {/* Page Turners */}
          <div className="flex items-center justify-between max-w-xl mx-auto mt-4 px-2 text-xs text-[#5f7065]">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 font-semibold disabled:opacity-30 hover:text-[#14231b] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Sample</span>
            </button>

            <span className="font-mono text-[11px]">Sample Excerpt · Complete guide contains all chapters</span>

            <button
              disabled={currentPage >= pages.length}
              onClick={() => setCurrentPage((p) => Math.min(pages.length, p + 1))}
              className="flex items-center gap-1 font-semibold disabled:opacity-30 hover:text-[#14231b] transition-colors"
            >
              <span>Next Sample</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Purchase Bar */}
        <div className="p-4 sm:p-5 border-t border-[#e8e5dc] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-[#14231b] font-mono">
                ₹{product.price}
              </span>
              {product.original_price && (
                <span className="text-xs text-[#909e94] line-through font-mono">
                  ₹{product.original_price}
                </span>
              )}
              <span className="text-[10px] font-bold text-[#2d6a4f] bg-[#eef6f1] px-2 py-0.5 rounded-full">
                One-Time Purchase
              </span>
            </div>
            <p className="text-[11px] text-[#6b7d72]">
              Instant download · Lifetime updates included
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#526358] hover:text-[#14231b] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBuyNow(product);
              }}
              className="px-5 py-2.5 rounded-full bg-[#5A3E2B] hover:bg-[#432d1e] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{isOwned ? 'Access in Library' : `Get Complete Guide (₹${product.price})`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
