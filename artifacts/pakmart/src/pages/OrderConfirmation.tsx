import React from "react";
import { Link } from "wouter";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { CheckCircle2, Clock, Truck, Home, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getImageUrl } from "@/lib/format";

export function OrderConfirmation({ id }: { id: string }) {
  const { data: order, isLoading } = useGetOrder(Number(id), {
    query: { enabled: !!id, queryKey: getGetOrderQueryKey(Number(id)) }
  });

  if (isLoading || !order) {
    return (
      <div className="min-h-[60vh] bg-[#0C0E18] flex items-center justify-center text-emerald-400 font-display text-xl animate-pulse">
        Loading order details...
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":   return { icon: Clock,         text: "Order Placed", cls: "bg-blue-900/50 text-blue-300 border-blue-800/40" };
      case "confirmed": return { icon: CheckCircle2,  text: "Confirmed",    cls: "bg-emerald-900/50 text-emerald-300 border-emerald-800/40" };
      case "shipped":   return { icon: Truck,         text: "Shipped",      cls: "bg-[#2A1F08] text-[#E8B84A] border-[#3A2F10]" };
      case "delivered": return { icon: Home,          text: "Delivered",    cls: "bg-emerald-900/50 text-emerald-300 border-emerald-800/40" };
      default:          return { icon: Clock,         text: status,         cls: "bg-white/5 text-[#8A93B4] border-white/10" };
    }
  };

  const { icon: StatusIcon, text: statusText, cls: statusCls } = getStatusDisplay(order.status);
  const panelCls = "bg-[#12162A] rounded-2xl border border-white/[0.06] p-5";

  return (
    <div className="bg-[#0C0E18] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20">

        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-emerald-900/40 border border-emerald-800/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-[#EEF1FA] mb-4">Order Confirmed!</h1>
          <p className="text-lg text-[#5A6480] max-w-lg mx-auto">
            We've received your order and will begin processing it right away.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-8 h-12 border-none shadow-[0_4px_16px_rgba(16,185,129,0.3)]">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button variant="outline" className="border-white/10 text-[#EEF1FA] hover:bg-white/5 rounded-full px-8 h-12 bg-transparent">
            <Download className="w-4 h-4 mr-2" /> Download Invoice
          </Button>
        </div>

        {/* Order Card */}
        <div className="bg-[#12162A] rounded-3xl border border-white/[0.06] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
          {/* Ribbon */}
          <div className="bg-[#181B2E] p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06]">
            <div>
              <p className="text-sm text-[#5A6480] mb-1">Order Number</p>
              <h2 className="text-2xl font-display font-bold text-[#EEF1FA]">{order.orderNumber}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-left md:text-right">
                <p className="text-sm text-[#5A6480] mb-1">Date Placed</p>
                <p className="font-medium text-[#EEF1FA]">{new Date(order.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <Badge className={`${statusCls} border px-4 py-1.5 rounded-full flex items-center gap-1.5 text-sm`}>
                <StatusIcon className="w-4 h-4" /> {statusText}
              </Badge>
            </div>
          </div>

          <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Delivery + Payment */}
            <div>
              <h3 className="font-display font-bold text-lg text-[#EEF1FA] mb-5">Delivery Details</h3>
              <div className={`${panelCls} mb-6`}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#EEF1FA] mb-1">{order.fullName}</p>
                    <p className="text-sm text-[#5A6480] mb-0.5">{order.address}</p>
                    <p className="text-sm text-[#5A6480]">{order.city}, Pakistan</p>
                    <p className="text-sm text-[#8A93B4] font-medium mt-2">{order.phone}</p>
                  </div>
                </div>
              </div>

              <h3 className="font-display font-bold text-lg text-[#EEF1FA] mb-5">Payment Method</h3>
              <div className={panelCls}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 bg-[#181B2E] rounded-lg border border-white/8 flex items-center justify-center font-bold text-xs uppercase text-emerald-400">
                    {order.paymentMethod === "cod" ? "COD" :
                     order.paymentMethod === "card" ? (order.cardBrand?.slice(0,4) || "CARD") :
                     order.paymentMethod === "easypaisa" ? "EP" : "JC"}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#EEF1FA] text-sm">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" :
                       order.paymentMethod === "card" ? `${order.cardBrand || "Card"} •••• ${order.cardLast4 || ""}` :
                       order.paymentMethod === "easypaisa" ? "Easypaisa Wallet" : "JazzCash Wallet"}
                    </p>
                    <p className="text-xs text-[#5A6480]">
                      {order.paymentMethod === "cod" ? "Payment collected upon delivery." :
                       order.paymentMobile ? `Charged to ${order.paymentMobile}` : "Payment authorized successfully."}
                    </p>
                  </div>
                  {order.paymentStatus === "succeeded" && (
                    <Badge className="bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 px-3 py-1 rounded-full text-xs">Paid</Badge>
                  )}
                  {order.paymentStatus === "pending" && order.paymentMethod === "cod" && (
                    <Badge className="bg-[#2A1F08] text-[#E8B84A] border border-[#3A2F10] px-3 py-1 rounded-full text-xs">Pay on delivery</Badge>
                  )}
                </div>
                {order.transactionId && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[#5A6480]">Transaction ID</span>
                    <span className="font-mono text-[#8A93B4]">{order.transactionId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Items Summary */}
            <div>
              <h3 className="font-display font-bold text-lg text-[#EEF1FA] mb-5">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={`${item.productId}-${idx}`} className="flex gap-3 items-center">
                    <div className="w-14 h-14 bg-white rounded-xl border border-white/5 flex items-center justify-center p-2 flex-shrink-0">
                      <img src={getImageUrl(item.productImage)} alt={item.productName} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#EEF1FA] text-sm line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-[#5A6480]">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-[#EEF1FA] text-sm whitespace-nowrap">{formatPrice(item.lineTotal)}</div>
                  </div>
                ))}
              </div>
              <div className={`${panelCls} space-y-3`}>
                <div className="flex justify-between text-sm text-[#5A6480]">
                  <span>Subtotal</span><span className="text-[#EEF1FA]">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#5A6480]">
                  <span>Delivery Fee</span>
                  <span className={order.deliveryFee === 0 ? "text-emerald-400 font-semibold" : "text-[#EEF1FA]"}>
                    {order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-[#E8B84A] font-medium">
                    <span>Discount</span><span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-white/[0.06]">
                  <span className="font-bold text-[#EEF1FA]">Total</span>
                  <span className="font-bold text-xl text-emerald-400">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
