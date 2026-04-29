import React from "react";
import { Link } from "wouter";
import { 
  useGetOrder,
  getGetOrderQueryKey
} from "@workspace/api-client-react";
import { CheckCircle2, Clock, Truck, Home, MapPin, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getImageUrl } from "@/lib/format";

export function OrderConfirmation({ id }: { id: string }) {
  const { data: order, isLoading } = useGetOrder(Number(id), {
    query: { enabled: !!id, queryKey: getGetOrderQueryKey(Number(id)) }
  });

  if (isLoading || !order) {
    return <div className="min-h-[60vh] flex items-center justify-center text-emerald-600 font-display text-xl animate-pulse">Loading order details...</div>;
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { icon: Clock, text: 'Order Placed', color: 'bg-blue-100 text-blue-700' };
      case 'confirmed': return { icon: CheckCircle2, text: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' };
      case 'shipped': return { icon: Truck, text: 'Shipped', color: 'bg-saffron-100 text-saffron-700' };
      case 'delivered': return { icon: Home, text: 'Delivered', color: 'bg-green-100 text-green-700' };
      default: return { icon: Clock, text: status, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const StatusIcon = getStatusDisplay(order.status).icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20">
      
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl lg:text-5xl font-display font-bold text-[#1A1A1A] mb-4">Thank you for your order!</h1>
        <p className="text-lg text-[#6B6B6B] max-w-lg mx-auto">
          We've received your order and will begin processing it right away. A confirmation email has been sent to you.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button variant="outline" className="border-black/10 text-[#1A1A1A] hover:bg-black/5 rounded-full px-8 h-12">
          <Download className="w-4 h-4 mr-2" /> Download Invoice
        </Button>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-[#FAF7F1] p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5">
          <div>
            <p className="text-sm text-[#6B6B6B] mb-1">Order Number</p>
            <h2 className="text-2xl font-display font-bold text-[#1A1A1A]">{order.orderNumber}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left md:text-right">
              <p className="text-sm text-[#6B6B6B] mb-1">Date Placed</p>
              <p className="font-medium text-[#1A1A1A]">{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <Badge className={`${getStatusDisplay(order.status).color} border-none px-4 py-1.5 rounded-full flex items-center gap-1.5 text-sm`}>
              <StatusIcon className="w-4 h-4" /> {getStatusDisplay(order.status).text}
            </Badge>
          </div>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Order Info & Address */}
          <div>
            <h3 className="font-display font-bold text-xl text-[#1A1A1A] mb-6">Delivery Details</h3>
            
            <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-black/5 mb-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1A1A1A] mb-1">{order.fullName}</p>
                  <p className="text-sm text-[#6B6B6B] mb-1">{order.address}</p>
                  <p className="text-sm text-[#6B6B6B]">{order.city}, Pakistan</p>
                  <p className="text-sm text-[#1A1A1A] font-medium mt-3">{order.phone}</p>
                </div>
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-[#1A1A1A] mb-6">Payment Method</h3>
            <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-2xl p-5 border border-black/5">
              <div className="w-12 h-10 bg-white rounded border border-black/5 flex items-center justify-center font-bold text-xs uppercase text-emerald-600">
                {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}
              </div>
              <div>
                <p className="font-bold text-[#1A1A1A]">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                   order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                   order.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'}
                </p>
                <p className="text-sm text-[#6B6B6B]">Payment to be collected upon delivery.</p>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="font-display font-bold text-xl text-[#1A1A1A] mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#F8F9FA] rounded-lg border border-black/5 flex items-center justify-center p-2 flex-shrink-0">
                    <img src={getImageUrl(item.productImage)} alt={item.productName} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A] text-sm line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-[#6B6B6B]">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-[#1A1A1A] text-sm">
                    {formatPrice(item.lineTotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#FAF7F1] rounded-2xl p-6 border border-black/5 space-y-3">
              <div className="flex justify-between text-sm text-[#6B6B6B]">
                <span>Subtotal</span>
                <span className="text-[#1A1A1A] font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#6B6B6B]">
                <span>Delivery Fee</span>
                <span className="text-[#1A1A1A] font-medium">{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-saffron-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-black/10 mt-4">
                <span className="font-bold text-[#1A1A1A]">Total</span>
                <span className="font-bold text-xl text-emerald-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
