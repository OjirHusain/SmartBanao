import React, { useState } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Product, ProductType } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface ProductsViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onBuyProduct: (p: Product) => void;
  userOwnedProductIds: string[];
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onSelectProduct,
  onBuyProduct,
  userOwnedProductIds,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'popular'>('popular');

  const filtered = products
    .filter((p) => {
      if (activeCategory !== 'all' && p.product_type !== activeCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header with Walnut Brown and Sage Green branding */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#87A96B]">
          Official Editions · SmartBanao Collection
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5A3E2B] tracking-tight mt-1 font-serif">
          Digital Products & Practical Guides
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
          Carefully crafted workbooks, checklists, and guides designed to turn rough thoughts into finished digital products.
        </p>
      </div>

      {/* Controls Bar: Search + Category Buttons + Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Products' },
            { id: 'pdf', label: 'PDF Guides' },
            { id: 'ebook', label: 'E-Books' },
            { id: 'video_course', label: 'Video Courses' },
            { id: 'template', label: 'Templates' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#5A3E2B] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-[#FAF8F5] border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200 text-[#5A3E2B] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#87A96B]"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200 text-[#5A3E2B] font-medium focus:outline-none cursor-pointer"
          >
            <option value="popular">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-stone-200 text-center space-y-3">
          <p className="text-sm font-semibold text-[#5A3E2B]">No matching products found</p>
          <p className="text-xs text-stone-500">Try adjusting your search terms or filter selection.</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-[#87A96B] hover:text-[#5A3E2B] transition-colors cursor-pointer underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {filtered.map((product) => {
            const isOwned = userOwnedProductIds.includes(product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onBuyNow={onBuyProduct}
                isOwned={isOwned}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
