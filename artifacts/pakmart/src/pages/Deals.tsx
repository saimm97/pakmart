import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useGetFlashDeal, useAddCartItem, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Zap, Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";

export function Deals() {
  const queryClient = useQueryClient();
  const { data: deal, isLoading } = useGetFlashDeal();
  const addCart = useAddCartItem();

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!deal?.endsAt) return;
    const updateTimer = () => {
      const distance = new Date(deal.endsAt).getTime() - Date.now();
      if (distance < 0) { setTimeLeft({ hours: 0, minutes: 0, seconds: 0 }); return; }
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

  const formatTime = (t: number) => t.toString().padStart(2, "0");

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
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

  if (isLoading || !deal) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-emerald-600 font-display text-xl animate-pulse">
        Loading Flash Deals...
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F1] min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="bg-[#111] py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-saffron-500/12 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-emerald-500/12 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/8 border border-saffron-400/30 text-saffron-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" fill="currentColor" /> Live Now
          </span>
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-5 leading-tight">
            Eid Special<br />
            <span className="text-saffron-400 italic font-normal">Flash Deals</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-10 text-base leading-relaxed">
            Incredible discounts on top brands. Quantities are limited — these prices disappear when the timer hits zero.
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-4 lg:gap-5">
            {[
              { val: timeLeft.hours, label: "Hours" },
              { val: timeLeft.minutes, label: "Mins" },
              { val: timeLeft.seconds, label: "Secs", accent: true },
            ].map(({ val, label, accent }, i, arr) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div className={`w-[70px] h-[80px] lg:w-[88px] lg:h-[100px] ${accent ? 'bg-saffron-500 shadow-[0_0_36px_rgba(232,163,61,0.55)] border border-saffron-400' : 'bg-white/8 border border-white/10 backdrop-blur-sm'} rounded-2xl flex items-center justify-center font-mono-timer text-3xl lg:text-4xl font-bold text-white mb-2`}>
                    {formatTime(val)}
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${accent ? 'text-saffron-400' : 'text-gray-500'}`}>{label}</span>
                </div>
                {i < arr.length - 1 && <div className="text-3xl font-bold text-white/20 mt-5">:</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {deal.items.map((product) => (
            <Link href={`/product/${product.slug}`} key={product.id}>
              <Card className="group overflow-hidden border border-transparent hover:border-saffron-400/40 hover:shadow-[0_12px_40px_rgba(232,163,61,0.15)] transition-all duration-300 bg-white flex flex-col h-full rounded-2xl cursor-pointer">
                {/* Image */}
                <div className="relative aspect-square bg-[#F8F9FA] flex items-center justify-center overflow-hidden p-5">
                  <div className="absolute inset-0 bg-gradient-to-t from-saffron-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {product.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-saffron-500 text-white hover:bg-saffron-600 font-bold z-10 rounded-lg px-2 py-0.5 text-[10px] shadow-md border-none uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" fill="currentColor" /> {product.discount}% OFF
                    </Badge>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm border border-black/5 z-10 opacity-0 group-hover:opacity-100"
                  >
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-[75%] h-[75%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out relative z-10"
                  />
                </div>

                {/* Card content */}
                <CardContent className="p-4 flex-1 flex flex-col bg-white">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-1">{product.brand}</span>
                  <h3 className="font-display font-semibold text-[#1A1A1A] text-sm line-clamp-2 mb-3 leading-snug group-hover:text-emerald-700 transition-colors">{product.name}</h3>

                  {/* Stock progress bar — now in card body, not overlapping image */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-saffron-500 h-full rounded-full"
                        style={{ width: `${Math.min(95, (product.sold / Math.max(1, product.sold + product.stock)) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] mt-1 font-medium text-[#6B6B6B]">
                      <span>{product.sold.toLocaleString()} sold</span>
                      <span className="text-saffron-600 font-bold">Almost gone!</span>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-black/5">
                    <div>
                      <div className="text-base font-bold text-saffron-600 leading-none">{formatPrice(product.price)}</div>
                      {product.oldPrice && (
                        <div className="text-xs text-[#6B6B6B] line-through mt-0.5">{formatPrice(product.oldPrice)}</div>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addCart.isPending}
                      className="w-9 h-9 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-60 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm flex-shrink-0 active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
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
