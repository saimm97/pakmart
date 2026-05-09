import React from "react";
import { Link, useLocation } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveCartItem, useClearCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";

export function Cart() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useGetCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const clearCart = useClearCart();

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });

  if (isLoading || !cart) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-emerald-400 font-display text-xl animate-pulse bg-[#0C0E18]">
        Loading your cart...
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="bg-[#0C0E18] min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center flex flex-col items-center py-20">
          <div className="w-32 h-32 bg-emerald-900/30 border border-emerald-800/30 rounded-full flex items-center justify-center mb-8">
            <ShoppingBag className="w-16 h-16 text-emerald-500" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#EEF1FA] mb-4">Your cart is empty</h1>
          <p className="text-[#5A6480] text-lg mb-10 max-w-md">Looks like you haven't added anything yet. Let's fix that!</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-10 h-14 text-base font-bold border-none shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateCartItem.mutate({ id, data: { quantity } }, { onSuccess: invalidateCart });
  };

  const handleRemoveItem = (id: number, name: string) => {
    removeCartItem.mutate({ id }, {
      onSuccess: () => { invalidateCart(); toast.success(`Removed ${name} from cart`); },
      onError: () => toast.error("Failed to remove item"),
    });
  };

  const handleClearCart = () => {
    clearCart.mutate(undefined, {
      onSuccess: () => { invalidateCart(); toast.success("Cart cleared"); },
      onError: () => toast.error("Failed to clear cart"),
    });
  };

  return (
    <div className="bg-[#0C0E18] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#EEF1FA] mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-[#12162A] rounded-3xl p-6 lg:p-8 border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/[0.06]">
                <h2 className="text-lg font-bold text-[#EEF1FA]">Items ({cart.itemCount})</h2>
                <button onClick={handleClearCart} className="text-sm text-red-400 hover:text-red-300 font-medium hover:underline transition-colors">
                  Clear Cart
                </button>
              </div>
              <div className="space-y-8">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-5 group">
                    <Link href={`/product/${item.productSlug}`} className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-xl flex-shrink-0 flex items-center justify-center p-3 border border-black/5">
                      <img src={getImageUrl(item.productImage)} alt={item.productName} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between gap-4 mb-1">
                          <Link href={`/product/${item.productSlug}`} className="font-display font-bold text-[#EEF1FA] text-base hover:text-emerald-400 transition-colors line-clamp-2">
                            {item.productName}
                          </Link>
                          <span className="font-bold text-lg text-[#EEF1FA] whitespace-nowrap">{formatPrice(item.lineTotal)}</span>
                        </div>
                        <p className="text-sm text-[#5A6480] mb-1">{item.productBrand}</p>
                        <p className="text-sm font-semibold text-emerald-400">{formatPrice(item.price)} each</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-[#181B2E] border border-white/[0.08] rounded-full w-fit h-10">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-full flex items-center justify-center text-[#5A6480] hover:text-emerald-400 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-8 text-center font-semibold text-sm text-[#EEF1FA]">{item.quantity}</div>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-full flex items-center justify-center text-[#5A6480] hover:text-emerald-400 transition-colors"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.productName)}
                          className="text-[#3A4060] hover:text-red-400 transition-colors p-2"
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
            <div className="bg-[#12162A] rounded-3xl p-6 lg:p-8 border border-white/[0.06] sticky top-24 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <h2 className="text-xl font-display font-bold text-[#EEF1FA] mb-6 pb-6 border-b border-white/[0.06]">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#5A6480]">
                  <span>Subtotal ({cart.itemCount} items)</span>
                  <span className="text-[#EEF1FA] font-medium">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#5A6480]">
                  <span>Delivery Fee</span>
                  <span className="text-[#EEF1FA] font-medium">{cart.deliveryFee === 0 ? "FREE" : formatPrice(cart.deliveryFee)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-[#E8B84A] font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(cart.discount)}</span>
                  </div>
                )}
              </div>

              {cart.amountToFreeDelivery > 0 && (
                <div className="mb-6 p-4 bg-[#1A1D35] rounded-xl border border-[#E8B84A]/20 text-sm">
                  <div className="flex items-center gap-2 text-[#E8B84A] font-medium mb-2">
                    <Truck className="w-4 h-4" /> Add {formatPrice(cart.amountToFreeDelivery)} more for free delivery
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E8B84A] rounded-full transition-all"
                      style={{ width: `${(cart.subtotal / cart.freeDeliveryThreshold) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {cart.amountToFreeDelivery === 0 && (
                <div className="mb-6 p-3 bg-emerald-900/40 text-emerald-300 font-medium rounded-xl border border-emerald-800/40 text-sm flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Free delivery unlocked!
                </div>
              )}

              <div className="border-t border-white/[0.06] pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-[#EEF1FA]">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#EEF1FA] block leading-none">{formatPrice(cart.total)}</span>
                    <span className="text-xs text-[#5A6480] mt-1 block">Including VAT</span>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg border-none shadow-[0_4px_20px_rgba(16,185,129,0.3)] group">
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <div className="mt-6 flex justify-center items-center gap-3 text-xs text-[#3A4060]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>256-bit SSL Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
