import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useGetHomeFeed, useAddCartItem } from "@workspace/api-client-react";
import { 
  Heart, Eye, Star, ArrowRight, Clock, ShieldCheck, Truck, 
  CreditCard, Wallet, Smartphone, Tv, Shirt, Grape, Baby, Home as HomeIcon,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";

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
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current opacity-30" />
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

function SectionHeader({ eyebrow, title, subtitle, actionText, actionHref }: { eyebrow: string, title: string, subtitle?: string, actionText?: string, actionHref?: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
      <div>
        <span className="text-emerald-600 font-semibold text-[11px] tracking-[0.2em] uppercase mb-3 block">{eyebrow}</span>
        <h2 className="text-3xl lg:text-4xl font-display font-bold text-[#1A1A1A]">{title}</h2>
        {subtitle && <p className="text-[#6B6B6B] mt-2 text-sm">{subtitle}</p>}
      </div>
      {actionText && actionHref && (
        <Link href={actionHref} className="text-[#1A1A1A] font-medium text-sm hover:text-emerald-600 transition-colors flex items-center gap-1 group pb-1">
          {actionText} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}

export function Home() {
  const { data: feed, isLoading } = useGetHomeFeed();
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    // A simple mock timer that counts down, actual sync could be done with feed.flashDeal.endsAt
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

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  if (isLoading || !feed) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-emerald-600 font-display text-xl animate-pulse">
        Loading PakMart...
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 pakmart-theme font-sans bg-[#FAF7F1]">
      
      {/* Hero Section */}
      <section className="bg-[#FAF7F1] pt-6 pb-12 lg:py-12 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
          {/* Main Hero Banner */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden group bg-[#E6EBE6] flex items-center shadow-sm border border-emerald-900/5">
            <div className="absolute inset-0 w-full h-full">
               <img src={getImageUrl("hero-banner.png")} alt="Grand Festive Sale" className="absolute inset-0 w-full h-full object-cover object-right transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#E6EBE6] via-[#E6EBE6]/90 to-transparent w-2/3"></div>
            </div>
            
            <div className="relative z-10 p-8 lg:p-14 max-w-lg">
              <Badge className="bg-white text-emerald-700 border border-emerald-600/20 mb-6 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm rounded-full">New Collection</Badge>
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-emerald-900 mb-5 leading-[1.1]">
                Elevate your <br/><span className="italic font-normal text-emerald-700">festive style.</span>
              </h1>
              <p className="text-emerald-900/70 text-lg mb-8 leading-relaxed font-medium max-w-md">
                Discover the season's finest unstitched fabrics and pret wear. Free shipping nationwide on orders above Rs. 2,000.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-8 h-12 text-sm font-semibold border-none shadow-[0_4px_14px_0_rgba(10,74,51,0.2)] transition-transform hover:-translate-y-0.5">
                  Shop Men's
                </Button>
                <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-emerald-700/20 text-emerald-900 hover:bg-white hover:text-emerald-800 rounded-full px-8 h-12 text-sm font-semibold transition-all">
                  Shop Women's
                </Button>
              </div>
            </div>
          </div>
          
          {/* Side Promos */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-6 h-full">
            <div className="relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-black/5 bg-gray-100">
              <img src={getImageUrl("summer-edit.jpg")} alt="Summer Edit" className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-1">Trend Alert</span>
                <h3 className="text-2xl font-display font-bold text-white mb-1">Summer Edit</h3>
                <p className="text-white/90 text-sm font-medium mb-3">Starting at Rs. 1,499</p>
                <div className="flex items-center text-white text-sm font-semibold group-hover:translate-x-2 transition-transform">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer bg-white border border-emerald-100 p-6 flex flex-col justify-center items-center text-center hover:border-emerald-300 transition-colors">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-[#1A1A1A] mb-2">Same Day Delivery</h3>
              <p className="text-[#6B6B6B] text-sm">Available in Lahore, Karachi & Islamabad for thousands of products.</p>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-6 shadow-sm border border-black/5">
            <div className="flex items-center gap-4 border-r border-black/5">
              <ShieldCheck className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-[#1A1A1A] text-sm">100% Authentic</h4>
                <p className="text-[#6B6B6B] text-xs">Genuine products</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:border-r border-black/5">
              <Truck className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-[#1A1A1A] text-sm">Free Delivery</h4>
                <p className="text-[#6B6B6B] text-xs">Over Rs. 2,000</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-r border-black/5">
              <CreditCard className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-[#1A1A1A] text-sm">Secure Payment</h4>
                <p className="text-[#6B6B6B] text-xs">Card / Cash on Delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Wallet className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-[#1A1A1A] text-sm">Easy Returns</h4>
                <p className="text-[#6B6B6B] text-xs">14-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 lg:p-10 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center border-b-4 border-saffron-500 shadow-xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="md:w-1/3 relative z-10 text-center md:text-left flex flex-col items-center md:items-start">
            <Badge className="bg-saffron-500 text-white hover:bg-saffron-600 mb-4 px-3 py-1 font-bold border-none uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(232,163,61,0.5)]">⚡ Flash Deal</Badge>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">Prices Drop <span className="text-saffron-400 italic">Fast.</span></h2>
            <p className="text-gray-400 mb-8 max-w-sm">Grab these exclusive discounts before the timer runs out. Limited stock available.</p>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-14 h-16 lg:w-16 lg:h-20 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner mb-2 font-mono-timer text-2xl lg:text-3xl font-bold text-white">
                  {formatTime(timeLeft.hours)}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Hours</span>
              </div>
              <div className="text-2xl font-bold text-white/50 mt-4">:</div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-16 lg:w-16 lg:h-20 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner mb-2 font-mono-timer text-2xl lg:text-3xl font-bold text-white">
                  {formatTime(timeLeft.minutes)}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Mins</span>
              </div>
              <div className="text-2xl font-bold text-white/50 mt-4">:</div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-16 lg:w-16 lg:h-20 bg-saffron-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(232,163,61,0.4)] mb-2 font-mono-timer text-2xl lg:text-3xl font-bold text-white">
                  {formatTime(timeLeft.seconds)}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-saffron-400 font-semibold">Secs</span>
              </div>
            </div>
            
            <Button className="mt-8 bg-white text-[#1A1A1A] hover:bg-gray-100 rounded-full px-8 h-12 w-full md:w-auto font-bold group">
              View All Deals <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="md:w-2/3 relative z-10 w-full overflow-x-auto hide-scrollbar pb-4">
            <div className="flex gap-4 min-w-max pr-4">
              {feed.flashDeal.items.slice(0, 4).map((product) => (
                <div key={product.id} className="w-[240px] flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <SectionHeader 
          eyebrow="Shop By Category" 
          title="Everything you need" 
          actionText="Browse all categories" 
          actionHref="/shop"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {feed.categories.slice(0, 7).map((cat) => (
            <Link href={`/shop/${cat.slug}`} key={cat.id} className="flex flex-col items-center group cursor-pointer">
              <div className="w-full aspect-square bg-white rounded-2xl border border-black/5 shadow-sm p-4 mb-3 flex items-center justify-center group-hover:border-emerald-200 group-hover:shadow-md transition-all group-hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <img src={getImageUrl(cat.image)} alt={cat.name} className="w-16 h-16 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
              </div>
              <span className="text-sm font-medium text-[#1A1A1A] text-center leading-tight group-hover:text-emerald-600 transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Banner & Trending Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 rounded-2xl overflow-hidden relative group cursor-pointer h-[400px] lg:h-[600px] shadow-sm">
            <img src={getImageUrl("promo-band-1.jpg")} alt="Smartphone Deals" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <Badge className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 mb-3 border-white/30 text-[10px] uppercase tracking-wider">Tech Deals</Badge>
              <h3 className="text-3xl font-display font-bold text-white mb-2 leading-tight">Latest<br/>Smartphones</h3>
              <p className="text-white/80 text-sm mb-4">Up to 15% off on Samsung & Infinix</p>
              <Button className="bg-white text-[#1A1A1A] hover:bg-gray-100 rounded-full text-xs font-bold px-6 h-10">Shop Tech</Button>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <SectionHeader eyebrow="Trending Now" title="Most loved products" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {feed.trending.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-emerald-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          {/* Abstract pattern placeholder */}
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.7,-18,97.2,-2.3C97.7,13.4,92.8,29.3,83.9,42.5C75,55.7,62.1,66.2,47.9,73.1C33.7,80,18.2,83.3,2.4,80C-13.4,76.7,-28.9,66.8,-42.8,58.3C-56.7,49.8,-69,42.7,-77.2,31.7C-85.4,20.7,-89.5,5.8,-88.4,-8.7C-87.3,-23.2,-81,-37.3,-71.4,-47.9C-61.8,-58.5,-48.9,-65.6,-35.6,-73.4C-22.3,-81.2,-8.6,-89.7,4.2,-97C17,-104.3,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="text-emerald-300 font-semibold text-[11px] tracking-[0.2em] uppercase mb-3 block">Happy Customers</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">Trusted across Pakistan</h2>
            <p className="text-emerald-100/70 max-w-2xl mx-auto text-sm">Join millions of satisfied customers who trust PakMart for their everyday needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feed.testimonials.slice(0, 3).map((t, i) => (
              <Card key={t.id || i} className="bg-white/10 backdrop-blur-md border-white/10 text-white shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="p-8">
                  <div className="flex text-saffron-400 mb-6">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-lg leading-relaxed mb-8 text-emerald-50 font-medium">"{t.comment}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-800 rounded-full flex items-center justify-center font-bold text-emerald-100 border border-emerald-700 shadow-inner">
                      {t.initials || "C"}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{t.name}</h4>
                      <p className="text-emerald-300 text-xs flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" /> Verified Buyer, {t.city}</p>
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
