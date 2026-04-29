import React, { useState, useEffect } from "react";
import { 
  Search, ShoppingCart, User, Menu, MapPin, PhoneCall, Heart, 
  ChevronRight, Star, Clock, ArrowRight, ShieldCheck, Truck, 
  CreditCard, Wallet, Smartphone, Tv, Shirt, Grape, Baby, Home as HomeIcon,
  ChevronDown, Eye, Play, Facebook, Twitter, Instagram, Youtube, Mail, Apple, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import "./_group.css";

const MOCK_PRODUCTS = [
  { id: 1, brand: "Infinix", name: "Hot 50 Pro 8GB/256GB - Android 14", img: "product-phone.png", price: 34999, oldPrice: 42999, discount: 19, sold: 85, stock: 100, rating: 4.8, reviews: 124 },
  { id: 2, brand: "Khaadi", name: "3-Piece Unstitched Printed Lawn Suit", img: "product-khaadi.png", price: 2499, oldPrice: 3999, discount: 37, sold: 92, stock: 120, rating: 4.6, reviews: 89 },
  { id: 3, brand: "PEL", name: "1.5 Ton InverterOn Air Conditioner Series 4", img: "product-ac.png", price: 115000, oldPrice: 135000, discount: 15, sold: 45, stock: 50, rating: 4.7, reviews: 56 },
  { id: 4, brand: "National", name: "Mango Pickle Glass Jar 1kg Premium", img: "product-pickle.png", price: 550, oldPrice: 750, discount: 26, sold: 78, stock: 200, rating: 4.9, reviews: 342 },
  { id: 5, brand: "Servis", name: "Cheetah Men's Running Joggers Sports", img: "product-shoes.png", price: 3200, oldPrice: 4500, discount: 28, sold: 60, stock: 80, rating: 4.4, reviews: 112 },
  { id: 6, brand: "Tapal", name: "Danedar Black Tea Mega Pack 950g", img: "product-tea.png", price: 1450, oldPrice: 1600, discount: 9, sold: 95, stock: 150, rating: 4.9, reviews: 856 }
];

const CATEGORIES = [
  { name: "Fashion & Apparel", img: "cat-fashion.png" },
  { name: "Mobiles & Tablets", img: "product-phone.png" },
  { name: "Electronics", img: "product-ac.png" },
  { name: "Groceries", img: "cat-grocery.png" },
  { name: "Beauty", img: "product-pickle.png" }, // reusing as placeholder
  { name: "Home & Lifestyle", img: "product-shoes.png" },
  { name: "Mother & Baby", img: "product-tea.png" },
];

const TOP_BRANDS = [
  "Khaadi", "Gul Ahmed", "Sapphire", "Nishat", "Servis", "J.", "Ego", "Outfitters", "Limelight", "Bonanza Satrangi"
];

function ProductCard({ product }: { product: typeof MOCK_PRODUCTS[0] }) {
  return (
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
        <img src={`/__mockup/images/pakmart/${product.img}`} alt={product.name} className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" />
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
          <span className="text-[11px] text-[#6B6B6B]">({product.reviews})</span>
        </div>

        <div className="mt-auto flex flex-col">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-semibold text-[#1A1A1A] tracking-tight">Rs. {product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-xs text-[#6B6B6B] line-through">Rs. {product.oldPrice.toLocaleString()}</span>
            )}
          </div>
          
          <Button variant="outline" className="w-full mt-4 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors opacity-0 group-hover:opacity-100 h-10 pointer-events-none group-hover:pointer-events-auto absolute bottom-5 left-5 right-5 w-[calc(100%-40px)] bg-white font-medium">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ eyebrow, title, subtitle, actionText }: { eyebrow: string, title: string, subtitle?: string, actionText?: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
      <div>
        <span className="text-emerald-600 font-semibold text-[11px] tracking-[0.2em] uppercase mb-3 block">{eyebrow}</span>
        <h2 className="text-3xl lg:text-4xl font-display font-bold text-[#1A1A1A]">{title}</h2>
        {subtitle && <p className="text-[#6B6B6B] mt-2 text-sm">{subtitle}</p>}
      </div>
      {actionText && (
        <a href="#" className="text-[#1A1A1A] font-medium text-sm hover:text-emerald-600 transition-colors flex items-center gap-1 group pb-1">
          {actionText} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      )}
    </div>
  );
}

