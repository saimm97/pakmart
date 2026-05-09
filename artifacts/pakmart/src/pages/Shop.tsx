import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  useListProducts, useListCategories, useListBrands,
  useAddCartItem, getGetCartQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Star, Heart, ShoppingCart, Filter, X, Search,
  ChevronDown, ChevronRight, SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";
import { useSearch } from "wouter";

function ProductCard({ product }: { product: any }) {
  const queryClient = useQueryClient();
  const addCart = useAddCartItem();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addCart.mutate({ data: { productId: product.id, quantity: 1 } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast.success("Added to cart");
      },
      onError: () => toast.error(`Failed to add ${product.name}`)
    });
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group overflow-hidden border border-white/[0.06] hover:border-emerald-500/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 transition-all duration-300 bg-[#13162A] flex flex-col h-full rounded-2xl cursor-pointer">
        <div className="relative aspect-square bg-[#1A1E35] flex items-center justify-center overflow-hidden p-5 rounded-t-2xl">
          {product.discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-[#E8B84A] text-[#0C0E18] font-black z-10 rounded-lg px-2 py-0.5 text-[10px] border-none uppercase tracking-wider">
              {product.discount}% OFF
            </Badge>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-900/30 transition-colors border border-white/10 z-10 opacity-0 group-hover:opacity-100"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-[72%] h-[72%] object-contain group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-lg"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">{product.brand}</span>
          <h3 className="font-display font-semibold text-[#EEF1FA] text-sm line-clamp-2 mb-2 leading-snug group-hover:text-emerald-300 transition-colors flex-1">{product.name}</h3>
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-[#E8B84A]">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 fill-current ${i > Math.round(product.rating ?? 4) ? "opacity-20" : ""}`} />
              ))}
            </div>
            <span className="text-[11px] text-[#5A6480] ml-0.5">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-white/[0.06]">
            <div>
              <div className="text-base font-bold text-[#EEF1FA] leading-none">{formatPrice(product.price)}</div>
              {product.oldPrice && (
                <div className="text-xs text-[#5A6480] line-through mt-0.5">{formatPrice(product.oldPrice)}</div>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={addCart.isPending}
              className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all shadow-[0_2px_12px_rgba(16,185,129,0.3)] flex-shrink-0 active:scale-95 group-hover:shadow-[0_4px_16px_rgba(16,185,129,0.4)]"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

const RATING_OPTIONS = [
  { value: 4, label: "4★ & above" },
  { value: 3, label: "3★ & above" },
  { value: 2, label: "2★ & above" },
];

type Filters = {
  category: string | undefined;
  selectedBrands: string[];
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minRating: number | undefined;
  onSale: boolean;
  inStock: boolean;
  sort: string;
  search: string;
};

export function Shop({ categorySlug }: { categorySlug?: string }) {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const q = searchParams.get("q") || "";
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    category: categorySlug,
    selectedBrands: [],
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    onSale: false,
    inStock: false,
    sort: "popular",
    search: q,
  });

  useEffect(() => {
    setFilters(f => ({ ...f, category: categorySlug, search: q }));
  }, [categorySlug, q]);

  // Category tree state — which parent groups are expanded
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  const { data: productsData, isLoading: productsLoading } = useListProducts({
    category: filters.category,
    brands: filters.selectedBrands.length > 0 ? filters.selectedBrands.join(",") : undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
    onSale: filters.onSale || undefined,
    inStock: filters.inStock || undefined,
    sort: filters.sort as any,
    search: filters.search || undefined,
    limit: 24,
  });

  const { data: categories } = useListCategories();
  const { data: brands } = useListBrands();
  const [priceRange, setPriceRange] = useState([0, 200000]);

  const applyPriceFilter = () => {
    setFilters(f => ({ ...f, minPrice: priceRange[0] || undefined, maxPrice: priceRange[1] < 200000 ? priceRange[1] : undefined }));
  };

  // Build category tree
  const topLevel = categories?.filter(c => !c.parentSlug) ?? [];
  const getSubcats = (parentSlug: string) => categories?.filter(c => c.parentSlug === parentSlug) ?? [];

  const toggleBrand = (slug: string) => {
    setFilters(f => ({
      ...f,
      selectedBrands: f.selectedBrands.includes(slug)
        ? f.selectedBrands.filter(b => b !== slug)
        : [...f.selectedBrands, slug],
    }));
  };

  const toggleExpand = (slug: string) => {
    setExpandedParents(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const clearAll = () => {
    setFilters({ category: undefined, selectedBrands: [], minPrice: undefined, maxPrice: undefined, minRating: undefined, onSale: false, inStock: false, sort: "popular", search: "" });
    setPriceRange([0, 200000]);
  };

  const activeFilterCount = [
    filters.category, filters.selectedBrands.length > 0 ? "b" : null,
    filters.minPrice ? "p" : null, filters.minRating ? "r" : null,
    filters.onSale ? "s" : null, filters.inStock ? "i" : null,
    filters.search ? "q" : null,
  ].filter(Boolean).length;

  // Which parent is active (contains the selected category)
  const activeParent = filters.category
    ? categories?.find(c => c.slug === filters.category)?.parentSlug ?? filters.category
    : null;

  // Auto-expand the parent of the active category
  useEffect(() => {
    if (activeParent) {
      setExpandedParents(prev => new Set([...prev, activeParent]));
    }
  }, [activeParent]);

  // Find the title to show
  const activeCatName = filters.category
    ? categories?.find(c => c.slug === filters.category)?.name
    : undefined;

  const SidebarContent = () => (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-[#EEF1FA] text-sm uppercase tracking-wider">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs text-[#5A6480] hover:text-red-400 transition-colors font-medium">
            Clear all
          </button>
        )}
      </div>

      {/* CATEGORIES */}
      <div className="pb-5 border-b border-white/[0.06]">
        <h3 className="font-bold text-[#5A6480] mb-3 uppercase tracking-wider text-[10px]">Categories</h3>
        <div className="space-y-0.5">
          <button
            className={`w-full flex items-center gap-2 text-sm rounded-xl px-3 py-2 transition-colors text-left ${!filters.category ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/40" : "text-[#8A93B4] hover:text-[#EEF1FA] hover:bg-white/5 border border-transparent"}`}
            onClick={() => setFilters(f => ({ ...f, category: undefined }))}
          >
            All Categories
          </button>

          {topLevel.map(parent => {
            const subs = getSubcats(parent.slug);
            const isExpanded = expandedParents.has(parent.slug);
            const isActive = filters.category === parent.slug;
            const hasActiveChild = subs.some(s => s.slug === filters.category);

            return (
              <div key={parent.slug}>
                <button
                  className={`w-full flex items-center gap-2 text-sm rounded-xl px-3 py-2 transition-colors text-left ${isActive ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/40" : hasActiveChild ? "text-emerald-400 border border-transparent" : "text-[#8A93B4] hover:text-[#EEF1FA] hover:bg-white/5 border border-transparent"}`}
                  onClick={() => {
                    setFilters(f => ({ ...f, category: parent.slug }));
                    if (subs.length > 0) toggleExpand(parent.slug);
                  }}
                >
                  <span className="flex-1 font-medium">{parent.name}</span>
                  {subs.length > 0 && (
                    <span
                      className="p-0.5 rounded hover:bg-white/10 transition-colors"
                      onClick={e => { e.stopPropagation(); toggleExpand(parent.slug); }}
                    >
                      {isExpanded
                        ? <ChevronDown className="w-3 h-3" />
                        : <ChevronRight className="w-3 h-3" />}
                    </span>
                  )}
                </button>

                {/* Subcategories */}
                {isExpanded && subs.length > 0 && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-3">
                    {subs.map(sub => (
                      <button
                        key={sub.slug}
                        className={`w-full flex items-center justify-between text-xs rounded-lg px-2.5 py-1.5 transition-colors text-left ${filters.category === sub.slug ? "bg-emerald-900/40 text-emerald-300 border border-emerald-800/30" : "text-[#6A7494] hover:text-[#EEF1FA] hover:bg-white/5 border border-transparent"}`}
                        onClick={() => setFilters(f => ({ ...f, category: sub.slug }))}
                      >
                        <span>{sub.name}</span>
                        <span className="text-[10px] text-[#3A4060]">{sub.productCount}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* PRICE */}
      <div className="py-5 border-b border-white/[0.06]">
        <h3 className="font-bold text-[#5A6480] mb-4 uppercase tracking-wider text-[10px]">Price Range</h3>
        <Slider
          defaultValue={[0, 200000]}
          max={200000}
          step={1000}
          value={priceRange}
          onValueChange={val => setPriceRange(val)}
          onValueCommit={applyPriceFilter}
          className="mb-4"
        />
        <div className="flex items-center justify-between gap-2">
          <span className="bg-white/5 border border-white/8 px-2 py-1 rounded-lg text-xs text-[#EEF1FA]">
            Rs. {priceRange[0].toLocaleString()}
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="bg-white/5 border border-white/8 px-2 py-1 rounded-lg text-xs text-[#EEF1FA]">
            Rs. {priceRange[1].toLocaleString()}
          </span>
        </div>
      </div>

      {/* RATING */}
      <div className="py-5 border-b border-white/[0.06]">
        <h3 className="font-bold text-[#5A6480] mb-3 uppercase tracking-wider text-[10px]">Rating</h3>
        <div className="space-y-2">
          {RATING_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilters(f => ({ ...f, minRating: f.minRating === opt.value ? undefined : opt.value }))}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all border ${filters.minRating === opt.value ? "bg-emerald-900/50 border-emerald-800/40 text-emerald-300" : "border-transparent text-[#8A93B4] hover:bg-white/5 hover:text-[#EEF1FA]"}`}
            >
              <div className="flex text-[#E8B84A]">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 fill-current ${i > opt.value ? "opacity-20" : ""}`} />
                ))}
              </div>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* QUICK TOGGLES */}
      <div className="py-5 border-b border-white/[0.06]">
        <h3 className="font-bold text-[#5A6480] mb-3 uppercase tracking-wider text-[10px]">Availability</h3>
        <div className="space-y-2.5">
          {[
            { key: "onSale", label: "On Sale / Discounted", badge: "SALE" },
            { key: "inStock", label: "In Stock Only", badge: null },
          ].map(({ key, label, badge }) => (
            <div
              key={key}
              onClick={() => setFilters(f => ({ ...f, [key]: !f[key as keyof Filters] }))}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-9 h-5 rounded-full transition-all flex-shrink-0 relative ${filters[key as keyof Filters] ? "bg-emerald-600" : "bg-white/[0.08]"}`}>
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${filters[key as keyof Filters] ? "left-4" : "left-0.5"}`} />
              </div>
              <span className={`text-sm transition-colors ${filters[key as keyof Filters] ? "text-emerald-300" : "text-[#8A93B4] group-hover:text-[#EEF1FA]"}`}>
                {label}
              </span>
              {badge && filters[key as keyof Filters] && (
                <span className="text-[9px] bg-[#E8B84A] text-[#0C0E18] font-black px-1 py-0.5 rounded leading-none">
                  {badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BRANDS */}
      <div className="pt-5">
        <h3 className="font-bold text-[#5A6480] mb-3 uppercase tracking-wider text-[10px]">Brands</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {brands?.map(brand => (
            <div key={brand.id} className="flex items-center gap-3">
              <Checkbox
                id={`brand-${brand.slug}`}
                checked={filters.selectedBrands.includes(brand.slug)}
                onCheckedChange={() => toggleBrand(brand.slug)}
                className="border-white/20 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <label
                htmlFor={`brand-${brand.slug}`}
                className={`text-sm font-medium cursor-pointer flex-1 transition-colors ${filters.selectedBrands.includes(brand.slug) ? "text-emerald-300" : "text-[#8A93B4] hover:text-[#EEF1FA]"}`}
              >
                {brand.name}
              </label>
              <span className="text-[10px] text-[#3A4060]">{brand.productCount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#0C0E18] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-[#12162A] border border-white/[0.06] rounded-2xl p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <SidebarContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-[#12162A] border border-white/[0.06] p-4 rounded-2xl mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile filter button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex-shrink-0 border-white/10 text-[#EEF1FA] bg-white/5 hover:bg-white/8 rounded-xl gap-2"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg font-display font-bold text-[#EEF1FA] leading-tight truncate">
                  {filters.search ? `"${filters.search}"` : activeCatName ?? "All Products"}
                </h1>
                <p className="text-xs text-[#5A6480] mt-0.5">
                  {productsData?.total ?? 0} products found
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-[#5A6480] hidden sm:block">Sort:</span>
              <Select value={filters.sort} onValueChange={(v: any) => setFilters(f => ({ ...f, sort: v }))}>
                <SelectTrigger className="w-[160px] bg-[#181B2E] border-white/10 text-[#EEF1FA] rounded-xl text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popularity</SelectItem>
                  <SelectItem value="newest">New Arrivals</SelectItem>
                  <SelectItem value="price_asc">Price: Low → High</SelectItem>
                  <SelectItem value="price_desc">Price: High → Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.category && (
                <Badge className="bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  {activeCatName}
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setFilters(f => ({ ...f, category: undefined }))} />
                </Badge>
              )}
              {filters.selectedBrands.map(slug => (
                <Badge key={slug} className="bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  {brands?.find(b => b.slug === slug)?.name ?? slug}
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => toggleBrand(slug)} />
                </Badge>
              ))}
              {filters.minPrice !== undefined && (
                <Badge className="bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  Rs. {filters.minPrice.toLocaleString()} – {filters.maxPrice?.toLocaleString() ?? "200,000"}
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => { setFilters(f => ({ ...f, minPrice: undefined, maxPrice: undefined })); setPriceRange([0, 200000]); }} />
                </Badge>
              )}
              {filters.minRating && (
                <Badge className="bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  {filters.minRating}★ & above
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setFilters(f => ({ ...f, minRating: undefined }))} />
                </Badge>
              )}
              {filters.onSale && (
                <Badge className="bg-[#E8B84A]/20 text-[#E8B84A] border border-[#E8B84A]/30 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  On Sale
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setFilters(f => ({ ...f, onSale: false }))} />
                </Badge>
              )}
              {filters.inStock && (
                <Badge className="bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  In Stock
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setFilters(f => ({ ...f, inStock: false }))} />
                </Badge>
              )}
              {filters.search && (
                <Badge className="bg-white/10 text-[#8A93B4] border border-white/10 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  "{filters.search}"
                  <Link href="/shop"><X className="w-3 h-3 cursor-pointer hover:text-white" /></Link>
                </Badge>
              )}
              <button onClick={clearAll} className="text-xs text-[#5A6480] hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-900/20 font-medium">
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[340px] bg-[#12162A] animate-pulse rounded-2xl border border-white/[0.04]" />
              ))}
            </div>
          ) : productsData?.items.length === 0 ? (
            <div className="bg-[#12162A] border border-white/[0.06] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-[#5A6480]" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#EEF1FA] mb-2">No products found</h3>
              <p className="text-[#5A6480] mb-6 max-w-md">Try removing some filters or browsing a different category.</p>
              <Button onClick={clearAll} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full border-none">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {productsData?.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full bg-[#12162A] border-l border-white/[0.06] h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-[#EEF1FA]">Filters</span>
              </div>
              <button onClick={() => setMobileFiltersOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#8A93B4] hover:text-[#EEF1FA] hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
            <Button
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full border-none"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {productsData?.total ?? 0} results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
