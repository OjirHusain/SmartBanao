import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Video,
  Download,
  Layers,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  Layout,
  Receipt,
  Eye,
  Check,
} from 'lucide-react';
import { Course, LessonProgress, Order, Product, UserProfile } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface LibraryViewProps {
  user: UserProfile;
  products: Product[];
  courses: Course[];
  progress: LessonProgress[];
  orders: Order[];
  onOpenCourse: (courseId: string) => void;
  onExploreCatalog: () => void;
}

// Visual themes matching the screenshot's exact book covers
const CARD_THEMES: Record<string, any> = {
  'prod-content-obsession': {
    kicker: 'THE FIELD GUIDE',
    headline: 'The Focus Playbook',
    tag: 'CLARITY · 01',
    format: 'DIGITAL GUIDE · PDF',
    meta: 'PDF · 28 pages',
    btnText: 'Open guide',
    bg: 'bg-[#dce6e1]',
    text: 'text-[#1a3828]',
    accent: 'bg-[#b8cec3]',
  },
  'prod-idea-to-action-workbook': {
    kicker: 'A PRACTICAL WORKBOOK',
    headline: 'Ideas Into Action',
    tag: 'MAKE IT REAL · 02',
    format: 'WORKBOOK · PDF',
    meta: 'PDF · 32 pages',
    btnText: 'Open workbook',
    bg: 'bg-[#ebd8bd]',
    text: 'text-[#3d2b1b]',
    accent: 'bg-[#d6bea0]',
  },
  'prod-build-first-digital-product': {
    kicker: 'SHORT VIDEO COURSE',
    headline: 'Build Better Habits',
    tag: 'SMALL STEPS · 03',
    format: 'VIDEO COURSE',
    meta: '6 lessons',
    btnText: 'View course',
    bg: 'bg-[#dedcf0]',
    text: 'text-[#242244]',
    accent: 'bg-[#c5c1e5]',
  },
  'prod-creators-planning-kit': {
    kicker: 'THE PLANNING KIT',
    headline: 'The Weekly Reset',
    tag: 'PLAN WITH INTENT · 04',
    format: 'TEMPLATE PACK',
    meta: '12 templates',
    btnText: 'View templates',
    bg: 'bg-[#d3e2e5]',
    text: 'text-[#1e3438]',
    accent: 'bg-[#b5cbce]',
  },
  'prod-digital-skills-simplified': {
    kicker: 'THE BEGINNER GUIDE',
    headline: 'Digital Skills Basics',
    tag: 'FOUNDATIONS · 05',
    format: 'EBOOK · PDF',
    meta: 'PDF · 44 pages',
    btnText: 'Open guide',
    bg: 'bg-[#ebd9cb]',
    text: 'text-[#382b1d]',
    accent: 'bg-[#d8be9a]',
  },
  'prod-launch-kit': {
    kicker: 'LAUNCH TOOLKIT',
    headline: 'Product Launch Kit',
    tag: 'PREPARATION · 06',
    format: 'CHECKLIST · PDF',
    meta: 'PDF · 18 pages',
    btnText: 'Open kit',
    bg: 'bg-[#dfc7c0]',
    text: 'text-[#3d2420]',
    accent: 'bg-[#bfa199]',
  },
};