export function Home() {
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

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="min-h-[100dvh] pakmart-theme selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      
      {/* Top Utility Bar */}
      <div className="bg-[#1A1A1A] text-gray-300 text-[11px] font-medium py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6 items-center">
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"><PhoneCall className="w-3.5 h-3.5" /> UAN: 111-PAK-MART</span>
            <span className="hidden sm:flex items-center gap-1.5 text-gray-400"><Truck className="w-3.5 h-3.5" /> You are <span className="text-saffron-500 font-bold mx-0.5">Rs. 540</span> away from FREE delivery</span>
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
              <a href="#" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 bg-emerald-brand rounded-lg flex items-center justify-center text-white font-display font-bold text-xl shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                  P
                </div>
                <span className="text-2xl font-bold tracking-tight text-[#1A1A1A] font-display">
                  Pak<span className="text-emerald-brand font-medium italic">Mart</span>
                </span>
              </a>
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
              <div className="flex w-full h-12 border border-black/10 rounded-full overflow-hidden bg-[#FAF7F1] focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-emerald-600 focus-within:bg-white transition-all shadow-inner shadow-black/5">
                <select className="bg-transparent border-r border-black/10 text-sm font-medium text-[#1A1A1A] px-4 outline-none cursor-pointer hover:bg-black/5 transition-colors max-w-[130px]">
                  <option>All Depts</option>
                  <option>Fashion</option>
                  <option>Electronics</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Search products, brands, and categories..." 
                  className="flex-1 px-4 text-sm outline-none text-[#1A1A1A] placeholder:text-[#6B6B6B] bg-transparent"
                />
                <button className="w-14 flex items-center justify-center bg-emerald-brand text-white hover-bg-emerald-brand transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
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
                  <span className="absolute 0 top-0 right-0 w-4 h-4 bg-emerald-brand text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                    12
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 cursor-pointer group pl-2 xl:pl-4 xl:border-l border-black/10">
                <div className="relative w-10 h-10 rounded-full bg-[#FAF7F1] flex items-center justify-center border border-transparent group-hover:border-saffron-200 group-hover:bg-saffron-50 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-[#1A1A1A] group-hover:text-saffron-600 transition-colors" strokeWidth={1.5} />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-saffron-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                    3
                  </span>
                </div>
                <div className="hidden xl:block text-sm">
                  <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider font-semibold leading-none mb-1">Cart</p>
                  <p className="font-bold text-[#1A1A1A] leading-none">Rs. 4,590</p>
                </div>
              </div>
            </div>

          </div>
          
          {/* Mobile Search */}
          <div className="mt-4 md:hidden relative">
            <input 
              type="text" 
              placeholder="Search PakMart..." 
              className="w-full bg-[#FAF7F1] border border-black/10 rounded-full py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand focus:bg-white shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          </div>
        </div>

        {/* Mega Nav */}
        <nav className="bg-white border-t border-black/5 hidden lg:block relative">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center space-x-8 text-sm font-medium text-[#6B6B6B]">
              <li className="py-3.5 text-white bg-emerald-brand px-6 flex items-center gap-2 cursor-pointer font-semibold rounded-t-lg mt-1 mr-2">
                <Menu className="w-4 h-4" /> All Categories
              </li>
              
              <li className="py-4 hover-text-emerald-brand text-[#1A1A1A] cursor-pointer transition-colors relative mega-menu-trigger">
                Fashion & Apparel
                {/* Mega Menu Dropdown */}
                <div className="mega-menu-panel absolute top-full left-0 w-[800px] bg-white border border-black/5 shadow-2xl rounded-b-xl rounded-tr-xl z-50 pt-8 pb-8 px-10 cursor-default">
                  <div className="grid grid-cols-4 gap-10">
                    <div className="col-span-3 grid grid-cols-3 gap-8">
                      <div>
                        <h4 className="font-bold text-[#1A1A1A] mb-4 text-sm uppercase tracking-wider border-b border-black/5 pb-2">Women's Fashion</h4>
                        <ul className="space-y-3 text-sm text-[#6B6B6B]">
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Unstitched Fabric</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Pret Wear</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Eastern Wear</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Western Wear</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Shoes & Bags</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A1A1A] mb-4 text-sm uppercase tracking-wider border-b border-black/5 pb-2">Men's Fashion</h4>
                        <ul className="space-y-3 text-sm text-[#6B6B6B]">
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Shalwar Kameez</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">T-Shirts & Polos</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Jeans & Trousers</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Formal Wear</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Footwear</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A1A1A] mb-4 text-sm uppercase tracking-wider border-b border-black/5 pb-2">Top Brands</h4>
                        <ul className="space-y-3 text-sm text-[#6B6B6B]">
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Khaadi</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Gul Ahmed</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Sapphire</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">J.</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Outfitters</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-span-1 bg-[#FAF7F1] rounded-xl p-5 flex flex-col justify-center items-center text-center border border-black/5">
                      <div className="w-full h-36 bg-gray-200 rounded-lg mb-4 shadow-inner overflow-hidden">
                        {/* Placeholder for menu promo image */}
                        <img src="/images/pakmart/summer-edit.jpg" alt="Fashion Promo" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "/__mockup/images/pakmart/promo-fashion.png"} />
                      </div>
                      <h4 className="font-display font-bold text-[#1A1A1A] text-lg mb-1">Festive Edit '24</h4>
                      <p className="text-xs text-[#6B6B6B] mb-4">Up to 40% off on all leading brands</p>
                      <Button size="sm" className="bg-emerald-brand text-white hover-bg-emerald-brand w-full rounded-lg">Shop Now</Button>
                    </div>
                  </div>
                </div>
              </li>
              
              <li className="py-4 hover-text-emerald-brand cursor-pointer transition-colors">Mobiles & Tablets</li>
              <li className="py-4 hover-text-emerald-brand cursor-pointer transition-colors">Electronics</li>
              <li className="py-4 hover-text-emerald-brand cursor-pointer transition-colors">Groceries</li>
              <li className="py-4 hover-text-emerald-brand cursor-pointer transition-colors">Beauty</li>
              <li className="py-4 hover-text-emerald-brand cursor-pointer transition-colors">Home & Lifestyle</li>
              <li className="py-4 hover-text-emerald-brand cursor-pointer transition-colors">Mother & Baby</li>
              <li className="py-4 hover-text-emerald-brand cursor-pointer transition-colors text-saffron-600 font-bold flex items-center gap-1">
                Eid Specials
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="space-y-16 lg:space-y-24 pb-20">
        
        {/* Hero Section */}
        <section className="bg-[#FAF7F1] pt-6 pb-12 lg:py-12 border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
            {/* Main Hero Banner */}
            <div className="lg:col-span-8 relative rounded-2xl overflow-hidden group bg-[#E6EBE6] flex items-center shadow-sm border border-emerald-900/5">
              <div className="absolute inset-0 w-full h-full">
                 <img src="/images/pakmart/hero-new.jpg" alt="Grand Festive Sale" className="absolute inset-0 w-full h-full object-cover object-right transform group-hover:scale-[1.02] transition-transform duration-1000 ease-out" onError={(e) => e.currentTarget.src = "/__mockup/images/pakmart/hero-banner.png"} />
                 {/* Soft emerald gradient overlay on the left side */}
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
                <img src="/images/pakmart/summer-edit.jpg" alt="Summer Edit" className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 ease-out" onError={(e) => e.currentTarget.src = "/__mockup/images/pakmart/promo-fashion.png"} />
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <div className="w-14 h-14 bg-[#FAF7F1] rounded-full flex items-center justify-center mb-4 text-emerald-600 border border-emerald-100">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#1A1A1A] mb-2">Digital Payment Offer</h3>
                <p className="text-[#6B6B6B] text-sm mb-4 px-2">Get extra 10% off when you pay via Easypaisa or JazzCash</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6B6B6B]">Use Code</span>
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 shadow-sm font-mono font-bold text-sm tracking-widest">DIGI10</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* As Featured In */}
        <section className="max-w-7xl mx-auto px-4 border-b border-black/5 pb-10">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold text-[#6B6B6B] mb-6">Trusted & Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-display font-bold text-xl tracking-tight">DAWN</span>
            <span className="font-sans font-black text-xl italic tracking-tighter">GEO<span className="text-red-600 ml-0.5">NEWS</span></span>
            <span className="font-serif font-semibold text-lg uppercase tracking-widest">The Express Tribune</span>
            <span className="font-sans font-bold text-xl tracking-tighter">ARY<span className="font-light">NEWS</span></span>
            <span className="font-serif font-bold text-xl">Daily Pakistan</span>
            <span className="font-sans font-bold text-lg uppercase tracking-tight hidden md:block">Business Recorder</span>
          </div>
        </section>

        {/* Categories Browser */}
        <section className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow="Shop by Category" title="Explore Categories" actionText="View all categories" />
          <div className="flex flex-nowrap overflow-x-auto pb-6 -mx-4 px-4 lg:mx-0 lg:px-0 gap-4 lg:gap-6 hide-scrollbar snap-x">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-4 min-w-[110px] snap-center group cursor-pointer">
                <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-[#FAF7F1] border border-black/5 shadow-sm flex items-center justify-center overflow-hidden group-hover:border-emerald-600/30 group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1 relative">
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img src={`/__mockup/images/pakmart/${cat.img}`} alt={cat.name} className="w-[70%] h-[70%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-sm font-medium text-[#1A1A1A] group-hover:text-emerald-600 text-center leading-tight">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sale / Deal of the Day */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-[#0E5E3F] rounded-[2rem] p-8 lg:p-12 shadow-[0_20px_40px_-15px_rgba(14,94,63,0.3)] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-700/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between mb-10 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-saffron-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider shadow-sm animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Live
                  </span>
                  <span className="text-emerald-100 font-semibold text-xs tracking-[0.2em] uppercase">Deal of the Day</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-2">
                  Flash Sale
                </h2>
                <p className="text-emerald-100/80 text-sm">Hurry! Offers end when the timer runs out.</p>
              </div>
              
              <div className="flex items-center gap-4 bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/20 backdrop-blur-sm self-start xl:self-auto">
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-200">Ends In</span>
                <div className="flex gap-2 text-xl font-mono-timer font-bold text-white">
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-white text-[#1A1A1A] w-12 h-12 flex items-center justify-center rounded-lg shadow-inner border-b-2 border-emerald-200">{formatTime(timeLeft.hours)}</div>
                    <span className="text-[9px] text-emerald-200/70 uppercase tracking-widest">Hrs</span>
                  </div>
                  <span className="py-2 text-emerald-300">:</span>
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-white text-[#1A1A1A] w-12 h-12 flex items-center justify-center rounded-lg shadow-inner border-b-2 border-emerald-200">{formatTime(timeLeft.minutes)}</div>
                    <span className="text-[9px] text-emerald-200/70 uppercase tracking-widest">Min</span>
                  </div>
                  <span className="py-2 text-emerald-300">:</span>
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-white text-[#1A1A1A] w-12 h-12 flex items-center justify-center rounded-lg shadow-inner border-b-2 border-emerald-200">{formatTime(timeLeft.seconds)}</div>
                    <span className="text-[9px] text-emerald-200/70 uppercase tracking-widest">Sec</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {MOCK_PRODUCTS.slice(0, 4).map(product => (
                <div key={product.id} className="bg-white rounded-2xl p-5 relative group border border-transparent hover:border-emerald-300 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  {product.discount > 0 && (
                    <div className="absolute top-0 right-6 bg-saffron-500 text-white font-bold text-[11px] px-2.5 py-3 rounded-b-md z-10 shadow-md">
                      {product.discount}% OFF
                    </div>
                  )}
                  <div className="aspect-square bg-[#FAF7F1] rounded-xl p-4 mb-4 flex items-center justify-center">
                    <img src={`/__mockup/images/pakmart/${product.img}`} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-display font-medium text-[#1A1A1A] text-sm line-clamp-2 min-h-[40px] mb-3 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-emerald-700">Rs. {product.price.toLocaleString()}</span>
                    {product.oldPrice && <span className="text-xs text-[#6B6B6B] line-through">Rs. {product.oldPrice.toLocaleString()}</span>}
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-[10px] font-medium text-[#6B6B6B]">
                      <span>{product.sold} Sold</span>
                      <span>{product.stock} Available</span>
                    </div>
                    <Progress value={(product.sold / (product.sold + product.stock)) * 100} className="h-1.5 bg-emerald-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Brands Rail */}
        <section className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow="Featured" title="Top Brands" actionText="View all brands" />
          <div className="flex flex-wrap gap-3">
            {TOP_BRANDS.map((brand, i) => (
              <a href="#" key={i} className="px-6 py-3 bg-white border border-black/5 rounded-full text-sm font-semibold text-[#1A1A1A] hover:border-emerald-600 hover:text-emerald-600 shadow-sm hover:shadow transition-all text-center flex-grow sm:flex-grow-0">
                {brand}
              </a>
            ))}
          </div>
        </section>

        {/* Promo Band 1 */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row bg-[#FAF7F1] border border-black/5 shadow-sm">
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <span className="text-emerald-600 font-semibold text-[11px] tracking-[0.2em] uppercase mb-4 block">New Arrivals</span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-[#1A1A1A] mb-4">Traditional Elegance</h2>
              <p className="text-[#6B6B6B] mb-8 max-w-md text-base leading-relaxed">
                Discover our curated collection of artisanal jewelry and accessories, crafted for your special moments.
              </p>
              <div>
                <Button className="bg-[#1A1A1A] hover:bg-black text-white rounded-lg px-8 h-12">
                  Shop Collection
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-200 relative min-h-[300px]">
              <img src="/images/pakmart/promo-band-1.jpg" alt="Traditional Jewelry" className="absolute inset-0 w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
            </div>
          </div>
        </section>

        {/* Just For You */}
        <section className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow="Personalized" title="Just For You" subtitle="Products recommended based on your browsing history" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {MOCK_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" className="border-black/10 text-[#1A1A1A] hover:bg-[#FAF7F1] hover:text-emerald-600 rounded-full px-8 h-12 font-semibold">
              Load More Products
            </Button>
          </div>
        </section>

        {/* Shop By Price */}
        <section className="max-w-7xl mx-auto px-4 bg-[#FAF7F1] rounded-[2rem] p-8 lg:p-12 border border-black/5">
          <SectionHeader eyebrow="Budget Friendly" title="Shop by Price" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Under Rs. 999", "Under Rs. 2,499", "Under Rs. 4,999", "Premium Rs. 10,000+"].map((label, i) => (
              <a href="#" key={i} className="group bg-white rounded-2xl p-6 border border-black/5 hover:border-emerald-600/30 hover:shadow-md transition-all flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mb-1 block">Shop</span>
                  <span className="font-display font-bold text-lg text-[#1A1A1A] group-hover:text-emerald-600 transition-colors">{label}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FAF7F1] flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                  <ChevronRight className="w-5 h-5 text-[#6B6B6B] group-hover:text-emerald-600 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Promo Band 2 */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl overflow-hidden flex flex-col-reverse md:flex-row bg-[#1A1A1A] shadow-lg">
            <div className="md:w-1/2 bg-gray-800 relative min-h-[300px]">
              <img src="/images/pakmart/promo-band-2.jpg" alt="Premium Cosmetics" className="absolute inset-0 w-full h-full object-cover opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <span className="text-emerald-400 font-semibold text-[11px] tracking-[0.2em] uppercase mb-4 block">Beauty & Personal Care</span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">The Glow Up Event</h2>
              <p className="text-gray-400 mb-8 max-w-md text-base leading-relaxed">
                Up to 30% off on premium skincare and makeup brands. Embrace your natural radiance.
              </p>
              <div>
                <Button className="bg-white hover:bg-gray-100 text-[#1A1A1A] rounded-lg px-8 h-12">
                  Explore Beauty
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold text-[#6B6B6B] mb-8">What our customers say</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "PakMart's delivery is incredibly fast. I ordered an AC and it was delivered and installed within 24 hours in Lahore.", name: "Ahmed R.", city: "Lahore" },
              { text: "The quality of unstitched fabric I received was exactly as shown in the pictures. Very satisfied with the authentic brands.", name: "Fatima S.", city: "Islamabad" },
              { text: "Their customer service actually resolves issues. Had a return and they handled it smoothly without any hassle.", name: "Zainab A.", city: "Karachi" }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm relative">
                <div className="absolute top-6 left-6 text-emerald-100">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" /></svg>
                </div>
                <div className="relative z-10">
                  <div className="flex text-saffron-500 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-[#1A1A1A] font-medium text-lg leading-relaxed mb-6">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF7F1] flex items-center justify-center text-emerald-700 font-bold font-display">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1A1A] text-sm">{review.name}</p>
                      <p className="text-xs text-[#6B6B6B]">{review.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Download App Band */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-[#0A4A33] rounded-[2rem] overflow-hidden flex flex-col md:flex-row relative">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30"></div>
            
            <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative z-10">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">Shop Anytime, Anywhere</h2>
              <p className="text-emerald-100/80 mb-8 max-w-md text-base leading-relaxed">
                Download the PakMart app for exclusive app-only deals, early access to sales, and seamless order tracking.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-[#1A1A1A] hover:bg-gray-100 rounded-xl h-14 px-6 flex items-center gap-3">
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] leading-none mb-1 text-[#6B6B6B]">Download on the</div>
                    <div className="font-bold leading-none">App Store</div>
                  </div>
                </Button>
                <Button className="bg-white text-[#1A1A1A] hover:bg-gray-100 rounded-xl h-14 px-6 flex items-center gap-3">
                  <Play className="w-5 h-5 fill-current" />
                  <div className="text-left">
                    <div className="text-[10px] leading-none mb-1 text-[#6B6B6B]">GET IT ON</div>
                    <div className="font-bold leading-none">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="md:w-1/2 relative h-[300px] md:h-auto flex items-end justify-center md:justify-end md:pr-16">
              {/* CSS Phone Mockup */}
              <div className="relative w-[240px] h-[480px] bg-white rounded-[2.5rem] border-[8px] border-[#1A1A1A] shadow-2xl translate-y-16 flex flex-col overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-6 bg-[#1A1A1A] rounded-b-xl w-32 mx-auto z-20"></div>
                <div className="flex-1 bg-[#FAF7F1] p-4 pt-8">
                  <div className="w-16 h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-full h-32 bg-emerald-100 rounded-xl mb-4"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-24 bg-white rounded-lg shadow-sm border border-black/5"></div>
                    <div className="h-24 bg-white rounded-lg shadow-sm border border-black/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Expanded Footer */}
      <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Newsletter Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-12 border-b border-white/10 mb-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-display font-bold text-white mb-2">Subscribe to our Newsletter</h3>
              <p className="text-gray-400 text-sm">Get updates on new arrivals, exclusive offers and special promotions.</p>
            </div>
            <div className="w-full md:w-1/2 max-w-md flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="email" placeholder="Enter your email address" className="w-full bg-white/10 border border-white/20 rounded-lg h-12 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:bg-white/15 transition-all" />
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-12 px-6">
                Subscribe
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <a href="#" className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-display font-bold text-lg">
                  P
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  Pak<span className="text-emerald-500 font-medium italic">Mart</span>
                </span>
              </a>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Pakistan's premium online shopping destination for authentic brands, electronics, and lifestyle products.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-600 transition-colors"><Youtube className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Customer Care</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Track Your Order</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Delivery Information</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">About PakMart</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Sell on PakMart</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Popular Categories</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Women's Fashion</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Men's Fashion</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Smartphones</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Home Appliances</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Beauty & Grooming</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contact Info</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>123 Shahrah-e-Faisal, Block 6 PECHS, Karachi, Pakistan</span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>UAN: 111-PAK-MART (725-6278)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>support@pakmart.pk</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Methods & Trust */}
          <div className="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-400 font-medium mr-2">Secure Payments:</span>
              {/* Dummy Payment Badges */}
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-[8px] font-bold text-blue-800">VISA</div>
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-[8px] font-bold text-red-600">MASTER</div>
              <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-[10px] font-bold text-green-700">Easypaisa</div>
              <div className="h-8 w-16 bg-white rounded flex items-center justify-center text-[10px] font-bold text-red-600">JazzCash</div>
              <div className="h-8 w-12 bg-gray-800 border border-gray-600 rounded flex items-center justify-center text-[10px] font-bold text-white">COD</div>
            </div>
            <div className="flex gap-6 items-center text-sm text-gray-400">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Authentic</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 14 Days Return</span>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} PakMart. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
