import React, { useState, useEffect } from "react";
import { 
  Search, ShoppingCart, User, Menu, MapPin, PhoneCall, Heart, 
  ChevronRight, Star, Clock, ArrowRight, ShieldCheck, Truck, 
  CreditCard, Wallet, Smartphone, Tv, Shirt, Grape, Baby, Home as HomeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function Home() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30
  });

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          --pakmart-emerald: #059669;
          --pakmart-emerald-dark: #047857;
          --pakmart-saffron: #f59e0b;
          --pakmart-crimson: #dc2626;
          --pakmart-indigo: #4f46e5;
        }

        .text-emerald-brand { color: var(--pakmart-emerald); }
        .bg-emerald-brand { background-color: var(--pakmart-emerald); }
        .hover-bg-emerald-brand:hover { background-color: var(--pakmart-emerald-dark); }
        
        .bg-saffron-brand { background-color: var(--pakmart-saffron); }
        .text-saffron-brand { color: var(--pakmart-saffron); }

        .blob-bg {
          position: absolute;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.15;
          pointer-events: none;
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}} />

      {/* Top Utility Bar */}
      <div className="bg-emerald-brand text-white text-xs font-medium py-2 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex space-x-4 items-center">
            <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> UAN: 111-PAK-MART</span>
            <span className="hidden sm:inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> Deliver to: <strong>Karachi</strong></span>
          </div>
          <div className="flex space-x-4">
            <span className="hidden sm:inline">Track Order</span>
            <span>Sell on PakMart</span>
            <span>Help Center</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Menu className="w-6 h-6 text-gray-700 md:hidden" />
              <a href="#" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-500/20 transform -rotate-3">
                  P
                </div>
                <span className="text-2xl font-bold tracking-tight text-gray-900">
                  Pak<span className="text-emerald-brand">Mart</span>
                </span>
              </a>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl hidden md:flex relative">
              <div className="relative w-full group">
                <input 
                  type="text" 
                  placeholder="Search for clothes, electronics, groceries..." 
                  className="w-full bg-gray-100 border-2 border-transparent focus:border-emerald-brand focus:bg-white transition-all rounded-full py-2.5 pl-5 pr-12 text-sm outline-none shadow-inner"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-emerald-brand rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-6 flex-shrink-0">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  <User className="w-5 h-5 text-gray-700 group-hover:text-emerald-brand" />
                </div>
                <div className="hidden lg:block text-sm">
                  <p className="text-gray-500 text-xs">Sign In</p>
                  <p className="font-semibold text-gray-900">Account</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 cursor-pointer group relative">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-saffron-50 transition-colors relative">
                  <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-saffron-brand" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron-brand text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    3
                  </span>
                </div>
                <div className="hidden lg:block text-sm">
                  <p className="text-gray-500 text-xs">Total</p>
                  <p className="font-semibold text-gray-900">Rs. 4,590</p>
                </div>
              </div>
            </div>

          </div>
          
          {/* Mobile Search */}
          <div className="mt-4 md:hidden relative">
            <input 
              type="text" 
              placeholder="Search PakMart..." 
              className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-brand"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Navigation / Categories */}
      <nav className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-between text-sm font-medium text-gray-600">
            <li className="py-3 px-2 border-b-2 border-emerald-brand text-emerald-brand flex items-center gap-2 cursor-pointer">
              <Menu className="w-4 h-4" /> All Categories
            </li>
            <li className="py-3 px-2 hover:text-emerald-brand cursor-pointer transition-colors flex items-center gap-1"><Shirt className="w-4 h-4"/> Fashion</li>
            <li className="py-3 px-2 hover:text-emerald-brand cursor-pointer transition-colors flex items-center gap-1"><Smartphone className="w-4 h-4"/> Mobiles</li>
            <li className="py-3 px-2 hover:text-emerald-brand cursor-pointer transition-colors flex items-center gap-1"><Tv className="w-4 h-4"/> Electronics</li>
            <li className="py-3 px-2 hover:text-emerald-brand cursor-pointer transition-colors flex items-center gap-1"><Grape className="w-4 h-4"/> Kiryana & Grocery</li>
            <li className="py-3 px-2 hover:text-emerald-brand cursor-pointer transition-colors flex items-center gap-1"><Heart className="w-4 h-4"/> Beauty</li>
            <li className="py-3 px-2 hover:text-emerald-brand cursor-pointer transition-colors flex items-center gap-1"><Baby className="w-4 h-4"/> Mother & Baby</li>
            <li className="py-3 px-2 hover:text-emerald-brand cursor-pointer transition-colors text-red-600 font-bold flex items-center gap-1">
              🔥 Grand Festive Sale
            </li>
          </ul>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-auto lg:h-[400px]">
          {/* Left Category Menu - hidden on small screens */}
          <div className="hidden lg:flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              "Women's Fashion", "Men's Fashion", "Mobiles & Tablets", 
              "TV & Home Appliances", "Electronic Accessories", "Health & Beauty",
              "Groceries & Pets", "Babies & Toys", "Home & Lifestyle"
            ].map((cat, i) => (
              <a key={i} href="#" className="px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-brand flex justify-between items-center group transition-colors">
                {cat}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Main Banners */}
          <div className="lg:col-span-3 grid grid-rows-3 gap-4 h-full">
            <div className="row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
              <img src="/__mockup/images/pakmart/hero-banner.png" alt="Grand Festive Sale" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8 lg:p-12">
                <div className="text-white max-w-md">
                  <Badge className="bg-saffron-brand text-white hover:bg-yellow-600 border-none mb-4 uppercase tracking-wider font-bold">Live Now</Badge>
                  <h2 className="text-3xl lg:text-5xl font-extrabold mb-2 leading-tight">Grand Festive Bazaar</h2>
                  <p className="text-lg lg:text-xl mb-6 opacity-90">Up to 70% Off on Top Brands. Free Delivery over Rs. 2000!</p>
                  <Button className="bg-emerald-brand hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-lg font-semibold border-none shadow-lg shadow-emerald-900/20">
                    Shop Now <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="row-span-1 grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm">
                <img src="/__mockup/images/pakmart/promo-fashion.png" alt="Fashion Sale" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg">Lawn Collection '24</h3>
                  <p className="text-gray-200 text-sm">Starting at Rs. 1,499</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-2xl p-6 text-white flex flex-col justify-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                <div className="relative z-10">
                  <Badge variant="outline" className="text-white border-white/30 bg-white/10 mb-2">Easypaisa / JazzCash</Badge>
                  <h3 className="font-bold text-xl mb-1">Extra 10% Off</h3>
                  <p className="text-indigo-100 text-sm">On digital payments</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
            {[
              { icon: Truck, title: "Free Delivery", desc: "Over Rs. 2,000", color: "text-blue-500" },
              { icon: ShieldCheck, title: "100% Authentic", desc: "Verified Sellers", color: "text-emerald-500" },
              { icon: Clock, title: "7 Days Return", desc: "Easy policy", color: "text-saffron-brand" },
              { icon: Wallet, title: "Cash on Delivery", desc: "Pay at door", color: "text-purple-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4">
                <item.icon className={`w-8 h-8 ${item.color}`} strokeWidth={1.5} />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                ⚡ Flash Sale
              </h2>
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-500">Ending in:</span>
                <div className="flex gap-1 text-white">
                  <span className="bg-red-600 rounded px-2 py-1">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span className="text-red-600 font-bold">:</span>
                  <span className="bg-red-600 rounded px-2 py-1">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span className="text-red-600 font-bold">:</span>
                  <span className="bg-red-600 rounded px-2 py-1">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>
            <a href="#" className="text-emerald-brand font-medium text-sm hover:underline">See All Deals</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: "Infinix Hot 50 Pro 8GB", img: "product-phone.png", price: 34999, oldPrice: 42999, discount: 19, sold: 85 },
              { name: "Khaadi Lawn 3-Piece Unstitched", img: "product-khaadi.png", price: 2499, oldPrice: 3999, discount: 37, sold: 92 },
              { name: "PEL InverterOn 1.5 Ton AC", img: "product-ac.png", price: 115000, oldPrice: 135000, discount: 15, sold: 45 },
              { name: "National Mango Pickle 1kg", img: "product-pickle.png", price: 550, oldPrice: 750, discount: 26, sold: 78 },
              { name: "Servis Cheetah Joggers", img: "product-shoes.png", price: 3200, oldPrice: 4500, discount: 28, sold: 60 },
            ].map((product, i) => (
              <Card key={i} className="group overflow-hidden border-transparent hover:border-emerald-200 hover:shadow-lg transition-all duration-300 bg-white">
                <div className="relative p-2 aspect-square bg-gray-50 flex items-center justify-center">
                  <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white border-none z-10">-{product.discount}%</Badge>
                  <img src={`/__mockup/images/pakmart/${product.img}`} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[40px] mb-2 group-hover:text-emerald-brand transition-colors">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-lg font-bold text-red-600">Rs. {product.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">Rs. {product.oldPrice.toLocaleString()}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-medium">
                      <span>{product.sold}% Sold</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-400 to-red-500 h-1.5 rounded-full" style={{ width: `${product.sold}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Fashion & Apparel", img: "cat-fashion.png" },
              { name: "Kiryana & Groceries", img: "cat-grocery.png" },
              { name: "Mobiles & Tech", img: "product-phone.png" },
              { name: "Home Appliances", img: "product-ac.png" },
            ].map((cat, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer aspect-[4/3]">
                <img src={`/__mockup/images/pakmart/${cat.img}`} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Just For You (Featured) */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Just For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Gul Ahmed Cambric Kurta", img: "product-khaadi.png", price: 1850, rating: 4.8, reviews: 124 },
              { name: "Tapal Danedar 950g Mega Pack", img: "product-tea.png", price: 1450, rating: 4.9, reviews: 856 },
              { name: "Haier Refrigerator 12 Cu Ft", img: "product-ac.png", price: 78000, rating: 4.5, reviews: 32 },
              { name: "Sunsilk Hairfall Shampoo 400ml", img: "product-pickle.png", price: 650, rating: 4.6, reviews: 210 },
              { name: "Xiaomi Redmi 13C 8GB", img: "product-phone.png", price: 31999, rating: 4.7, reviews: 89 },
              { name: "Dawlance Microwave Oven", img: "product-ac.png", price: 21000, rating: 4.4, reviews: 45 },
              { name: "Bata Men's Formal Shoes", img: "product-shoes.png", price: 4500, rating: 4.2, reviews: 67 },
              { name: "Shan Bombay Biryani Masala", img: "product-pickle.png", price: 120, rating: 4.9, reviews: 1500 },
              { name: "Lipton Yellow Label 800g", img: "product-tea.png", price: 1350, rating: 4.8, reviews: 432 },
              { name: "Samsung 43\" Smart TV", img: "product-ac.png", price: 85000, rating: 4.7, reviews: 112 },
              { name: "Sapphire Unstitched Lawn", img: "product-khaadi.png", price: 2890, rating: 4.6, reviews: 231 },
              { name: "Nike Sports Running Shoes", img: "product-shoes.png", price: 12500, rating: 4.8, reviews: 88 },
            ].map((product, i) => (
              <Card key={i} className="group overflow-hidden border border-gray-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
                <div className="relative p-3 aspect-square bg-white flex items-center justify-center border-b border-gray-50">
                  <img src={`/__mockup/images/pakmart/${product.img}`} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col">
                  <h3 className="font-medium text-gray-800 text-xs line-clamp-2 min-h-[32px] mb-1.5 group-hover:text-emerald-brand transition-colors leading-relaxed">{product.name}</h3>
                  <div className="text-emerald-600 font-bold text-sm mb-1">Rs. {product.price.toLocaleString()}</div>
                  <div className="flex items-center gap-1 mt-auto pt-2">
                    <div className="flex text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current opacity-50" />
                    </div>
                    <span className="text-[10px] text-gray-400">({product.reviews})</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button variant="outline" className="border-emerald-brand text-emerald-brand hover:bg-emerald-50 px-8 py-6 rounded-full w-full sm:w-auto font-semibold">
              Load More Products
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-emerald-brand">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Col */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-emerald-brand rounded-xl flex items-center justify-center text-white font-bold text-xl transform -rotate-3">
                  P
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  Pak<span className="text-emerald-500">Mart</span>
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Pakistan's most trusted online marketplace. Shop the best deals on fashion, electronics, groceries, and more. Delivered fast to your doorstep.
              </p>
              <div className="flex space-x-4">
                {/* Social icons placeholders */}
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-brand hover:text-white transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-brand hover:text-white transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-brand hover:text-white transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Customer Care</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-brand transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-brand transition-colors">How to Buy</a></li>
                <li><a href="#" className="hover:text-emerald-brand transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-emerald-brand transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-brand transition-colors">Delivery Options</a></li>
              </ul>
            </div>

            {/* PakMart */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">About PakMart</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-brand transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-brand transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-brand transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-emerald-brand transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-brand transition-colors">Become a Seller</a></li>
              </ul>
            </div>

            {/* App / Payments */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Secure Payments</h4>
              <div className="flex gap-2 mb-8">
                <div className="bg-gray-800 p-2 rounded w-16 h-10 flex items-center justify-center font-bold text-xs text-white border border-gray-700">Cash</div>
                <div className="bg-gray-800 p-2 rounded w-16 h-10 flex items-center justify-center font-bold text-xs text-green-500 border border-gray-700">JazzCash</div>
                <div className="bg-gray-800 p-2 rounded w-16 h-10 flex items-center justify-center font-bold text-xs text-blue-500 border border-gray-700">EasyPaisa</div>
                <div className="bg-gray-800 p-2 rounded w-16 h-10 flex items-center justify-center font-bold text-xs text-white border border-gray-700">Visa</div>
              </div>
              <h4 className="text-white font-bold mb-4 text-lg tracking-wide">Download App</h4>
              <div className="flex gap-3">
                <div className="bg-gray-800 p-2 rounded border border-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-700 transition-colors">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341c-.015-3.35 2.73-4.965 2.854-5.044-1.558-2.274-3.98-2.583-4.843-2.62-2.073-.209-4.043 1.218-5.097 1.218-1.056 0-2.684-1.185-4.411-1.15-2.253.033-4.327 1.309-5.485 3.32-2.342 4.053-.598 10.063 1.685 13.352 1.115 1.608 2.44 3.411 4.167 3.344 1.67-.067 2.3-.108 4.316-1.108 2.017-.999 2.673-1.077 4.385-1.042 1.761.034 2.923 1.624 3.993 3.197 1.305-1.905 2.378-4.032 2.934-6.27-3.155-1.21-3.488-4.52-3.498-4.998zm-2.883-8.083c.866-1.048 1.448-2.506 1.288-3.958-1.246.05-2.766.828-3.654 1.895-.794.945-1.492 2.434-1.305 3.865 1.4.108 2.806-.757 3.671-1.802z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400">Download on the</div>
                    <div className="text-xs font-bold text-white">App Store</div>
                  </div>
                </div>
                <div className="bg-gray-800 p-2 rounded border border-gray-700 flex items-center gap-2 cursor-pointer hover:bg-gray-700 transition-colors">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 01-.527-1.341V3.155c0-.527.202-.998.526-1.341zM14.547 12.75l2.846 2.846-11.83 6.81c-.51.294-1.066.236-1.464-.04l10.448-10.448v.832zM15.353 11.16l5.042-2.903c.71-.41.71-1.072 0-1.48L15.353 3.87l-4.238 4.238 4.238 4.238v-1.186zM4.099 1.428l11.83 6.81L5.481 12.686 19.393 1.428c.398-.276.954-.334 1.464-.04L4.099 1.428z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400">GET IT ON</div>
                    <div className="text-xs font-bold text-white">Google Play</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2024 PakMart. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Karachi</span>
              <span>•</span>
              <span>Lahore</span>
              <span>•</span>
              <span>Islamabad</span>
              <span>•</span>
              <span>Peshawar</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;