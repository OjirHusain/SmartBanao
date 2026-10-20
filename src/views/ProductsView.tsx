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
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
          SmartBanao Catalog
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Digital Products & Resources
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
          Practical guides, attorney-vetted contracts, production code libraries, and video courses.
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
            { id: 'zip_pack', label: 'ZIP Resource Packs' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="popular">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-800">No matching products found</p>
          <p className="text-xs text-slate-500">Try adjusting your search terms or filter selection.</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-sky-600 hover:underline"
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
