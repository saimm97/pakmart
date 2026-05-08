import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  useGetProduct, 
  useGetRelatedProducts, 
  useAddCartItem,
  getGetProductQueryKey,
  getGetCartQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Star, Heart, Share2, Truck, ShieldCheck, RefreshCw, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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
    return <div className="min-h-[50vh] flex items-center justify-center text-emerald-600 font-display text-xl animate-pulse">Loading product...</div>;
  }

  const handleAddToCart = () => {
    addCart.mutate({ data: { productId: product.id, quantity } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast.success(`Added ${quantity} × ${product.name} to cart`);
      },
      onError: () => toast.error(`Failed to add item to cart`)
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
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-[#6B6B6B] mb-8 font-medium">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop/${product.categorySlug}`} className="hover:text-emerald-600">{product.categoryName}</Link>
        <span className="mx-2">/</span>
        <span className="text-[#1A1A1A] line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
        {/* Product Images */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="aspect-square bg-white rounded-3xl border border-black/5 flex items-center justify-center p-8 relative overflow-hidden shadow-sm group">
            {product.discount > 0 && (
              <Badge className="absolute top-6 left-6 bg-saffron-500 text-white font-bold z-10 rounded px-3 py-1 shadow-sm border-none uppercase tracking-wider text-xs">
                {product.discount}% OFF
              </Badge>
            )}
            <img 
              src={getImageUrl(allImages[activeImage])} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out" 
            />
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
            {allImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 flex-shrink-0 bg-white rounded-xl border ${activeImage === idx ? 'border-emerald-600 shadow-[0_0_0_1px_#0E5E3F]' : 'border-black/5'} flex items-center justify-center p-2 cursor-pointer transition-all hover:border-emerald-600/50`}
              >
                <img src={getImageUrl(img)} alt="" className="max-w-full max-h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-7">
          <Link href={`/shop?brand=${product.brandSlug}`} className="text-emerald-600 font-bold text-xs uppercase tracking-widest mb-3 block hover:underline">
            {product.brand}
          </Link>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#1A1A1A] mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-saffron-500">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-4 h-4 fill-current ${i > Math.round(product.rating) ? 'opacity-30' : ''}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-[#1A1A1A]">{product.rating} Rating</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-[#6B6B6B] hover:text-emerald-600 cursor-pointer">{product.reviewCount} Reviews</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-[#6B6B6B]">{product.sold} Sold</span>
          </div>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xl text-[#6B6B6B] line-through mb-1">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <p className="text-[#6B6B6B] text-base leading-relaxed mb-10">
            {product.description}
          </p>

          <Separator className="mb-8" />

          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <div className="flex items-center bg-white border border-black/10 rounded-full w-fit">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-12 text-center font-semibold text-[#1A1A1A]">{quantity}</div>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-1 gap-4">
              <Button 
                onClick={handleAddToCart}
                variant="outline" 
                className="flex-1 h-12 rounded-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-base transition-colors"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="flex-1 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-colors shadow-lg shadow-emerald-600/20"
              >
                Buy Now
              </Button>
            </div>
            <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-600 bg-white transition-colors flex-shrink-0 shadow-sm">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[#FAF7F1] rounded-2xl p-6 border border-black/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Truck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm mb-1">Standard Delivery</h4>
                  <p className="text-xs text-[#6B6B6B]">2-4 Working Days. Rs. 149</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm mb-1">100% Authentic</h4>
                  <p className="text-xs text-[#6B6B6B]">Guarantee from PakMart</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <RefreshCw className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm mb-1">14 Days Return</h4>
                  <p className="text-xs text-[#6B6B6B]">Change of mind is not applicable</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-[#1A1A1A]">Related Products</h2>
            <Link href={`/shop/${product.categorySlug}`} className="text-emerald-600 font-medium hover:underline flex items-center gap-1">
              View Category <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {relatedProducts.slice(0, 5).map(prod => (
              <Link href={`/product/${prod.slug}`} key={prod.id}>
                <Card className="group overflow-hidden border border-black/5 hover:border-emerald-600/20 hover:shadow-md transition-all duration-400 bg-white h-full rounded-2xl cursor-pointer">
                  <div className="p-4 aspect-square bg-[#F8F9FA] flex items-center justify-center">
                    <img src={getImageUrl(prod.image)} alt={prod.name} className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                  </div>
                  <CardContent className="p-4 bg-white">
                    <h3 className="font-display font-medium text-[#1A1A1A] text-sm line-clamp-2 mb-2 group-hover:text-emerald-600">{prod.name}</h3>
                    <div className="font-bold text-[#1A1A1A]">{formatPrice(prod.price)}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
