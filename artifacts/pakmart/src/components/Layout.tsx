import React from "react";
import { Link, useLocation } from "wouter";
import { 
  Search, ShoppingCart, User, Menu, MapPin, PhoneCall, Heart, 
  ChevronDown, Truck, Facebook, Twitter, Instagram, Youtube, Mail, Apple
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCart, useListCategories } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/format";

export function Header() {
  const [location, setLocation] = useLocation();
  const { data: categories } = useListCategories();
  const { data: cart } = useGetCart();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q");
    if (q) {
      setLocation(`/search?q=${encodeURIComponent(q.toString())}`);
    }
  };

  return (
    <div className="pakmart-theme selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      {/* Top Utility Bar */}
      <div className="bg-[#1A1A1A] text-gray-300 text-[11px] font-medium py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6 items-center">
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"><PhoneCall className="w-3.5 h-3.5" /> UAN: 111-PAK-MART</span>
            {cart && cart.amountToFreeDelivery > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-gray-400">
                <Truck className="w-3.5 h-3.5" /> You are <span className="text-saffron-500 font-bold mx-0.5">{formatPrice(cart.amountToFreeDelivery)}</span> away from FREE delivery
              </span>
            )}
            {cart && cart.amountToFreeDelivery === 0 && cart.items.length > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-emerald-400">
                <Truck className="w-3.5 h-3.5" /> You have unlocked FREE delivery!
              </span>
            )}
          </div>
          <div className="flex items-center space-x-5">
            <div className="flex items-center gap-3 border-r border-gray-700 pr-5">
              <span className="hover:text-white cursor-pointer transition-colors">Track Order</span>
              <span className="text-gray-600">|</span>
              <span className="hover:text-white cursor-pointer transition-colors">Help Center</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                English / اردو <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
              <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                PKR (Rs.) <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-5">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Menu className="w-6 h-6 text-[#1A1A1A] lg:hidden cursor-pointer" />
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 bg-emerald-brand rounded-lg flex items-center justify-center text-white font-display font-bold text-xl shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                  P
                </div>
                <span className="text-2xl font-bold tracking-tight text-[#1A1A1A] font-display">
                  Pak<span className="text-emerald-brand font-medium italic">Mart</span>
                </span>
              </Link>
            </div>

            {/* Delivery Selector (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5 cursor-pointer hover:bg-[#FAF7F1] py-2 px-3 rounded-lg border border-transparent hover:border-black/5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold leading-none mb-1">Deliver to</p>
                <p className="font-medium text-[#1A1A1A] leading-none">Karachi, Sindh</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:flex relative group">
              <form onSubmit={handleSearch} className="flex w-full h-12 border border-black/10 rounded-full overflow-hidden bg-[#FAF7F1] focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-emerald-600 focus-within:bg-white transition-all shadow-inner shadow-black/5">
                <select className="bg-transparent border-r border-black/10 text-sm font-medium text-[#1A1A1A] px-4 outline-none cursor-pointer hover:bg-black/5 transition-colors max-w-[130px]">
                  <option>All Depts</option>
                  {categories?.slice(0, 5).map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <input 
                  name="q"
                  type="text" 
                  placeholder="Search products, brands, and categories..." 
                  className="flex-1 px-4 text-sm outline-none text-[#1A1A1A] placeholder:text-[#6B6B6B] bg-transparent"
                />
                <button type="submit" className="w-14 flex items-center justify-center bg-emerald-brand text-white hover-bg-emerald-brand transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F1] flex items-center justify-center border border-transparent group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                  <User className="w-5 h-5 text-[#1A1A1A] group-hover:text-emerald-brand transition-colors" strokeWidth={1.5} />
                </div>
                <div className="hidden xl:block text-sm">
                  <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold leading-none mb-1">Sign In</p>
                  <p className="font-medium text-[#1A1A1A] leading-none group-hover:text-emerald-brand transition-colors">Account</p>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-2.5 cursor-pointer group">
                <div className="relative w-10 h-10 rounded-full bg-[#FAF7F1] flex items-center justify-center border border-transparent group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                  <Heart className="w-5 h-5 text-[#1A1A1A] group-hover:text-emerald-brand transition-colors" strokeWidth={1.5} />
                </div>
              </div>

              <Link href="/cart" className="flex items-center gap-2.5 cursor-pointer group pl-2 xl:pl-4 xl:border-l border-black/10">
                <div className="relative w-10 h-10 rounded-full bg-[#FAF7F1] flex items-center justify-center border border-transparent group-hover:border-saffron-200 group-hover:bg-saffron-50 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-[#1A1A1A] group-hover:text-saffron-600 transition-colors" strokeWidth={1.5} />
                  {(cart?.itemCount || 0) > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-saffron-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                      {cart?.itemCount}
                    </span>
                  )}
                </div>
                <div className="hidden xl:block text-sm">
                  <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold leading-none mb-1">Cart</p>
                  <p className="font-bold text-[#1A1A1A] leading-none">{formatPrice(cart?.total || 0)}</p>
                </div>
              </Link>
            </div>

          </div>
          
          {/* Mobile Search */}
          <div className="mt-4 md:hidden relative">
            <form onSubmit={handleSearch}>
              <input 
                name="q"
                type="text" 
                placeholder="Search PakMart..." 
                className="w-full bg-[#FAF7F1] border border-black/10 rounded-full py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand focus:bg-white shadow-inner"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
            </form>
          </div>
        </div>

        {/* Mega Nav */}
        <nav className="bg-white border-t border-black/5 hidden lg:block relative">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center space-x-8 text-sm font-medium text-[#6B6B6B]">
              <li className="py-3.5 text-white bg-emerald-brand px-6 flex items-center gap-2 cursor-pointer font-semibold rounded-t-lg mt-1 mr-2">
                <Menu className="w-4 h-4" /> All Categories
              </li>
              
              {categories?.slice(0, 6).map((cat) => (
                <li key={cat.id} className="py-4 hover-text-emerald-brand text-[#1A1A1A] cursor-pointer transition-colors relative">
                  <Link href={`/shop/${cat.slug}`}>{cat.name}</Link>
                </li>
              ))}
              
              <li className="py-4 hover-text-emerald-brand cursor-pointer transition-colors text-saffron-600 font-bold flex items-center gap-1">
                <Link href="/deals">Eid Specials</Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 pakmart-theme font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group inline-flex">
              <div className="w-10 h-10 bg-emerald-brand rounded-lg flex items-center justify-center text-white font-display font-bold text-xl shadow-sm">
                P
              </div>
              <span className="text-3xl font-bold tracking-tight text-white font-display">
                Pak<span className="text-emerald-brand font-medium italic">Mart</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Pakistan's premier online shopping destination. Delivering quality products from top brands nationwide with cash on delivery and easy returns.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-brand hover:text-white transition-colors text-gray-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-brand hover:text-white transition-colors text-gray-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-brand hover:text-white transition-colors text-gray-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-brand hover:text-white transition-colors text-gray-300">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 font-display">Customer Care</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-emerald-brand transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-brand transition-colors">How to Buy</a></li>
              <li><a href="#" className="hover:text-emerald-brand transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-emerald-brand transition-colors">Corporate & Bulk Purchasing</a></li>
              <li><a href="#" className="hover:text-emerald-brand transition-colors">Returns & Refunds</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 font-display">PakMart</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-emerald-brand transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-brand transition-colors">Digital Payments</a></li>
              <li><a href="#" className="hover:text-emerald-brand transition-colors">PakMart Blog</a></li>
              <li><a href="#" className="hover:text-emerald-brand transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-emerald-brand transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 font-display">Get the App</h4>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white justify-start h-12 px-4 rounded-xl">
                <Apple className="w-5 h-5 mr-3" />
                <div className="text-left flex flex-col">
                  <span className="text-[10px] leading-none text-gray-400">Download on the</span>
                  <span className="font-semibold text-sm leading-tight">App Store</span>
                </div>
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white justify-start h-12 px-4 rounded-xl">
                <Menu className="w-5 h-5 mr-3" /> {/* Play Store Icon roughly */}
                <div className="text-left flex flex-col">
                  <span className="text-[10px] leading-none text-gray-400">GET IT ON</span>
                  <span className="font-semibold text-sm leading-tight">Google Play</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PakMart. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Powered by Replit</span>
            <span>Made with ❤️ in Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col pakmart-theme bg-[#FAF7F1]">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
