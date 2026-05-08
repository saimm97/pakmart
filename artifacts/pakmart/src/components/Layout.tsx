import React from "react";
import { Link, useLocation } from "wouter";
import { 
  Search, ShoppingCart, User, Menu, MapPin, PhoneCall, Heart, 
  ChevronDown, Truck, Facebook, Twitter, Instagram, Youtube, Apple
} from "lucide-react";
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
    if (q) setLocation(`/search?q=${encodeURIComponent(q.toString())}`);
  };

  const itemCount = cart?.itemCount || 0;
  const cartTotal = cart?.total || 0;

  return (
    <div className="pakmart-theme selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      {/* Top Utility Bar */}
      <div className="bg-[#111] text-gray-400 text-[11px] font-medium py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500" /> UAN: 111-PAK-MART
            </span>
            {cart && cart.amountToFreeDelivery > 0 && (
              <span className="hidden sm:flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Add <span className="text-saffron-400 font-bold mx-0.5">{formatPrice(cart.amountToFreeDelivery)}</span> for FREE delivery
              </span>
            )}
            {cart && cart.amountToFreeDelivery === 0 && itemCount > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Truck className="w-3.5 h-3.5" /> Free delivery unlocked!
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-r border-gray-700/60 pr-4">
              <span className="hover:text-white cursor-pointer transition-colors">Track Order</span>
              <span className="text-gray-700">|</span>
              <span className="hover:text-white cursor-pointer transition-colors">Help Center</span>
            </div>
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              English / اردو <ChevronDown className="w-3 h-3 text-gray-600 ml-0.5" />
            </button>
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              PKR (Rs.) <ChevronDown className="w-3 h-3 text-gray-600 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-black/5 sticky top-0 z-50 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 py-3.5 lg:py-4">
          <div className="flex items-center justify-between gap-4 lg:gap-8">

            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Menu className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg shadow-sm group-hover:shadow-md transition-shadow">
                  P
                </div>
                <span className="text-[1.35rem] font-bold tracking-tight text-[#1A1A1A] font-display">
                  Pak<span className="text-emerald-600 font-medium italic">Mart</span>
                </span>
              </Link>
            </div>

            {/* Delivery Selector (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5 cursor-pointer hover:bg-[#FAF7F1] py-2 px-3 rounded-xl border border-transparent hover:border-black/5 transition-colors flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold leading-none mb-0.5">Deliver to</p>
                <p className="font-semibold text-[#1A1A1A] leading-none text-[13px]">Karachi, Sindh</p>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex h-11 border border-black/10 rounded-full overflow-hidden bg-[#F8F8F6] focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-emerald-500 focus-within:bg-white transition-all shadow-sm">
              <select className="bg-transparent border-r border-black/8 text-sm font-medium text-[#1A1A1A] px-4 outline-none cursor-pointer hover:bg-black/4 transition-colors max-w-[130px] shrink-0">
                <option>All Depts</option>
                {categories?.slice(0, 6).map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <input
                name="q"
                type="text"
                placeholder="Search products, brands, and categories..."
                className="flex-1 px-4 text-sm outline-none text-[#1A1A1A] placeholder:text-[#9B9B9B] bg-transparent"
              />
              <button type="submit" className="w-12 flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-700 transition-colors rounded-full m-0.5 flex-shrink-0">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
              {/* Account */}
              <button className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  <User className="w-4 h-4 text-[#1A1A1A] group-hover:text-emerald-600 transition-colors" strokeWidth={1.5} />
                </div>
                <div className="hidden xl:block text-sm text-left">
                  <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold leading-none mb-0.5">Sign In</p>
                  <p className="font-semibold text-[#1A1A1A] leading-none text-[13px] group-hover:text-emerald-600 transition-colors">Account</p>
                </div>
              </button>

              {/* Wishlist */}
              <button className="hidden sm:flex w-8 h-8 rounded-full bg-gray-100 items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors text-[#6B6B6B] flex-shrink-0">
                <Heart className="w-4 h-4" strokeWidth={1.5} />
              </button>

              {/* Cart */}
              <Link href="/cart" className="flex items-center gap-2 cursor-pointer group pl-2 xl:pl-4 xl:border-l border-black/8">
                <div className="relative w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-700 transition-colors shadow-sm">
                  <ShoppingCart className="w-4 h-4 text-white" strokeWidth={1.75} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-saffron-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white px-0.5">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
                <div className="hidden xl:block text-sm text-left">
                  <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold leading-none mb-0.5">Cart</p>
                  <p className="font-bold text-[#1A1A1A] leading-none text-[13px]">{formatPrice(cartTotal)}</p>
                </div>
              </Link>
            </div>

          </div>

          {/* Mobile Search */}
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
              <input
                name="q"
                type="text"
                placeholder="Search PakMart..."
                className="w-full bg-[#F8F8F6] border border-black/8 rounded-full py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-500 focus:bg-white transition-all"
              />
            </form>
          </div>
        </div>

        {/* Category Nav */}
        <nav className="bg-white border-t border-black/5 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-1 text-sm font-medium text-[#6B6B6B]">
              <li>
                <button className="py-3 px-5 text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 cursor-pointer font-semibold rounded-t-lg mt-px mr-3 transition-colors text-sm">
                  <Menu className="w-3.5 h-3.5" /> All Categories
                </button>
              </li>
              {categories?.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop/${cat.slug}`}
                    className={`block py-3.5 px-3 hover:text-emerald-600 transition-colors relative ${location.startsWith(`/shop/${cat.slug}`) ? 'text-emerald-600 font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-emerald-600 after:rounded-full' : 'text-[#444]'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="ml-auto">
                <Link href="/deals" className="block py-3.5 px-3 text-saffron-600 font-bold hover:text-saffron-700 transition-colors flex items-center gap-1">
                  ⚡ Eid Specials
                </Link>
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
    <footer className="bg-[#111] text-white pt-16 pb-8 pakmart-theme font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg shadow-sm">
                P
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-display">
                Pak<span className="text-emerald-500 font-medium italic">Mart</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-7 max-w-xs">
              Pakistan's premier online shopping destination. Delivering quality products from top brands nationwide.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-600 text-gray-400 hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-base mb-5 font-display text-white">Customer Care</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {["Help Center", "How to Buy", "Track Your Order", "Corporate & Bulk Purchasing", "Returns & Refunds"].map(item => (
                <li key={item}><a href="#" className="hover:text-emerald-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* PakMart */}
          <div>
            <h4 className="font-bold text-base mb-5 font-display text-white">PakMart</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {["About Us", "Digital Payments", "PakMart Blog", "Terms & Conditions", "Privacy Policy"].map(item => (
                <li key={item}><a href="#" className="hover:text-emerald-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Get the App */}
          <div>
            <h4 className="font-bold text-base mb-5 font-display text-white">Get the App</h4>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 bg-white/6 border border-white/8 text-white hover:bg-white/10 transition-colors h-12 px-4 rounded-xl text-left">
                <Apple className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] leading-none text-gray-400">Download on the</div>
                  <div className="font-semibold text-sm leading-snug">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-white/6 border border-white/8 text-white hover:bg-white/10 transition-colors h-12 px-4 rounded-xl text-left">
                <Menu className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] leading-none text-gray-400">GET IT ON</div>
                  <div className="font-semibold text-sm leading-snug">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-7 border-t border-white/6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} PakMart. All Rights Reserved.</p>
          <div className="flex items-center gap-5">
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
