import React from 'react';
import { Plus, Check, BookOpen } from 'lucide-react';
import { Product } from '../types/index.ts';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onLookInside?: (product: Product) => void;
  isOwned?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onBuyNow,
  onLookInside,
  isOwned = false,
}) => {
  const getCardTheme = () => {
    switch (product.slug) {
      case 'content-obsession':
        return {
          bg: 'bg-[#d8e2dc]',
          text: 'text-[#1d3528]',
          kicker: "THE CREATOR'S FIELD GUIDE",
          headline: 'Content that connects.',
          edition: 'SMARTBANAO EDITIONS · 01 / PDF',
          typeLabel: 'EBOOK · PDF',
          tagLabel: '12 min read',
          shapes: 'bg-[#9fb8ad]',
          accent: 'border-[#c1cfc7]',
        };
      case 'creators-planning-kit':
        return {
          bg: 'bg-[#1b3027]',
          text: 'text-white',
          kicker: 'A CALMER WORKFLOW',
          headline: 'Make space for the work.',
          edition: 'WORKSHEET COLLECTION · 02 / PDF',
          typeLabel: 'TEMPLATE · PDF',
          tagLabel: 'Reusable',
          shapes: 'bg-[#315243]',
          accent: 'border-[#2d4d3e]',
        };
      case 'digital-skills-simplified':
        return {
          bg: 'bg-[#ebd8bd]',
          text: 'text-[#382b1d]',
          kicker: 'START WHERE YOU ARE',
          headline: 'The digital starter guide.',
          edition: 'THE BEGINNER SERIES · 03 / PDF',
          typeLabel: 'EBOOK · PDF',
          tagLabel: 'Beginner',
          shapes: 'bg-[#d8be9a]',
          accent: 'border-[#dac2a3]',
        };
      case 'build-first-digital-product':
        return {
          bg: 'bg-[#c5d8d1]',
          text: 'text-[#18362d]',
          kicker: 'LEARN BY DOING',
          headline: 'From idea to first draft.',
          edition: 'VIDEO WORKSHOP · 04 / VIDEO',
          typeLabel: 'VIDEO COURSE',
          tagLabel: 'Self-paced',
          shapes: 'bg-[#89ada1]',
          accent: 'border-[#a8c4bb]',
        };
      case 'digital-product-launch-kit':
        return {
          bg: 'bg-[#dfc7c0]',
          text: 'text-[#3d2420]',
          kicker: 'A SMALL LAUNCH PLAN',
          headline: 'Ready when you are.',
          edition: 'LAUNCH TOOLKIT · 05 / PDF',
          typeLabel: 'CHECKLIST · PDF',
          tagLabel: 'Quick start',
          shapes: 'bg-[#bfa199]',
          accent: 'border-[#ceb0a8]',
        };
      case 'idea-to-action-workbook':
      default:
        return {
          bg: 'bg-[#dcdbb8]',
          text: 'text-[#32331c]',
          kicker: 'A LITTLE CLARITY',
          headline: 'Make the idea clearer.',
          edition: 'IDEA WORKBOOK · 06 / PDF',
          typeLabel: 'WORKBOOK · PDF',
          tagLabel: 'Printable',
          shapes: 'bg-[#bab889]',
          accent: 'border-[#c7c69f]',
        };
    }
  };

  const theme = getCardTheme();

  return (
    <div className="group bg-white rounded-2xl border border-[#e6e4dc] overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
      {/* Clickable Card Header Graphic */}
      <div
        onClick={() => (onLookInside ? onLookInside(product) : onSelect(product))}
        className={`cursor-pointer p-3.5 sm:p-4 aspect-[4/3] ${theme.bg} ${theme.text} relative overflow-hidden flex flex-col justify-between select-none border-b ${theme.accent}`}
      >
        {/* Subtle decorative curved overlapping circles in corner */}
        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${theme.shapes} opacity-60 pointer-events-none transition-transform group-hover:scale-110 duration-300`} />
        <div className={`absolute right-4 -bottom-4 w-16 h-16 rounded-full ${theme.shapes} opacity-80 pointer-events-none transition-transform group-hover:scale-105 duration-300`} />

        <div className="relative z-10">
          <p className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-80 font-mono">
            {theme.kicker}
          </p>
          <h4 className="text-sm sm:text-base font-extrabold tracking-tight mt-1 leading-snug line-clamp-2">
            {theme.headline}
          </h4>
        </div>

        <div className="relative z-10 pt-4 flex items-center justify-between text-[8px] sm:text-[9px] font-mono tracking-wider uppercase opacity-80">
          <span>{theme.edition}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded text-white flex items-center gap-1">
            <BookOpen className="w-2.5 h-2.5" />
            Peek
          </span>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata labels */}
          <div className="flex items-center justify-between text-[10px] font-medium text-[#738379] mb-1">
            <span className="uppercase font-mono">{theme.typeLabel}</span>
            <span>{theme.tagLabel}</span>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="text-xs sm:text-sm font-bold text-[#14231b] hover:text-[#234c37] transition-colors cursor-pointer leading-tight line-clamp-1"
          >
            {product.title}
          </h3>

          <p className="text-[11px] text-[#637268] mt-1 leading-relaxed line-clamp-2">
            {product.short_description || product.description}
          </p>
        </div>

        {/* Pricing & Add/Buy button */}
        <div className="mt-3 pt-2.5 border-t border-[#f0eee6] flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-extrabold text-[#14231b] font-mono">
              ₹{product.price}
            </span>
            {product.original_price && (
              <span className="text-[11px] text-[#93a098] line-through font-mono">
                ₹{product.original_price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onLookInside && (
              <button
                type="button"
                onClick={() => onLookInside(product)}
                className="hidden sm:inline-block text-[11px] font-semibold text-[#5c6e63] hover:text-[#1b3428] px-2 py-1 rounded hover:bg-[#f2f1ec] transition-colors"
              >
                Sample
              </button>
            )}

            <button
              onClick={() => onBuyNow(product)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f0eee6] hover:bg-[#1b3428] text-[#16221c] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              aria-label={`Buy ${product.title}`}
            >
              {isOwned ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
