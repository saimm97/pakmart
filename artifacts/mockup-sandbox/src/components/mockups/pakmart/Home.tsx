import React, { useState, useEffect } from "react";
import { 
  Search, ShoppingCart, User, Menu, MapPin, PhoneCall, Heart, 
  ChevronRight, Star, Clock, ArrowRight, ShieldCheck, Truck, 
  CreditCard, Wallet, Smartphone, Tv, Shirt, Grape, Baby, Home as HomeIcon,
  ChevronDown, Eye
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
  { name: "Fashion & Apparel", icon: Shirt, img: "cat-fashion.png" },
  { name: "Mobiles & Tablets", icon: Smartphone, img: "product-phone.png" },
  { name: "Electronics", icon: Tv, img: "product-ac.png" },
  { name: "Groceries", icon: Grape, img: "cat-grocery.png" },
  { name: "Beauty", icon: Heart, img: "product-pickle.png" },
  { name: "Home & Lifestyle", icon: HomeIcon, img: "product-ac.png" },
  { name: "Mother & Baby", icon: Baby, img: "cat-fashion.png" },
];

function ProductCard({ product }: { product: typeof MOCK_PRODUCTS[0] }) {
  return (
    <Card className="group overflow-hidden border border-gray-200 hover:border-emerald-600/30 hover:shadow-md transition-all duration-300 bg-white flex flex-col h-full rounded-xl cursor-pointer">
      <div className="relative p-4 aspect-square bg-white flex items-center justify-center border-b border-gray-50">
        {product.discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-saffron-50 text-saffron-600 border border-saffron-100 hover:bg-saffron-50 font-medium z-10 rounded-md px-2 py-0.5 text-xs shadow-sm">
            {product.discount}% OFF
          </Badge>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-2 group-hover:translate-x-0">
          <button className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-600 transition-colors shadow-sm">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:border-emerald-600 transition-colors shadow-sm">
            <Eye className="w-4 h-4" />
          </button>
        </div>
        <img src={`/__mockup/images/pakmart/${product.img}`} alt={product.name} className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-105 transition-transform duration-500" />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col relative">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">{product.brand}</span>
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[40px] mb-2 leading-snug group-hover:text-emerald-600 transition-colors">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-saffron-500">
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current" />
            <Star className="w-3 h-3 fill-current opacity-30" />
          </div>
          <span className="text-[10px] text-gray-500">({product.reviews})</span>
        </div>

        <div className="mt-auto flex flex-col">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-bold text-gray-900 tracking-tight">Rs. {product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through">Rs. {product.oldPrice.toLocaleString()}</span>
            )}
          </div>
          
          <Button variant="outline" className="w-full mt-3 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100 h-9 pointer-events-none group-hover:pointer-events-auto absolute bottom-4 left-4 right-4 w-[calc(100%-32px)] bg-white">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ eyebrow, title, actionText }: { eyebrow: string, title: string, actionText?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <span className="text-emerald-600 font-semibold text-xs tracking-widest uppercase mb-1 block">{eyebrow}</span>
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">{title}</h2>
      </div>
      {actionText && (
        <a href="#" className="text-gray-600 font-medium text-sm hover:text-emerald-600 transition-colors flex items-center gap-1">
          {actionText} <ChevronRight className="w-4 h-4" />
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

  return (
    <div className="min-h-[100dvh] pakmart-theme selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Top Utility Bar */}
      <div className="bg-gray-900 text-gray-300 text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6 items-center">
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"><PhoneCall className="w-3 h-3" /> UAN: 111-PAK-MART</span>
            <span className="hidden sm:flex items-center gap-1.5"><Truck className="w-3 h-3" /> You are <span className="text-saffron-500 font-bold mx-0.5">Rs. 540</span> away from FREE delivery</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 border-r border-gray-700 pr-4">
              <span className="hover:text-white cursor-pointer transition-colors">Track Order</span>
              <span className="text-gray-700">|</span>
              <span className="hover:text-white cursor-pointer transition-colors">Help Center</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                English / اردو <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                PKR (Rs.) <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-5">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Menu className="w-6 h-6 text-gray-700 lg:hidden cursor-pointer" />
              <a href="#" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 bg-emerald-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md transform group-hover:-rotate-6 transition-transform duration-300">
                  P
                </div>
                <span className="text-2xl font-bold tracking-tight text-gray-900 font-display">
                  Pak<span className="text-emerald-brand">Mart</span>
                </span>
              </a>
            </div>

            {/* Delivery Selector (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:bg-gray-50 py-2 px-3 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div className="text-sm">
                <p className="text-gray-500 text-[10px] leading-none mb-1">Deliver to</p>
                <p className="font-semibold text-gray-900 leading-none">Karachi, Sindh</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:flex relative group">
              <div className="flex w-full h-11 border border-gray-300 rounded-full overflow-hidden bg-white focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-emerald-600 transition-all shadow-inner shadow-gray-50/50">
                <select className="bg-gray-50 border-r border-gray-300 text-sm text-gray-600 px-3 outline-none cursor-pointer hover:bg-gray-100 transition-colors max-w-[120px]">
                  <option>All</option>
                  <option>Fashion</option>
                  <option>Electronics</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Search products, brands, and categories..." 
                  className="flex-1 px-4 text-sm outline-none text-gray-800 placeholder:text-gray-400"
                />
                <button className="w-12 flex items-center justify-center bg-emerald-brand text-white hover-bg-emerald-brand transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 lg:space-x-5 flex-shrink-0">
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <User className="w-6 h-6 text-gray-700 group-hover:text-emerald-brand transition-colors" strokeWidth={1.5} />
                </div>
                <div className="hidden lg:block text-sm">
                  <p className="text-gray-500 text-[10px] leading-none mb-1">Sign In</p>
                  <p className="font-semibold text-gray-900 leading-none group-hover:text-emerald-brand transition-colors">Account</p>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <Heart className="w-6 h-6 text-gray-700 group-hover:text-emerald-brand transition-colors" strokeWidth={1.5} />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-brand text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm">
                    12
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 cursor-pointer group pl-2 border-l border-gray-200">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-emerald-brand transition-colors" strokeWidth={1.5} />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-saffron-brand text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm">
                    3
                  </span>
                </div>
                <div className="hidden lg:block text-sm">
                  <p className="text-gray-500 text-[10px] leading-none mb-1">Cart</p>
                  <p className="font-semibold text-gray-900 leading-none group-hover:text-emerald-brand transition-colors">Rs. 4,590</p>
                </div>
              </div>
            </div>

          </div>
          
          {/* Mobile Search */}
          <div className="mt-4 md:hidden relative">
            <input 
              type="text" 
              placeholder="Search PakMart..." 
              className="w-full bg-white border border-gray-300 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Mega Nav */}
        <nav className="bg-white border-t border-gray-100 hidden lg:block relative">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center space-x-8 text-sm font-medium text-gray-600">
              <li className="py-3 text-emerald-brand flex items-center gap-2 cursor-pointer font-semibold border-b-2 border-emerald-brand">
                <Menu className="w-4 h-4" /> Browse Categories
              </li>
              
              <li className="py-3 hover-text-emerald-brand cursor-pointer transition-colors relative mega-menu-trigger">
                Fashion & Apparel
                {/* Mega Menu Dropdown */}
                <div className="mega-menu-panel absolute top-full left-0 w-[800px] bg-white border border-gray-100 shadow-xl rounded-b-xl z-50 pt-6 pb-6 px-8 cursor-default">
                  <div className="grid grid-cols-4 gap-8">
                    <div className="col-span-3 grid grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Women's Fashion</h4>
                        <ul className="space-y-2.5 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Unstitched Fabric</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Pret Wear</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Eastern Wear</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Western Wear</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Shoes & Bags</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Men's Fashion</h4>
                        <ul className="space-y-2.5 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Shalwar Kameez</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">T-Shirts & Polos</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Jeans & Trousers</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Formal Wear</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Footwear</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Top Brands</h4>
                        <ul className="space-y-2.5 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Khaadi</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Gul Ahmed</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Sapphire</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">J.</a></li>
                          <li><a href="#" className="hover:text-emerald-600 transition-colors">Outfitters</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-span-1 bg-gray-50 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                      <img src="/__mockup/images/pakmart/promo-fashion.png" alt="Fashion Promo" className="w-full h-32 object-cover rounded-lg mb-3 shadow-sm" />
                      <h4 className="font-bold text-gray-900 mb-1">Eid Collection '24</h4>
                      <p className="text-xs text-gray-500 mb-3">Up to 40% off on all leading brands</p>
                      <Button size="sm" className="bg-emerald-brand text-white hover-bg-emerald-brand w-full text-xs">Shop Now</Button>
                    </div>
                  </div>
                </div>
              </li>
              
              <li className="py-3 hover-text-emerald-brand cursor-pointer transition-colors">Mobiles & Tablets</li>
              <li className="py-3 hover-text-emerald-brand cursor-pointer transition-colors">Electronics</li>
              <li className="py-3 hover-text-emerald-brand cursor-pointer transition-colors">Groceries</li>
              <li className="py-3 hover-text-emerald-brand cursor-pointer transition-colors">Beauty</li>
              <li className="py-3 hover-text-emerald-brand cursor-pointer transition-colors">Home & Lifestyle</li>
              <li className="py-3 hover-text-emerald-brand cursor-pointer transition-colors">Mother & Baby</li>
              <li className="py-3 hover-text-emerald-brand cursor-pointer transition-colors">Sports</li>
              <li className="py-3 hover-text-emerald-brand cursor-pointer transition-colors text-saffron-600 font-semibold flex items-center gap-1">
                Eid Specials
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12 lg:space-y-16">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[460px]">
          {/* Main Hero Banner */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden group shadow-md bg-gray-900 flex items-center">
            <img src="/__mockup/images/pakmart/hero-banner.png" alt="Grand Festive Sale" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transform group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
            
            <div className="relative z-10 p-8 lg:p-14 max-w-lg">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-6 px-3 py-1 text-xs uppercase tracking-widest font-bold">New Collection</Badge>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-[1.1]">
                Elevate your <br/><span className="text-emerald-400 italic">festive style.</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed font-light">
                Discover the season's finest unstitched fabrics and pret wear. Free shipping nationwide on orders above Rs. 2,000.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-emerald-brand hover-bg-emerald-brand text-white rounded-full px-8 h-12 text-sm font-semibold border-none">
                  Shop Men
                </Button>
                <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-full px-8 h-12 text-sm font-semibold transition-colors">
                  Shop Women
                </Button>
              </div>
            </div>
          </div>
          
          {/* Side Promos */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-6 h-full">
            <div className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-gray-100">
              <img src="/__mockup/images/pakmart/promo-fashion.png" alt="Summer Edit" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-display font-bold text-white mb-1">Summer Edit</h3>
                <p className="text-gray-200 text-sm mb-4">Starting at Rs. 1,499</p>
                <div className="flex items-center text-emerald-400 text-sm font-semibold group-hover:translate-x-2 transition-transform">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-[#fdfcf8] border border-gray-200 p-6 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Digital Payment Offer</h3>
              <p className="text-gray-600 text-sm mb-4 px-4">Get extra 10% off when you pay via Easypaisa or JazzCash</p>
              <Badge variant="outline" className="border-gray-300 text-gray-700 bg-white shadow-sm">Code: DIGI10</Badge>
            </div>
          </div>
        </section>

        {/* Categories Browser */}
        <section>
          <SectionHeader eyebrow="Shop by Category" title="Explore Categories" />
          <div className="flex flex-nowrap overflow-x-auto pb-4 gap-4 lg:gap-6 hide-scrollbar snap-x">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-3 min-w-[100px] snap-center group cursor-pointer">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center p-4 group-hover:border-emerald-600 group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
                  <cat.icon className="w-8 h-8 text-gray-400 group-hover:text-emerald-600 transition-colors" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sale / Deal of the Day */}
        <section className="bg-emerald-50 rounded-3xl p-6 lg:p-10 border border-emerald-100 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-saffron-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm animate-pulse">LIVE</span>
                <span className="text-emerald-800 font-semibold text-xs tracking-widest uppercase">Deal of the Day</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 flex items-center gap-4">
                Flash Sale
                <div className="flex gap-1.5 text-sm font-ui bg-white px-3 py-1.5 rounded-lg shadow-sm border border-emerald-100">
                  <span className="bg-gray-900 text-white rounded px-2 py-0.5 font-semibold w-8 text-center">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span className="text-gray-900 font-bold">:</span>
                  <span className="bg-gray-900 text-white rounded px-2 py-0.5 font-semibold w-8 text-center">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span className="text-gray-900 font-bold">:</span>
                  <span className="bg-saffron-500 text-white rounded px-2 py-0.5 font-semibold w-8 text-center shadow-inner">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                </div>
              </h2>
            </div>
            <a href="#" className="text-emerald-700 font-medium text-sm hover:text-emerald-800 transition-colors flex items-center gap-1">
              View all deals <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {MOCK_PRODUCTS.slice(0, 4).map((product, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100/50 hover:shadow-md transition-shadow relative group cursor-pointer">
                <Badge className="absolute top-3 left-3 bg-saffron-50 text-saffron-600 border border-saffron-100 hover:bg-saffron-50 font-medium z-10 rounded-md px-2 py-0.5 text-xs">
                  -{product.discount}%
                </Badge>
                <div className="aspect-square bg-white mb-4 p-4 flex items-center justify-center rounded-lg relative overflow-hidden">
                  <img src={`/__mockup/images/pakmart/${product.img}`} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 block">{product.brand}</span>
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 min-h-[40px] mb-2 leading-snug group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-bold text-gray-900 tracking-tight">Rs. {product.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 line-through">Rs. {product.oldPrice?.toLocaleString()}</span>
                </div>
                
                {/* Stock Progress */}
                <div>
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1.5 font-medium uppercase tracking-wider">
                    <span>Available: {product.stock - product.sold}</span>
                    <span>Sold: {product.sold}</span>
                  </div>
                  <Progress value={(product.sold / product.stock) * 100} className="h-1.5 bg-emerald-100 [&>div]:bg-saffron-500" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Promo Band */}
        <section className="bg-gray-900 rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row items-center border border-gray-800">
          <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-start">
            <span className="text-saffron-400 font-semibold text-xs tracking-widest uppercase mb-4 block">Essential Restock</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">Monthly Pantry Fill-up</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light max-w-md">
              Stock up on tea, rice, spices, and all your daily essentials. Bulk discounts applied automatically at checkout.
            </p>
            <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 h-12 text-sm font-semibold border-none">
              Shop Groceries
            </Button>
          </div>
          <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
            <img src="/__mockup/images/pakmart/cat-grocery.png" alt="Groceries" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-gray-900 to-transparent md:w-1/3"></div>
          </div>
        </section>

        {/* Rails */}
        <section>
          <SectionHeader eyebrow="Trending Now" title="Most Popular" actionText="View all trending" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {MOCK_PRODUCTS.slice(0, 5).map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Just Dropped" title="New Arrivals" actionText="View all new" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {[...MOCK_PRODUCTS].reverse().slice(0, 5).map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Curated For You" title="Best of Fashion" actionText="View all fashion" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {MOCK_PRODUCTS.filter(p => p.brand === "Khaadi" || p.brand === "Servis").concat(MOCK_PRODUCTS.slice(0, 3)).map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </section>
        
        <section>
          <SectionHeader eyebrow="Top Tech" title="Mobiles & Tablets" actionText="View all tech" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {MOCK_PRODUCTS.filter(p => p.brand === "Infinix" || p.brand === "PEL").concat(MOCK_PRODUCTS.slice(0, 3)).map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 mt-16 mb-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders over Rs. 2,000" },
              { icon: ShieldCheck, title: "100% Authentic", desc: "Verified brands & sellers" },
              { icon: Clock, title: "7-Day Returns", desc: "Hassle-free return policy" },
              { icon: CreditCard, title: "Secure Payments", desc: "JazzCash, Easypaisa, Cards" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col lg:flex-row items-center gap-4 pt-6 md:pt-0 first:pt-0 lg:px-6 text-center lg:text-left">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <item.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-emerald-600 font-sans">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Newsletter Signup */}
          <div className="bg-gray-800 rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-700 shadow-xl">
            <div className="max-w-md">
              <h3 className="text-2xl font-display font-bold text-white mb-2">Join the PakMart Family</h3>
              <p className="text-gray-400 text-sm">Subscribe to our newsletter and get a <span className="text-emerald-400 font-semibold">Rs. 200 discount</span> on your first order.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 w-full md:w-80 shadow-inner"
              />
              <Button className="bg-emerald-brand hover-bg-emerald-brand text-white h-full px-6 border-none">
                Subscribe
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            
            {/* Brand Col */}
            <div className="col-span-2 lg:col-span-2 pr-8">
              <a href="#" className="flex items-center gap-2.5 mb-6 opacity-90 hover:opacity-100 transition-opacity w-fit">
                <div className="w-10 h-10 bg-emerald-brand rounded-xl flex items-center justify-center text-white font-bold text-xl transform -rotate-6">
                  P
                </div>
                <span className="text-2xl font-bold tracking-tight text-white font-display">
                  Pak<span className="text-emerald-brand">Mart</span>
                </span>
              </a>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed max-w-sm">
                Pakistan's premium online marketplace. Elevating your shopping experience with curated brands, seamless delivery, and authentic products.
              </p>
              <div className="flex space-x-3">
                {/* Social icons */}
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-emerald-brand hover:border-emerald-brand text-gray-400 hover:text-white transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-emerald-brand hover:border-emerald-brand text-gray-400 hover:text-white transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-emerald-brand hover:border-emerald-brand text-gray-400 hover:text-white transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-white font-semibold mb-6">Customer Service</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">About PakMart</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Payment Methods</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-800 text-xs px-2.5 py-1.5 rounded border border-gray-700">Cash on Delivery</span>
                <span className="bg-gray-800 text-xs px-2.5 py-1.5 rounded border border-gray-700">Easypaisa</span>
                <span className="bg-gray-800 text-xs px-2.5 py-1.5 rounded border border-gray-700">JazzCash</span>
                <span className="bg-gray-800 text-xs px-2.5 py-1.5 rounded border border-gray-700">Visa / Mastercard</span>
              </div>
              <h4 className="text-white font-semibold mb-4 mt-6">Verified by</h4>
              <span className="bg-gray-800 text-xs px-3 py-1.5 rounded border border-gray-700 flex items-center w-fit gap-1.5 text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure SSL
              </span>
            </div>
            
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; 2024 PakMart Private Limited. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Karachi</span> • <span>Lahore</span> • <span>Islamabad</span> • <span>Rawalpindi</span> • <span>Faisalabad</span> • <span>Multan</span> • <span>Peshawar</span> • <span>Quetta</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
