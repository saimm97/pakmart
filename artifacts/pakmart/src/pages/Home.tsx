import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useGetHomeFeed, useAddCartItem, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Heart, ShoppingCart, Star, ArrowRight,
  ShieldCheck, Truck, CreditCard, Wallet, CheckCircle2, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";

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
            <Badge className="absolute top-3 left-3 bg-[#E8B84A] text-[#0C0E18] font-black z-10 rounded-lg px-2 py-0.5 text-[10px] border-none uppercase tracking-wider shadow-sm">
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

function SectionHeader({ eyebrow, title, actionText, actionHref }: {
  eyebrow: string; title: string; actionText?: string; actionHref?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-[3px] w-8 bg-emerald-500 rounded-full" />
          <span className="text-emerald-400 font-bold text-[11px] tracking-[0.2em] uppercase">{eyebrow}</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-display font-bold text-[#EEF1FA]">{title}</h2>
      </div>
      {actionText && actionHref && (
        <Link href={actionHref} className="text-[#8A93B4] font-semibold text-sm hover:text-emerald-400 transition-colors flex items-center gap-1.5 group pb-1 border-b border-white/10 hover:border-emerald-500/40 w-fit">
          {actionText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}

const BRANDS = [
  { name: "Khaadi", color: "bg-rose-950/60 text-rose-300 border-rose-800/30" },
  { name: "Sapphire", color: "bg-blue-950/60 text-blue-300 border-blue-800/30" },
  { name: "Samsung", color: "bg-indigo-950/60 text-indigo-300 border-indigo-800/30" },
  { name: "Gul Ahmed", color: "bg-amber-950/60 text-amber-300 border-amber-800/30" },
  { name: "Xiaomi", color: "bg-orange-950/60 text-orange-300 border-orange-800/30" },
  { name: "National Foods", color: "bg-emerald-950/60 text-emerald-300 border-emerald-800/30" },
  { name: "Service Shoes", color: "bg-slate-800/60 text-slate-300 border-slate-700/30" },
  { name: "Borjan", color: "bg-purple-950/60 text-purple-300 border-purple-800/30" },
];

export function Home() {
  const { data: feed, isLoading } = useGetHomeFeed();
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (t: number) => t.toString().padStart(2, "0");

  if (isLoading || !feed) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-emerald-400 font-display text-xl animate-pulse">
        Loading PakMart...
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 pakmart-theme font-sans bg-[#0C0E18]">

      {/* Hero */}
      <section className="pt-6 pb-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:min-h-[520px]">
          {/* Main Banner */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden group bg-[#141828] flex items-center min-h-[440px] border border-white/[0.05] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0">
              <img
                src={getImageUrl("hero-banner.png")}
                alt="Grand Festive Sale"
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-[1.025] transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E1020] via-[#0E1020]/80 via-25% to-transparent to-55%" />
            </div>
            <div className="relative z-10 p-8 lg:p-12 max-w-md">
              <Badge className="bg-emerald-900/70 text-emerald-300 border border-emerald-700/40 mb-5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm rounded-full backdrop-blur-sm">
                ✦ New Collection
              </Badge>
              <h1 className="text-4xl lg:text-[3.25rem] font-display font-bold text-[#EEF1FA] mb-4 leading-[1.08]">
                Elevate your<br />
                <span className="italic font-normal text-emerald-400">festive style.</span>
              </h1>
              <p className="text-[#8A93B4] text-base mb-7 leading-relaxed max-w-xs">
                Pakistan's finest unstitched fabrics and luxury pret wear. Free shipping on orders above Rs. 2,000.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-7 h-11 text-sm font-semibold shadow-[0_4px_20px_rgba(16,185,129,0.3)] border-none">
                  <Link href="/shop/fashion">Shop Men's</Link>
                </Button>
                <Button asChild variant="outline" className="bg-white/8 backdrop-blur-sm border-white/15 text-[#EEF1FA] hover:bg-white/12 hover:text-white rounded-full px-7 h-11 text-sm font-semibold">
                  <Link href="/shop/fashion">Shop Women's</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Side Promos */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-5">
            <div className="relative rounded-3xl overflow-hidden group cursor-pointer border border-white/[0.05] bg-[#141828] min-h-[200px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <img
                src={getImageUrl("summer-edit.jpg")}
                alt="Summer Edit"
                className="w-full h-full object-cover transform group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E18]/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[#8A93B4] text-[10px] uppercase tracking-widest font-bold mb-1">Trend Alert</span>
                <h3 className="text-xl font-display font-bold text-[#EEF1FA] mb-1">Summer Edit</h3>
                <p className="text-[#8A93B4] text-sm font-medium mb-3">Starting at Rs. 1,499</p>
                <div className="flex items-center text-[#EEF1FA] text-sm font-semibold group-hover:translate-x-1.5 transition-transform">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>

            {/* Same Day Delivery */}
            <div className="relative rounded-3xl overflow-hidden border border-emerald-900/40 bg-gradient-to-br from-emerald-950 via-emerald-900/80 to-[#0C1A14] p-6 flex flex-col justify-center items-start group cursor-pointer hover:border-emerald-700/50 transition-colors shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
              <div className="absolute bottom-0 right-8 w-20 h-20 bg-[#E8B84A]/10 rounded-full translate-y-1/3 blur-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-800/80 border border-emerald-700/40 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-700/80 transition-colors">
                  <Truck className="w-6 h-6 text-emerald-300" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#EEF1FA] mb-2">Same-Day Delivery</h3>
                <p className="text-emerald-300/70 text-sm leading-relaxed mb-4">Lahore · Karachi · Islamabad<br />for thousands of products.</p>
                <span className="text-xs font-bold text-[#E8B84A] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#12162A] border border-white/[0.05] rounded-2xl px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {[
              { icon: ShieldCheck, label: "100% Authentic", sub: "Genuine products only", color: "bg-emerald-900/50 text-emerald-400 border-emerald-800/30" },
              { icon: Truck,       label: "Free Delivery",   sub: "On orders over Rs. 2,000", color: "bg-blue-900/50 text-blue-400 border-blue-800/30" },
              { icon: CreditCard,  label: "Secure Payment",  sub: "Card & Cash on Delivery",  color: "bg-violet-900/50 text-violet-400 border-violet-800/30" },
              { icon: Wallet,      label: "Easy Returns",    sub: "14-day return policy",       color: "bg-[#2A1F08] text-[#E8B84A] border-[#3A2F10]" },
            ].map(({ icon: Icon, label, sub, color }, i, arr) => (
              <div key={label} className={`flex items-center gap-4 ${i < arr.length - 1 ? "md:border-r border-white/[0.05] md:pr-4" : ""}`}>
                <div className={`w-11 h-11 rounded-xl ${color} border flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="font-bold text-[#EEF1FA] text-sm">{label}</h4>
                  <p className="text-[#5A6480] text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#080A12] rounded-3xl p-8 lg:p-10 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center border border-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8B84A]/6 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="md:w-[300px] flex-shrink-0 relative z-10 flex flex-col">
            <span className="inline-flex items-center gap-1.5 bg-[#E8B84A]/12 border border-[#E8B84A]/20 text-[#E8B84A] text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full w-fit mb-4">
              <Zap className="w-3.5 h-3.5" fill="currentColor" /> Flash Deal
            </span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-[#EEF1FA] mb-3 leading-tight">
              Prices Drop<br /><span className="text-[#E8B84A] italic font-normal">Fast.</span>
            </h2>
            <p className="text-[#5A6480] text-sm mb-8 leading-relaxed">Grab exclusive discounts before the timer runs out. Limited stock available.</p>
            <div className="flex gap-3 mb-8">
              {[
                { val: timeLeft.hours, label: "Hours" },
                { val: timeLeft.minutes, label: "Mins" },
                { val: timeLeft.seconds, label: "Secs", accent: true },
              ].map(({ val, label, accent }, i, arr) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center">
                    <div className={`w-[60px] h-[68px] ${accent ? "bg-[#E8B84A] shadow-[0_0_28px_rgba(232,184,74,0.4)] border border-[#E8B84A]/50" : "bg-white/[0.05] border border-white/[0.08]"} rounded-2xl flex items-center justify-center font-mono-timer text-2xl font-bold text-[#EEF1FA] mb-1.5 backdrop-blur-sm`}>
                      {formatTime(val)}
                    </div>
                    <span className={`text-[9px] uppercase tracking-widest font-semibold ${accent ? "text-[#E8B84A]" : "text-[#3A4060]"}`}>{label}</span>
                  </div>
                  {i < arr.length - 1 && <div className="text-xl font-bold text-white/10 mt-3">:</div>}
                </React.Fragment>
              ))}
            </div>
            <Button asChild className="bg-[#EEF1FA] text-[#0C0E18] hover:bg-white rounded-full px-7 h-11 font-bold text-sm group w-fit border-none shadow-[0_4px_16px_rgba(238,241,250,0.15)]">
              <Link href="/deals">
                View All Deals <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="flex-1 relative z-10 w-full overflow-x-auto hide-scrollbar pb-2">
            <div className="flex gap-4 min-w-max pr-4">
              {feed.flashDeal.items.slice(0, 5).map((product) => (
                <div key={product.id} className="w-[210px] flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <SectionHeader eyebrow="Shop By Category" title="Everything you need" actionText="Browse all" actionHref="/shop" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 lg:gap-4">
          {feed.categories.slice(0, 7).map((cat) => (
            <Link href={`/shop/${cat.slug}`} key={cat.id} className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square bg-[#12162A] border border-white/[0.06] rounded-2xl shadow-sm p-3 mb-2.5 flex items-center justify-center group-hover:border-emerald-500/30 group-hover:shadow-[0_8px_32px_rgba(16,185,129,0.1)] transition-all group-hover:-translate-y-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <img
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  className="w-14 h-14 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal"
                />
              </div>
              <span className="text-xs font-semibold text-[#8A93B4] text-center leading-tight group-hover:text-emerald-400 transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-6">
          <span className="text-[#3A4060] text-xs uppercase tracking-[0.2em] font-semibold">Brands you trust</span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {BRANDS.map((b) => (
            <Link key={b.name} href={`/shop?brand=${b.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className={`${b.color} border rounded-2xl py-3 px-2 text-center text-xs font-bold tracking-wide hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer`}>
                {b.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Banner + Trending */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1 rounded-3xl overflow-hidden relative group cursor-pointer h-[360px] lg:h-auto border border-white/[0.05] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <img
              src={getImageUrl("promo-band-1.jpg")}
              alt="Tech Deals"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E18] via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <Badge className="bg-white/10 backdrop-blur-md text-white hover:bg-white/15 mb-3 border-white/15 text-[10px] uppercase tracking-wider rounded-full">Tech Deals</Badge>
              <h3 className="text-2xl font-display font-bold text-[#EEF1FA] mb-2 leading-snug">Latest<br />Smartphones</h3>
              <p className="text-[#8A93B4] text-sm mb-5">Up to 15% off Samsung & Infinix</p>
              <Button asChild className="bg-[#EEF1FA] text-[#0C0E18] hover:bg-white rounded-full text-xs font-bold px-5 h-9 border-none">
                <Link href="/shop/mobiles">Shop Tech</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <SectionHeader eyebrow="Trending Now" title="Most loved products" actionText="See all" actionHref="/shop" />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {feed.trending.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#080A12] py-20 relative overflow-hidden border-t border-b border-white/[0.04]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#E8B84A]/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-emerald-800" />
              <span className="text-emerald-500 font-semibold text-[11px] tracking-[0.2em] uppercase">Happy Customers</span>
              <div className="h-px w-10 bg-emerald-800" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-[#EEF1FA] mb-3">Trusted across Pakistan</h2>
            <p className="text-[#5A6480] max-w-xl mx-auto text-sm">Join millions of satisfied customers who trust PakMart for their everyday needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {feed.testimonials.slice(0, 3).map((t, i) => (
              <Card key={t.id || i} className="bg-[#12162A] border border-white/[0.06] text-[#EEF1FA] shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="p-7">
                  <div className="flex text-[#E8B84A] mb-5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-base leading-relaxed mb-7 text-[#8A93B4]">"{t.comment}"</p>
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-emerald-900/60 border border-emerald-800/40 rounded-full flex items-center justify-center font-bold text-emerald-300 text-sm flex-shrink-0">
                      {t.initials || "C"}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#EEF1FA] text-sm">{t.name}</h4>
                      <p className="text-emerald-500 text-xs flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified Buyer, {t.city}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
