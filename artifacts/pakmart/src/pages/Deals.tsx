import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useGetFlashDeal, useAddCartItem } from "@workspace/api-client-react";
import { Zap, Heart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";

export function Deals() {
  const { data: deal, isLoading } = useGetFlashDeal();
  const addCart = useAddCartItem();
  
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!deal?.endsAt) return;
    
    const updateTimer = () => {
      const end = new Date(deal.endsAt).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [deal?.endsAt]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addCart.mutate({ data: { productId: product.id, quantity: 1 } }, {
      onSuccess: () => toast.success(`Added ${product.name} to cart`),
      onError: () => toast.error(`Failed to add ${product.name}`)
    });
  };

  if (isLoading || !deal) {
    return <div className="min-h-[50vh] flex items-center justify-center text-emerald-600 font-display text-xl animate-pulse">Loading Flash Deals...</div>;
  }

  return (
    <div className="bg-[#FAF7F1] min-h-screen pb-20">
      {/* Banner */}
      <div className="bg-[#1A1A1A] py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-saffron-500/20 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-emerald-500/20 blur-[100px] rounded-full mix-blend-screen"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <Badge className="bg-white/10 text-saffron-400 hover:bg-white/10 border-saffron-400/30 mb-6 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4" fill="currentColor" /> Live Now
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-6">Eid Special Flash Deals</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">Incredible discounts on top brands. Quantities are limited and these prices disappear when the timer hits zero!</p>
          
          <div className="flex justify-center gap-4 lg:gap-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-20 lg:w-20 lg:h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner mb-3 font-mono-timer text-3xl lg:text-4xl font-bold text-white">
                {formatTime(timeLeft.hours)}
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Hours</span>
            </div>
            <div className="text-4xl font-bold text-white/30 mt-4">:</div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-20 lg:w-20 lg:h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner mb-3 font-mono-timer text-3xl lg:text-4xl font-bold text-white">
                {formatTime(timeLeft.minutes)}
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Mins</span>
            </div>
            <div className="text-4xl font-bold text-white/30 mt-4">:</div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-20 lg:w-20 lg:h-24 bg-saffron-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(232,163,61,0.5)] mb-3 font-mono-timer text-3xl lg:text-4xl font-bold text-white border border-saffron-400">
                {formatTime(timeLeft.seconds)}
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-saffron-400 font-semibold">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deal.items.map((product) => (
            <Link href={`/product/${product.slug}`} key={product.id}>
              <Card className="group overflow-hidden border-2 border-transparent hover:border-saffron-500/50 hover:shadow-[0_8px_30px_rgba(232,163,61,0.15)] transition-all duration-400 bg-white flex flex-col h-full rounded-2xl cursor-pointer">
                <div className="relative p-6 aspect-[4/5] bg-[#F8F9FA] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-saffron-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {product.discount > 0 && (
                    <Badge className="absolute top-4 left-4 bg-saffron-500 text-white hover:bg-saffron-600 font-bold z-10 rounded px-2.5 py-1 text-xs shadow-md border-none uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3" fill="currentColor" /> {product.discount}% OFF
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
                  <img src={getImageUrl(product.image)} alt={product.name} className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out relative z-10" />
                  
                  {/* Stock progress bar */}
                  <div className="absolute bottom-0 left-0 w-full px-6 pb-4">
                    <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-saffron-500 h-full rounded-full relative" 
                        style={{ width: `${(product.sold / (product.sold + product.stock)) * 100}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] mt-1.5 font-medium text-[#6B6B6B]">
                      <span>{product.sold} Sold</span>
                      <span className="text-saffron-600">Almost gone!</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col relative bg-white">
                  <span className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-semibold mb-1.5">{product.brand}</span>
                  <h3 className="font-display font-medium text-[#1A1A1A] text-[15px] line-clamp-2 min-h-[44px] mb-2 leading-snug group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                  
                  <div className="mt-auto flex flex-col">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl font-bold text-saffron-600 tracking-tight">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-xs text-[#6B6B6B] line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full mt-4 border-black/10 text-[#1A1A1A] hover:bg-saffron-500 hover:border-saffron-500 hover:text-white rounded-xl transition-all h-10 font-bold shadow-sm">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
