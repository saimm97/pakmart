import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  useGetProduct, useGetRelatedProducts, useAddCartItem,
  getGetProductQueryKey, getGetCartQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Star, Heart, Truck, ShieldCheck, RefreshCw, Minus, Plus, ShoppingCart, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";

export function ProductDetail({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { data: product, isLoading } = useGetProduct(slug, {
    query: { enabled: !!slug, queryKey: getGetProductQueryKey(slug) }
  });
  const { data: relatedProducts } = useGetRelatedProducts(slug);
  const addCart = useAddCartItem();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading || !product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-emerald-400 font-display text-xl animate-pulse bg-[#0C0E18]">
        Loading product...
      </div>
    );
  }

  const handleAddToCart = () => {
    addCart.mutate({ data: { productId: product.id, quantity } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast.success(`Added ${quantity} × ${product.name} to cart`);
      },
      onError: () => toast.error("Failed to add item to cart")
    });
  };

  const handleBuyNow = () => {
    addCart.mutate({ data: { productId: product.id, quantity } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setLocation("/checkout");
      }
    });
  };

  const allImages = [product.image, ...product.images];

  return (
    <div className="bg-[#0C0E18] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-[#5A6480] mb-8 font-medium flex-wrap gap-1">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <Link href={`/shop/${product.categorySlug}`} className="hover:text-emerald-400 transition-colors">{product.categoryName}</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="text-[#8A93B4] line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
          {/* Product Images */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="aspect-square bg-white rounded-3xl border border-white/5 flex items-center justify-center p-8 relative overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)] group">
              {product.discount > 0 && (
                <Badge className="absolute top-6 left-6 bg-[#E8B84A] text-[#0C0E18] font-black z-10 rounded-lg px-3 py-1 border-none uppercase tracking-wider text-xs shadow-md">
                  {product.discount}% OFF
                </Badge>
              )}
              <img
                src={getImageUrl(allImages[activeImage])}
                alt={product.name}
                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar py-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-18 h-18 flex-shrink-0 bg-white rounded-xl border-2 ${activeImage === idx ? "border-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.4)]" : "border-transparent"} flex items-center justify-center p-2 cursor-pointer transition-all hover:border-emerald-500/50`}
                  style={{ width: 72, height: 72 }}
                >
                  <img src={getImageUrl(img)} alt="" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-7">
            <Link href={`/shop?brand=${product.brandSlug}`} className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-3 block hover:text-emerald-300 transition-colors">
              {product.brand}
            </Link>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#EEF1FA] mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-1 text-[#E8B84A]">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 fill-current ${i > Math.round(product.rating) ? "opacity-20" : ""}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-[#EEF1FA]">{product.rating}</span>
              <span className="text-white/10">|</span>
              <span className="text-sm text-[#5A6480]">{product.reviewCount} Reviews</span>
              <span className="text-white/10">|</span>
              <span className="text-sm text-[#5A6480]">{product.sold} Sold</span>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-bold text-[#EEF1FA] tracking-tight">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-xl text-[#5A6480] line-through mb-1">{formatPrice(product.oldPrice)}</span>
              )}
              {product.discount > 0 && (
                <span className="text-sm font-bold text-[#E8B84A] bg-[#E8B84A]/10 border border-[#E8B84A]/20 px-2 py-0.5 rounded-lg mb-1">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <p className="text-[#8A93B4] text-base leading-relaxed mb-8">{product.description}</p>

            <div className="border-t border-white/[0.06] pt-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Qty */}
                <div className="flex items-center bg-[#181B2E] border border-white/[0.08] rounded-full w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-[#5A6480] hover:text-emerald-400 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 text-center font-bold text-[#EEF1FA]">{quantity}</div>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center text-[#5A6480] hover:text-emerald-400 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* CTAs */}
                <div className="flex flex-1 gap-3">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="flex-1 h-12 rounded-full border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300 font-bold text-base bg-transparent"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="flex-1 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base border-none shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
                  >
                    Buy Now
                  </Button>
                </div>
                <button className="w-12 h-12 rounded-full border border-white/[0.08] bg-[#181B2E] flex items-center justify-center text-[#5A6480] hover:text-red-400 hover:border-red-900/50 transition-colors flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-[#12162A] rounded-2xl p-6 border border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { icon: Truck, title: "Standard Delivery", sub: "2-4 Working Days · Rs. 149" },
                  { icon: ShieldCheck, title: "100% Authentic", sub: "Guarantee from PakMart" },
                  { icon: RefreshCw, title: "14 Days Return", sub: "Change of mind not applicable" },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-emerald-900/50 border border-emerald-800/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#EEF1FA] text-sm mb-0.5">{title}</h4>
                      <p className="text-xs text-[#5A6480]">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-[#EEF1FA]">Related Products</h2>
              <Link href={`/shop/${product.categorySlug}`} className="text-emerald-400 font-medium hover:text-emerald-300 flex items-center gap-1 transition-colors">
                View Category <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
              {relatedProducts.slice(0, 5).map(prod => (
                <Link href={`/product/${prod.slug}`} key={prod.id}>
                  <Card className="group overflow-hidden border border-white/[0.06] hover:border-emerald-500/30 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 bg-white h-full rounded-2xl cursor-pointer">
                    <div className="p-4 aspect-square bg-[#F6F7F9] flex items-center justify-center">
                      <img src={getImageUrl(prod.image)} alt={prod.name} className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                    </div>
                    <CardContent className="p-4 bg-white">
                      <h3 className="font-display font-medium text-[#1A1A1A] text-sm line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors">{prod.name}</h3>
                      <div className="font-bold text-[#1A1A1A]">{formatPrice(prod.price)}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