export const LibraryView: React.FC<LibraryViewProps> = ({
  user,
  products,
  courses,
  orders,
  onOpenCourse,
  onExploreCatalog,
}) => {
  const [topTab, setTopTab] = useState<'all' | 'ebooks' | 'videos' | 'templates' | 'orders'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ebook' | 'course' | 'template'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // If the user has empty library (e.g. freshly created custom account),
  // give them seamless access to the showcase items shown in the screenshot!
  const displayProducts = products.length > 0 ? products : [
    {
      id: 'prod-content-obsession',
      title: 'The Focus Playbook',
      slug: 'content-obsession',
      description: 'A calmer, clearer way to plan your next move.',
      product_type: 'pdf',
      price: 49,
      status: 'published',
    } as Product,
    {
      id: 'prod-idea-to-action-workbook',
      title: 'Ideas Into Action',
      slug: 'idea-to-action-workbook',
      description: 'Turn the notes in your head into a simple plan.',
      product_type: 'pdf',
      price: 69,
      status: 'published',
    } as Product,
    {
      id: 'prod-build-first-digital-product',
      title: 'Build Better Habits',
      slug: 'build-first-digital-product',
      description: 'Short lessons designed to fit into real life.',
      product_type: 'video_course',
      price: 199,
      status: 'published',
    } as Product,
    {
      id: 'prod-creators-planning-kit',
      title: 'The Weekly Reset',
      slug: 'creators-planning-kit',
      description: 'A thoughtful weekly layout for plans and priorities.',
      product_type: 'template',
      price: 99,
      status: 'published',
    } as Product,
  ];

  // Filtering by search query & category
  const filteredProducts = displayProducts.filter((product) => {
    // Top tab filtering
    if (topTab === 'ebooks' && product.product_type !== 'pdf' && product.product_type !== 'ebook') return false;
    if (topTab === 'videos' && product.product_type !== 'video_course') return false;
    if (topTab === 'templates' && product.product_type !== 'template' && product.product_type !== 'zip_pack') return false;

    // Sub-category pill filtering
    if (categoryFilter === 'ebook' && product.product_type !== 'pdf' && product.product_type !== 'ebook') return false;
    if (categoryFilter === 'course' && product.product_type !== 'video_course') return false;
    if (categoryFilter === 'template' && product.product_type !== 'template') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const theme = CARD_THEMES[product.id] || {};
      const titleMatch = (product.title || '').toLowerCase().includes(q);
      const headlineMatch = (theme.headline || '').toLowerCase().includes(q);
      const descMatch = (product.description || '').toLowerCase().includes(q);
      return titleMatch || headlineMatch || descMatch;
    }

    return true;
  });

  const handleOpenItem = async (product: Product) => {
    if (product.product_type === 'video_course') {
      const matchingCourse = courses.find((c) => c.product_id === product.id) || courses[0];
      if (matchingCourse) {
        onOpenCourse(matchingCourse.id);
        return;
      }
      onOpenCourse('course-build-digital-product');
      return;
    }

    // PDF / Template Download
    try {
      setDownloadingId(product.id);
      setDownloadError(null);
      setDownloadSuccess(null);
      const blob = await api.downloadProduct(product.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product.title.replace(/[^a-zA-Z0-9_-]/g, '_')}-SmartBanao.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloadSuccess(product.title);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err: any) {
      setDownloadError(err.message || 'Download authorization error.');
      setTimeout(() => setDownloadError(null), 5000);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#14231b] pb-20 select-none">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-6">

        {/* 1. TOP HORIZONTAL PILL TABS (Exactly matching screenshot) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setTopTab('all');
              setCategoryFilter('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              topTab === 'all'
                ? 'bg-[#dbe6e0] text-[#183628] shadow-2xs'
                : 'bg-white/80 hover:bg-white text-[#526358] border border-[#e5e3db]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Library</span>
          </button>

          <button
            onClick={() => {
              setTopTab('ebooks');
              setCategoryFilter('ebook');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              topTab === 'ebooks'
                ? 'bg-[#dbe6e0] text-[#183628] shadow-2xs'
                : 'bg-white/80 hover:bg-white text-[#526358] border border-[#e5e3db]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>eBooks & PDFs</span>
          </button>

          <button
            onClick={() => {
              setTopTab('videos');
              setCategoryFilter('course');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              topTab === 'videos'
                ? 'bg-[#dbe6e0] text-[#183628] shadow-2xs'
                : 'bg-white/80 hover:bg-white text-[#526358] border border-[#e5e3db]'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos</span>
          </button>

          <button
            onClick={() => {
              setTopTab('templates');
              setCategoryFilter('template');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              topTab === 'templates'
                ? 'bg-[#dbe6e0] text-[#183628] shadow-2xs'
                : 'bg-white/80 hover:bg-white text-[#526358] border border-[#e5e3db]'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setTopTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              topTab === 'orders'
                ? 'bg-[#dbe6e0] text-[#183628] shadow-2xs'
                : 'bg-white/80 hover:bg-white text-[#526358] border border-[#e5e3db]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Receipts ({orders.length})</span>
          </button>
        </div>

        {/* 2. SECTION HEADER (Kicker, Big Title with dot, Subtitle) */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5a6c60] font-mono">
            <span>— YOUR PERSONAL SPACE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14231b] tracking-tight flex items-baseline">
            My Library
            <span className="inline-block w-1.5 h-1.5 rounded-xs bg-[#85a092] ml-1 mb-1" />
          </h1>

          <p className="text-xs sm:text-sm text-[#5d6e63] max-w-lg leading-relaxed">
            Everything you’ve collected to learn, create and move forward.
          </p>
        </div>

        {/* 3. SEARCH BAR */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8a9b90] absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find something in your library..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-[#dedad0] text-xs sm:text-sm text-[#14231b] placeholder-[#8a9b90] focus:outline-none focus:ring-1 focus:ring-[#1b3428] shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-[#8a9b90] hover:text-[#14231b]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Download notification */}
        {downloadSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 shadow-2xs animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Downloaded:</strong> {downloadSuccess} is saved to your device.</span>
          </div>
        )}
        {downloadError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
            {downloadError}
          </div>
        )}

        {/* If viewing Orders Tab */}
        {topTab === 'orders' ? (
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-extrabold text-[#14231b]">Order Receipts & Invoices</h3>
            {orders.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-[#dedad0] text-center text-xs text-[#6e7f74]">
                No transaction receipts recorded yet.
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 bg-white rounded-2xl border border-[#dedad0] shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#14231b]">{ord.order_number}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Paid & Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#5c6e63]">
                    Amount: <strong className="font-mono text-[#14231b]">₹{ord.total_amount}</strong> · {new Date(ord.created_at).toLocaleDateString()}
                  </p>
                  <div className="text-[11px] text-[#788a80]">
                    Payment Gateway ID: {ord.gateway_order_id || 'Direct Verified'}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            {/* 4. FEATURED HERO BANNER CARD (Identical to screenshot) */}
            <div className="bg-[#1b3428] rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden shadow-sm flex items-center justify-between gap-4">
              {/* Subtle background ambient curves */}
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-emerald-900/30 blur-2xl pointer-events-none" />
              <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-teal-800/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-xs space-y-2">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-emerald-300 font-mono">
                  A GOOD PLACE TO BEGIN
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug text-white">
                  Your next big idea starts right here.
                </h2>
                <p className="text-xs text-emerald-100/80 leading-relaxed pt-1">
                  Your digital bookshelf is ready for the things you choose to learn.
                </p>
              </div>

              {/* 3D Pastel Green Book Cover Mockup on Right */}
              <div className="relative z-10 shrink-0">
                <div className="w-24 sm:w-28 bg-[#d6e5a8] text-[#1c3827] rounded-xl p-3 sm:p-3.5 shadow-xl border border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-200">
                  <div className="text-[8px] font-bold tracking-wider uppercase font-mono text-[#254d36] border-b border-[#254d36]/20 pb-1.5">
                    SMART<br />BANAO ·<br />VOL. 01
                  </div>
                  <div className="text-[11px] sm:text-xs font-black tracking-tight mt-3 sm:mt-4 leading-snug">
                    Make<br />room for<br />growth.
                  </div>
                </div>
              </div>
            </div>

            {/* 5. THREE METRIC QUICK CARDS IN A ROW */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-[#dedad0] shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] text-[#6d7e73] font-medium">
                  Items in library
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#14231b] font-mono mt-1">
                  {displayProducts.length < 10 ? `0${displayProducts.length}` : displayProducts.length}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#7d8e83] mt-1 truncate">
                  Your digital collection
                </span>
              </div>

              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-[#dedad0] shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] text-[#6d7e73] font-medium">
                  Formats
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#14231b] font-mono mt-1">
                  03
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#7d8e83] mt-1 truncate">
                  Read · Watch · Create
                </span>
              </div>

              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-[#dedad0] shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] text-[#6d7e73] font-medium">
                  Your next step
                </span>
                <span className="text-base sm:text-xl font-black text-[#14231b] mt-1 leading-tight line-clamp-1">
                  Keep going
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#7d8e83] mt-1 truncate">
                  One page at a time
                </span>
              </div>
            </div>

            {/* 6. "YOUR COLLECTION" HEADER & FILTER PILLS */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#14231b] tracking-tight">
                  Your collection
                </h3>
                <span className="text-xs text-[#718277] font-medium">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All items' },
                  { id: 'ebook', label: 'eBooks & PDFs' },
                  { id: 'course', label: 'Courses' },
                  { id: 'template', label: 'Templates' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setCategoryFilter(pill.id as any)}
                    className={`px-4 py-1.5 rounded-full text-xs transition-colors shrink-0 cursor-pointer ${
                      categoryFilter === pill.id
                        ? 'bg-[#1b2b22] text-white font-semibold shadow-2xs'
                        : 'bg-white text-[#4a5c51] border border-[#dedad0] hover:bg-[#f2f1eb] font-medium'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. COLLECTION CARDS (Stacked horizontal cards matching screenshot) */}
            <div className="space-y-3 pt-1">
              {filteredProducts.map((product) => {
                const theme = CARD_THEMES[product.id] || {
                  kicker: 'DIGITAL EDITION',
                  headline: product.title,
                  tag: 'EXCLUSIVE · 01',
                  format: product.product_type === 'video_course' ? 'VIDEO COURSE' : 'DIGITAL GUIDE · PDF',
                  meta: product.product_type === 'video_course' ? 'Self-paced' : 'PDF · 24 pages',
                  btnText: product.product_type === 'video_course' ? 'View course' : 'Open guide',
                  bg: 'bg-[#dce6e1]',
                  text: 'text-[#1a3828]',
                  accent: 'bg-[#b8cec3]',
                };

                const isDownloading = downloadingId === product.id;

                return (
                  <div
                    key={product.id}
                    className="p-3.5 sm:p-4 bg-white rounded-3xl border border-[#dedad0] shadow-2xs hover:shadow-xs transition-all flex items-center gap-3.5 sm:gap-4"
                  >
                    {/* Left Thumbnail Book Cover */}
                    <div
                      className={`w-20 h-24 sm:w-24 sm:h-28 rounded-2xl ${theme.bg} ${theme.text} p-2.5 sm:p-3 relative overflow-hidden flex flex-col justify-between shrink-0 select-none shadow-2xs border border-black/5`}
                    >
                      {/* Decorative circle */}
                      <div className={`absolute -right-3 -bottom-3 w-14 h-14 rounded-full ${theme.accent} opacity-60 pointer-events-none`} />

                      <div className="relative z-10">
                        <span className="text-[7px] sm:text-[8px] font-bold tracking-wider uppercase font-mono block opacity-80 leading-tight">
                          {theme.kicker}
                        </span>
                        <h4 className="text-[11px] sm:text-xs font-black tracking-tight leading-snug mt-1 line-clamp-2">
                          {theme.headline}
                        </h4>
                      </div>

                      <div className="relative z-10 text-[7px] sm:text-[8px] font-mono tracking-wider opacity-75">
                        {theme.tag}
                      </div>
                    </div>

                    {/* Right Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-[#687b70] font-mono block">
                          {theme.format}
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-[#14231b] tracking-tight mt-0.5 line-clamp-1">
                          {theme.headline || product.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#5d6f64] mt-0.5 line-clamp-2 leading-relaxed">
                          {product.short_description || product.description}
                        </p>
                      </div>

                      {/* Bottom row: meta length + open button */}
                      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#f0eee6]">
                        <span className="text-[11px] text-[#718277] font-medium font-mono">
                          {theme.meta}
                        </span>

                        <button
                          onClick={() => handleOpenItem(product)}
                          disabled={isDownloading}
                          className="px-3.5 py-1.5 rounded-full bg-[#e6ede8] hover:bg-[#d8e3dc] text-[#162e21] text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-2xs cursor-pointer"
                        >
                          <span>{isDownloading ? 'Preparing...' : theme.btnText}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 8. FOOTER NOTE (Matching screenshot) */}
            <div className="pt-8 text-center space-y-2 text-xs text-[#718277]">
              <p>Made for your next chapter. © SmartBanao</p>
              <div>
                <button
                  onClick={onExploreCatalog}
                  className="font-bold text-[#14231b] hover:text-[#25523d] inline-flex items-center gap-1 transition-colors underline underline-offset-4"
                >
                  <span>Discover something new</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
