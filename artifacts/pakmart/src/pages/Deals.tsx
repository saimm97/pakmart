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
      <div className="min-h-[50vh] bg-[#0C0E18] flex items-center justify-center text-emerald-400 font-display text-xl animate-pulse">
        Loading Flash Deals...
      </div>
    );
  }

  return (
    <div className="bg-[#0C0E18] min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="bg-[#070A12] py-16 lg:py-24 relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E8B84A]/8 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-emerald-500/8 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 bg-[#E8B84A]/10 border border-[#E8B84A]/20 text-[#E8B84A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" fill="currentColor" /> Live Now
          </span>
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-[#EEF1FA] mb-5 leading-tight">
            Eid Special<br />
            <span className="text-[#E8B84A] italic font-normal">Flash Deals</span>
          </h1>
          <p className="text-[#5A6480] max-w-xl mx-auto mb-10 text-base leading-relaxed">
            Incredible discounts on top brands. Quantities are limited — prices disappear when the timer hits zero.
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
                  <div className={`w-[70px] h-[80px] lg:w-[88px] lg:h-[100px] ${accent ? "bg-[#E8B84A] shadow-[0_0_40px_rgba(232,184,74,0.45)] border border-[#E8B84A]/60" : "bg-white/5 border border-white/8 backdrop-blur-sm"} rounded-2xl flex items-center justify-center font-mono-timer text-3xl lg:text-4xl font-bold text-[#EEF1FA] mb-2`}>
                    {formatTime(val)}
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${accent ? "text-[#E8B84A]" : "text-[#3A4060]"}`}>{label}</span>
                </div>
                {i < arr.length - 1 && <div className="text-3xl font-bold text-white/8 mt-5">:</div>}
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
              <Card className="group overflow-hidden border border-white/[0.06] hover:border-[#E8B84A]/40 hover:shadow-[0_16px_48px_rgba(232,184,74,0.15)] hover:-translate-y-1.5 transition-all duration-300 bg-[#13162A] flex flex-col h-full rounded-2xl cursor-pointer">
                <div className="relative aspect-square bg-[#1A1E35] flex items-center justify-center overflow-hidden p-5 rounded-t-2xl">
                  {product.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-[#E8B84A] text-[#0C0E18] font-black z-10 rounded-lg px-2 py-0.5 text-[10px] border-none uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" fill="currentColor" /> {product.discount}% OFF
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
                  <h3 className="font-display font-semibold text-[#EEF1FA] text-sm line-clamp-2 mb-3 leading-snug group-hover:text-emerald-300 transition-colors">{product.name}</h3>

                  {/* Stock progress */}
                  <div className="mb-3">
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E8B84A] h-full rounded-full transition-all"
                        style={{ width: `${Math.min(95, (product.sold / Math.max(1, product.sold + product.stock)) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] mt-1 font-medium">
                      <span className="text-[#5A6480]">{product.sold.toLocaleString()} sold</span>
                      <span className="text-[#E8B84A] font-bold">Almost gone!</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-white/[0.06]">
                    <div>
                      <div className="text-base font-bold text-[#E8B84A] leading-none">{formatPrice(product.price)}</div>
                      {product.oldPrice && (
                        <div className="text-xs text-[#5A6480] line-through mt-0.5">{formatPrice(product.oldPrice)}</div>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addCart.isPending}
                      className="w-9 h-9 bg-[#E8B84A] hover:bg-[#F5C96A] disabled:opacity-60 text-[#0C0E18] rounded-xl flex items-center justify-center transition-all shadow-[0_2px_12px_rgba(232,184,74,0.3)] flex-shrink-0 active:scale-95 group-hover:shadow-[0_4px_20px_rgba(232,184,74,0.45)]"
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
