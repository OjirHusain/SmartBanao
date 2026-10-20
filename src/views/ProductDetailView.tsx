import React from 'react';
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Book,
  Video,
  Layout,
  Archive,
  Download,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  onBack: () => void;
  onBuyNow: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCourse?: (productId: string) => void;
  isOwned: boolean;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  onBack,
  onBuyNow,
  onSelectProduct,
  onOpenCourse,
  isOwned,
}) => {
  const getProductIcon = () => {
    switch (product.product_type) {
      case 'pdf':
        return <FileText className="w-10 h-10 text-sky-500" />;
      case 'ebook':
        return <Book className="w-10 h-10 text-sky-500" />;
      case 'video_course':
        return <Video className="w-10 h-10 text-cyan-500" />;
      case 'template':
        return <Layout className="w-10 h-10 text-blue-500" />;
      case 'zip_pack':
        return <Archive className="w-10 h-10 text-indigo-500" />;
      default:
        return <FileText className="w-10 h-10 text-sky-500" />;
    }
  };

  const getProductTypeLabel = () => {
    switch (product.product_type) {
      case 'pdf':
        return 'PDF Guide';
      case 'ebook':
        return 'E-Book';
      case 'video_course':
        return 'Video Course';
      case 'template':
        return 'Design System';
      case 'zip_pack':
        return 'Resource Pack';
      default:
        return 'Digital Product';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Products</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Visual Cover */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 aspect-[16/10] sm:aspect-[16/10] p-6 sm:p-10 flex flex-col justify-between relative shadow-lg">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center backdrop-blur-sm shadow-md">
                {getProductIcon()}
              </div>

              {isOwned ? (
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/90 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Purchased & Owned
                </span>
              ) : (
                <span className="text-xs font-semibold text-sky-300 bg-sky-950/80 border border-sky-800 px-3 py-1 rounded-full">
                  Verified Digital Delivery
                </span>
              )}
            </div>

            <div className="relative z-10">
              <span className="text-xs font-semibold text-sky-400 tracking-wider uppercase">
                {getProductTypeLabel()}
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                {product.title}
              </h1>
              {product.file_size && (
                <p className="text-xs text-slate-400 font-mono mt-2">
                  Delivery Size: {product.file_size}
                </p>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">About This Digital Product</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Included Features */}
          {product.includes && product.includes.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                What’s Included Inside
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.includes.map((inc, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-start gap-2.5 text-xs text-slate-700 shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Purchase Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Single One-Time Payment
              </span>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  ₹{product.price}
                </span>
                {product.original_price && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    ₹{product.original_price}
                  </span>
                )}
                {product.discount_percent && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {product.discount_percent}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Instant delivery to your account · No recurring subscription
              </p>
            </div>

            {/* Buy Action */}
            <div className="space-y-2.5 pt-2">
              {isOwned ? (
                product.product_type === 'video_course' ? (
                  <button
                    onClick={() => onOpenCourse && onOpenCourse(product.id)}
                    className="w-full py-3 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Watch Course in Library</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onBuyNow(product)}
                    className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Licensed File</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => onBuyNow(product)}
                  className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-sky-400" />
                  <span>Buy Now for ₹{product.price}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <p className="text-[11px] text-center text-slate-400">
                Safe payment with Indian UPI, RuPay, or Cards.
              </p>
            </div>

            {/* Key benefits list */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>256-Bit Cryptographically Verified License</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Immediate access in My Library</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Commercial & personal project permissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Frequently Bought Together
            </h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectProduct}
                onBuyNow={onBuyNow}
                isOwned={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
