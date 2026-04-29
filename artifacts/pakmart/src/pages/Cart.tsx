import React from "react";
import { Link, useLocation } from "wouter";
import { 
  useGetCart, 
  useUpdateCartItem, 
  useRemoveCartItem,
  useClearCart
} from "@workspace/api-client-react";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export function Cart() {
  const [, setLocation] = useLocation();
  const { data: cart, isLoading } = useGetCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const clearCart = useClearCart();

  if (isLoading || !cart) {
    return <div className="min-h-[50vh] flex items-center justify-center text-emerald-600 font-display text-xl animate-pulse">Loading your cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-16 h-16 text-emerald-600" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#1A1A1A] mb-4">Your cart is empty</h1>
        <p className="text-[#6B6B6B] text-lg mb-10 max-w-md">Looks like you haven't added anything to your cart yet. Let's fix that!</p>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-10 h-14 text-base font-bold shadow-lg shadow-emerald-600/20">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateCartItem.mutate({ id, data: { quantity } });
  };

  const handleRemoveItem = (id: number, name: string) => {
    removeCartItem.mutate({ id }, {
      onSuccess: () => toast.success(`Removed ${name} from cart`)
    });
  };

  const handleClearCart = () => {
    clearCart.mutate({}, {
      onSuccess: () => toast.success("Cart cleared")
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#1A1A1A] mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-black/5">
              <h2 className="text-lg font-bold text-[#1A1A1A]">Items ({cart.itemCount})</h2>
              <button 
                onClick={handleClearCart}
                className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-8">
              {cart.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 relative group">
                  <Link href={`/product/${item.productSlug}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-[#F8F9FA] rounded-xl flex-shrink-0 flex items-center justify-center p-3 border border-black/5">
                    <img src={getImageUrl(item.productImage)} alt={item.productName} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </Link>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between gap-4 mb-1">
                        <Link href={`/product/${item.productSlug}`} className="font-display font-bold text-[#1A1A1A] text-lg hover:text-emerald-600 transition-colors line-clamp-2">
                          {item.productName}
                        </Link>
                        <span className="font-bold text-lg text-[#1A1A1A] whitespace-nowrap">{formatPrice(item.lineTotal)}</span>
                      </div>
                      <p className="text-sm text-[#6B6B6B] mb-2">{item.productBrand}</p>
                      <p className="text-sm font-medium text-emerald-600">{formatPrice(item.price)} each</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center bg-[#FAF7F1] border border-black/10 rounded-full w-fit h-10">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-8 text-center font-semibold text-sm text-[#1A1A1A]">{item.quantity}</div>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveItem(item.id, item.productName)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5 sticky top-24">
            <h2 className="text-xl font-display font-bold text-[#1A1A1A] mb-6 pb-6 border-b border-black/5">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Subtotal ({cart.itemCount} items)</span>
                <span className="text-[#1A1A1A] font-medium">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Delivery Fee</span>
                <span className="text-[#1A1A1A] font-medium">{cart.deliveryFee === 0 ? 'FREE' : formatPrice(cart.deliveryFee)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-saffron-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}
            </div>

            {cart.amountToFreeDelivery > 0 && (
              <div className="mb-6 p-4 bg-[#FAF7F1] rounded-xl border border-saffron-200 text-sm">
                <div className="flex items-center gap-2 text-saffron-700 font-medium mb-2">
                  <ShieldCheck className="w-4 h-4" /> Add {formatPrice(cart.amountToFreeDelivery)} more for free delivery
                </div>
                <div className="w-full h-1.5 bg-saffron-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-saffron-500 rounded-full" 
                    style={{ width: `${(cart.subtotal / cart.freeDeliveryThreshold) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {cart.amountToFreeDelivery === 0 && (
              <div className="mb-6 p-3 bg-emerald-50 text-emerald-700 font-medium rounded-xl border border-emerald-100 text-sm flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Free delivery unlocked!
              </div>
            )}

            <Separator className="my-6" />
            
            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-bold text-[#1A1A1A]">Total</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#1A1A1A] block leading-none">{formatPrice(cart.total)}</span>
                <span className="text-xs text-[#6B6B6B] mt-1 block">Including VAT</span>
              </div>
            </div>

            <Button asChild className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/20 group">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <div className="mt-6 flex justify-center items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 opacity-50 grayscale" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 opacity-50 grayscale" />
              <span className="text-xs text-gray-400 font-medium ml-2 border-l border-gray-200 pl-4">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
