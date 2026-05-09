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
    <div className="pakmart-theme font-sans">
      {/* Utility Bar */}
      <div className="bg-[#070810] text-[#6A7490] text-[11px] font-medium py-2 px-4 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 hover:text-[#EEF1FA] cursor-pointer transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
              UAN: 111-PAK-MART
            </span>
            {cart && cart.amountToFreeDelivery > 0 && (
              <span className="hidden sm:flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Add{" "}
                <span className="text-[#E8B84A] font-bold mx-0.5">{formatPrice(cart.amountToFreeDelivery)}</span>
                {" "}for FREE delivery
              </span>
            )}
            {cart && cart.amountToFreeDelivery === 0 && itemCount > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Truck className="w-3.5 h-3.5" /> Free delivery unlocked!
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-r border-white/[0.07] pr-4">
              <span className="hover:text-[#EEF1FA] cursor-pointer transition-colors">Track Order</span>
              <span className="text-white/10">|</span>
              <span className="hover:text-[#EEF1FA] cursor-pointer transition-colors">Help Center</span>
            </div>
            <button className="flex items-center gap-1 hover:text-[#EEF1FA] transition-colors">
              English / اردو <ChevronDown className="w-3 h-3 opacity-40 ml-0.5" />
            </button>
            <button className="flex items-center gap-1 hover:text-[#EEF1FA] transition-colors">
              PKR (Rs.) <ChevronDown className="w-3 h-3 opacity-40 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[#0C0E18]/95 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3.5 lg:py-4">
          <div className="flex items-center justify-between gap-4 lg:gap-8">

            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button className="lg:hidden p-1.5 rounded-xl hover:bg-white/5 transition-colors">
                <Menu className="w-5 h-5 text-[#EEF1FA]" />
              </button>
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-display font-black text-lg shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-shadow">
                  P
                </div>
                <div className="flex items-baseline gap-0 font-display text-[1.4rem] leading-none">
                  <span className="font-semibold text-[#EEF1FA] tracking-tight">Pak</span>
                  <span className="font-black text-emerald-400 tracking-widest uppercase text-[1.15rem]">MART</span>
                </div>
              </Link>
            </div>

            {/* Delivery Selector */}
            <div className="hidden lg:flex items-center gap-2.5 cursor-pointer hover:bg-white/5 py-2 px-3 rounded-xl border border-transparent hover:border-white/8 transition-colors flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-700/30 flex items-center justify-center text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <p className="text-[#5A6480] text-[10px] uppercase tracking-wider font-semibold leading-none mb-0.5">Deliver to</p>
                <p className="font-semibold text-[#EEF1FA] leading-none text-[13px]">Karachi, Sindh</p>
              </div>
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-2xl hidden md:flex h-11 border border-white/[0.08] rounded-full overflow-hidden bg-[#181B2E] focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500/50 transition-all"
            >
              <select className="bg-transparent border-r border-white/[0.07] text-sm font-medium text-[#EEF1FA] px-4 outline-none cursor-pointer hover:bg-white/5 transition-colors max-w-[130px] shrink-0">
                <option>All Depts</option>
                {categories?.slice(0, 6).map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <input
                name="q"
                type="text"
                placeholder="Search products, brands, categories..."
                className="flex-1 px-4 text-sm outline-none text-[#EEF1FA] placeholder:text-[#3E475E] bg-transparent"
              />
              <button
                type="submit"
                className="w-12 flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-500 transition-colors rounded-full m-0.5 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <Link href="/signin" className="flex items-center gap-2 cursor-pointer group p-1.5 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/6 border border-white/8 flex items-center justify-center group-hover:bg-emerald-900/50 group-hover:border-emerald-700/30 transition-colors">
                  <User className="w-4 h-4 text-[#8A93B4] group-hover:text-emerald-400 transition-colors" strokeWidth={1.5} />
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-[#5A6480] text-[10px] uppercase tracking-wider font-semibold leading-none mb-0.5">Sign In</p>
                  <p className="font-semibold text-[#EEF1FA] leading-none text-[13px] group-hover:text-emerald-400 transition-colors">Account</p>
                </div>
              </Link>

              <button className="hidden sm:flex w-8 h-8 rounded-full bg-white/6 border border-white/8 items-center justify-center hover:bg-red-900/40 hover:border-red-700/30 hover:text-red-400 transition-colors text-[#8A93B4] flex-shrink-0">
                <Heart className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <Link
                href="/cart"
                className="flex items-center gap-2 cursor-pointer group pl-2 xl:pl-4 xl:border-l border-white/[0.08]"
              >
                <div className="relative w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 transition-colors shadow-[0_0_16px_rgba(16,185,129,0.2)]">
                  <ShoppingCart className="w-4 h-4 text-white" strokeWidth={1.75} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#E8B84A] text-[#0C0E18] text-[9px] font-black flex items-center justify-center rounded-full shadow ring-2 ring-[#0C0E18] px-0.5">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-[#5A6480] text-[10px] uppercase tracking-wider font-semibold leading-none mb-0.5">Cart</p>
                  <p className="font-bold text-[#EEF1FA] leading-none text-[13px]">{formatPrice(cartTotal)}</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3E475E]" />
              <input
                name="q"
                type="text"
                placeholder="Search PakMart..."
                className="w-full bg-[#181B2E] border border-white/[0.08] rounded-full py-2.5 pl-11 pr-4 text-sm outline-none text-[#EEF1FA] placeholder:text-[#3E475E] focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
              />
            </form>
          </div>
        </div>

        {/* Category Nav */}
        <nav className="border-t border-white/[0.05] hidden lg:block bg-[#0A0C16]">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-1 text-sm font-medium">
              <li>
                <button className="py-3 px-5 text-white bg-emerald-700 hover:bg-emerald-600 flex items-center gap-2 font-semibold rounded-t-lg mt-px mr-3 transition-colors text-sm">
                  <Menu className="w-3.5 h-3.5" /> All Categories
                </button>
              </li>
              {categories?.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop/${cat.slug}`}
                    className={`block py-3.5 px-3 transition-colors relative text-sm ${
                      location.startsWith(`/shop/${cat.slug}`)
                        ? "text-emerald-400 font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-emerald-500 after:rounded-full"
                        : "text-[#8A93B4] hover:text-[#EEF1FA]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="ml-auto">
                <Link
                  href="/deals"
                  className="block py-3.5 px-3 text-[#E8B84A] font-bold hover:text-[#F5C96A] transition-colors text-sm"
                >
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
    <footer className="bg-[#070810] text-white pt-16 pb-8 pakmart-theme font-sans border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-display font-black text-lg">
                P
              </div>
              <div className="flex items-baseline gap-0 font-display text-[1.4rem] leading-none">
                <span className="font-semibold text-[#EEF1FA] tracking-tight">Pak</span>
                <span className="font-black text-emerald-400 tracking-widest uppercase text-[1.15rem]">MART</span>
              </div>
            </Link>
            <p className="text-[#4A5470] text-sm leading-relaxed mb-7 max-w-xs">
              Pakistan's premier executive shopping destination. Delivering quality products from the world's top brands, nationwide.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/4 border border-white/5 flex items-center justify-center hover:bg-emerald-700 hover:border-emerald-600 text-[#4A5470] hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-5 font-display text-[#EEF1FA] uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-3 text-sm text-[#4A5470]">
              {["Help Center", "How to Buy", "Track Your Order", "Corporate & Bulk Purchasing", "Returns & Refunds"].map(item => (
                <li key={item}><a href="#" className="hover:text-emerald-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-5 font-display text-[#EEF1FA] uppercase tracking-wider">PakMart</h4>
            <ul className="space-y-3 text-sm text-[#4A5470]">
              {["About Us", "Digital Payments", "PakMart Blog", "Terms & Conditions", "Privacy Policy"].map(item => (
                <li key={item}><a href="#" className="hover:text-emerald-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-5 font-display text-[#EEF1FA] uppercase tracking-wider">Get the App</h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: Apple, top: "Download on the", bottom: "App Store" },
                { icon: Menu, top: "GET IT ON", bottom: "Google Play" },
              ].map(({ icon: Icon, top, bottom }) => (
                <button key={bottom} className="flex items-center gap-3 bg-white/4 border border-white/6 text-[#EEF1FA] hover:bg-white/8 hover:border-white/10 transition-colors h-12 px-4 rounded-xl text-left">
                  <Icon className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <div>
                    <div className="text-[10px] leading-none text-[#4A5470]">{top}</div>
                    <div className="font-semibold text-sm leading-snug">{bottom}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-7 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[#3A4060]">
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
    <div className="min-h-[100dvh] flex flex-col pakmart-theme bg-[#0C0E18]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
