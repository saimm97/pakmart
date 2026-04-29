import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  useListProducts, 
  useListCategories, 
  useListBrands, 
  useAddCartItem 
} from "@workspace/api-client-react";
import { Star, Heart, Eye, Filter, ArrowRight, X } from "lucide-react";
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
  const addCart = useAddCartItem();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addCart.mutate({ data: { productId: product.id, quantity: 1 } }, {
      onSuccess: () => toast.success(`Added ${product.name} to cart`),
      onError: () => toast.error(`Failed to add ${product.name}`)
    });
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group overflow-hidden border border-black/5 hover:border-emerald-600/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-400 bg-white flex flex-col h-full rounded-2xl cursor-pointer">
        <div className="relative p-6 aspect-[4/5] bg-[#F8F9FA] flex items-center justify-center">
          {product.discount > 0 && (
            <Badge className="absolute top-4 left-4 bg-saffron-500 text-white hover:bg-saffron-600 font-medium z-10 rounded px-2 py-0.5 text-[10px] shadow-sm border-none uppercase tracking-wider">
              {product.discount}% OFF
            </Badge>
          )}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
            <button className="w-8 h-8 bg-white border border-black/5 rounded-full flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-600 transition-colors shadow-sm">
              <Heart className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 bg-white border border-black/5 rounded-full flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-600 transition-colors shadow-sm">
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <img src={getImageUrl(product.image)} alt={product.name} className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" />
        </div>
        <CardContent className="p-5 flex-1 flex flex-col relative bg-white">
          <span className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-semibold mb-1.5">{product.brand}</span>
          <h3 className="font-display font-medium text-[#1A1A1A] text-[15px] line-clamp-2 min-h-[44px] mb-2 leading-snug group-hover:text-emerald-600 transition-colors">{product.name}</h3>
          
          <div className="flex items-center gap-1 mb-4">
            <div className="flex text-saffron-500">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 fill-current ${i > Math.round(product.rating) ? 'opacity-30' : ''}`} />
              ))}
            </div>
            <span className="text-[11px] text-[#6B6B6B]">({product.reviewCount})</span>
          </div>

          <div className="mt-auto flex flex-col">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-semibold text-[#1A1A1A] tracking-tight">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-xs text-[#6B6B6B] line-through">{formatPrice(product.oldPrice)}</span>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleAddToCart}
              className="w-full mt-4 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors opacity-0 group-hover:opacity-100 h-10 pointer-events-none group-hover:pointer-events-auto absolute bottom-5 left-5 right-5 w-[calc(100%-40px)] bg-white font-medium">
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function Shop({ categorySlug }: { categorySlug?: string }) {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const q = searchParams.get("q") || "";
  
  const [filters, setFilters] = useState<{
    category: string | undefined;
    brand: string | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    sort: any;
    search: string;
  }>({
    category: categorySlug,
    brand: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sort: "popular",
    search: q
  });

  useEffect(() => {
    setFilters(f => ({ ...f, category: categorySlug, search: q }));
  }, [categorySlug, q]);

  const { data: productsData, isLoading: productsLoading } = useListProducts({
    ...filters,
    limit: 24,
  });
  
  const { data: categories } = useListCategories();
  const { data: brands } = useListBrands();

  const [priceRange, setPriceRange] = useState([0, 200000]);

  const handlePriceChange = (val: number[]) => {
    setPriceRange(val);
  };
  
  const applyPriceFilter = () => {
    setFilters(f => ({ ...f, minPrice: priceRange[0], maxPrice: priceRange[1] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
      
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
        <div className="flex items-center justify-between lg:hidden mb-4">
          <h2 className="text-xl font-display font-bold">Filters</h2>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>

        <div className="hidden lg:block space-y-8">
          <div>
            <h3 className="font-bold text-[#1A1A1A] mb-4 uppercase tracking-wider text-xs">Categories</h3>
            <div className="space-y-3">
              <div 
                className={`flex items-center gap-3 cursor-pointer text-sm ${!filters.category ? 'text-emerald-600 font-semibold' : 'text-[#6B6B6B] hover:text-emerald-600'}`}
                onClick={() => setFilters(f => ({ ...f, category: undefined }))}
              >
                <span>All Categories</span>
              </div>
              {categories?.map(cat => (
                <div 
                  key={cat.id}
                  className={`flex items-center gap-3 cursor-pointer text-sm ${filters.category === cat.slug ? 'text-emerald-600 font-semibold' : 'text-[#6B6B6B] hover:text-emerald-600'}`}
                  onClick={() => setFilters(f => ({ ...f, category: cat.slug }))}
                >
                  <span className="flex-1">{cat.name}</span>
                  <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full">{cat.productCount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-black/5">
            <h3 className="font-bold text-[#1A1A1A] mb-4 uppercase tracking-wider text-xs">Price Range</h3>
            <Slider 
              defaultValue={[0, 200000]} 
              max={200000} 
              step={1000}
              value={priceRange}
              onValueChange={handlePriceChange}
              onValueCommit={applyPriceFilter}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm font-medium text-[#1A1A1A]">
              <span>Rs. {priceRange[0]}</span>
              <span>Rs. {priceRange[1]}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-black/5">
            <h3 className="font-bold text-[#1A1A1A] mb-4 uppercase tracking-wider text-xs">Brands</h3>
            <div className="space-y-3">
              {brands?.map(brand => (
                <div key={brand.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={`brand-${brand.slug}`} 
                    checked={filters.brand === brand.slug}
                    onCheckedChange={(checked) => setFilters(f => ({ ...f, brand: checked ? brand.slug : undefined }))}
                    className="border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />
                  <label htmlFor={`brand-${brand.slug}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#6B6B6B] cursor-pointer flex-1">
                    {brand.name}
                  </label>
                  <span className="text-[10px] text-gray-400">{brand.productCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white p-4 rounded-xl border border-black/5 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#1A1A1A]">
              {filters.search ? `Search: "${filters.search}"` : 
               filters.category ? categories?.find(c => c.slug === filters.category)?.name : 
               'All Products'}
            </h1>
            <p className="text-sm text-[#6B6B6B] mt-1">Showing {productsData?.items.length || 0} of {productsData?.total || 0} products</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#6B6B6B]">Sort by:</span>
            <Select value={filters.sort} onValueChange={(v: any) => setFilters(f => ({ ...f, sort: v }))}>
              <SelectTrigger className="w-[160px] bg-[#FAF7F1] border-none focus:ring-emerald-600 focus:ring-offset-0 rounded-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popularity</SelectItem>
                <SelectItem value="newest">New Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters tags */}
        {(filters.category || filters.brand || filters.search || filters.minPrice) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.category && (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 rounded-full px-3 py-1">
                Category: {categories?.find(c => c.slug === filters.category)?.name}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setFilters(f => ({ ...f, category: undefined }))} />
              </Badge>
            )}
            {filters.brand && (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 rounded-full px-3 py-1">
                Brand: {brands?.find(b => b.slug === filters.brand)?.name}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setFilters(f => ({ ...f, brand: undefined }))} />
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 rounded-full px-3 py-1">
                Search: {filters.search}
                <Link href="/shop" className="ml-1"><X className="w-3 h-3 cursor-pointer" /></Link>
              </Badge>
            )}
            {filters.minPrice !== undefined && (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 rounded-full px-3 py-1">
                Price: Rs.{filters.minPrice} - Rs.{filters.maxPrice}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => { setFilters(f => ({ ...f, minPrice: undefined, maxPrice: undefined })); setPriceRange([0, 200000]); }} />
              </Badge>
            )}
          </div>
        )}

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : productsData?.items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold font-display text-[#1A1A1A] mb-2">No products found</h3>
            <p className="text-[#6B6B6B] mb-6 max-w-md">We couldn't find any products matching your current filters. Try removing some filters to see more results.</p>
            <Button onClick={() => setFilters({ category: undefined, brand: undefined, minPrice: undefined, maxPrice: undefined, sort: "popular", search: "" })} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData?.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
