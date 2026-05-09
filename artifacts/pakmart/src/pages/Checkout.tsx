import React from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetCart, useCreateOrder, useProcessCardPayment, useProcessMobilePayment,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { ShieldCheck, CreditCard, Banknote, MapPin, Building, Lock, Smartphone, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

const CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta","Sialkot","Gujranwala","Hyderabad"];

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(11, "Valid phone number is required").max(15),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  address: z.string().min(10, "Complete address is required"),
  city: z.string().min(1, "City is required"),
  paymentMethod: z.enum(["cod","easypaisa","jazzcash","card"]),
  notes: z.string().optional(),
  cardNumber: z.string().optional(),
  cardholderName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  walletMobile: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "card") {
    const digits = (data.cardNumber || "").replace(/\s/g, "");
    if (digits.length < 13 || digits.length > 19 || !/^\d+$/.test(digits))
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cardNumber"], message: "Enter a valid card number" });
    if (!data.cardholderName || data.cardholderName.trim().length < 2)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cardholderName"], message: "Cardholder name required" });
    if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(data.cardExpiry))
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cardExpiry"], message: "Use MM/YY" });
    if (!data.cardCvv || !/^\d{3,4}$/.test(data.cardCvv))
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cardCvv"], message: "3 or 4 digits" });
  }
  if (data.paymentMethod === "easypaisa" || data.paymentMethod === "jazzcash") {
    const m = (data.walletMobile || "").replace(/\D/g, "");
    if (!/^03\d{9}$/.test(m))
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["walletMobile"], message: "Enter a valid Pakistani mobile (03XX XXXXXXX)" });
  }
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

const inputCls = "h-12 bg-[#181B2E] border-white/[0.08] text-[#EEF1FA] placeholder:text-[#3E475E] focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500/50 rounded-xl";
const labelCls = "text-[#8A93B4] font-medium text-sm";

export function Checkout() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useGetCart();
  const createOrder = useCreateOrder();
  const processCard = useProcessCardPayment();
  const processMobile = useProcessMobilePayment();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "", phone: "", email: "", address: "", city: "",
      paymentMethod: (() => {
        const pm = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("pm") : null;
        return pm === "card" || pm === "easypaisa" || pm === "jazzcash" ? pm : "cod";
      })(),
      notes: "", cardNumber: "", cardholderName: "", cardExpiry: "", cardCvv: "", walletMobile: "",
    }
  });

  const paymentMethod = form.watch("paymentMethod");

  React.useEffect(() => {
    if (cart && cart.items.length === 0) setLocation("/cart");
  }, [cart, setLocation]);

  if (isLoading || !cart) {
    return (
      <div className="min-h-[50vh] bg-[#0C0E18] flex items-center justify-center text-emerald-400 font-display text-xl animate-pulse">
        Loading secure checkout...
      </div>
    );
  }
  if (cart.items.length === 0) return null;

  const isProcessing = createOrder.isPending || processCard.isPending || processMobile.isPending;

  const onSubmit = async (data: CheckoutFormValues) => {
    let transactionId: string | null = null;
    let cardBrand: string | null = null;
    let cardLast4: string | null = null;
    let paymentMobile: string | null = null;

    try {
      if (data.paymentMethod === "card") {
        const [mm, yy] = (data.cardExpiry || "").split("/");
        const result = await processCard.mutateAsync({ data: {
          cardNumber: (data.cardNumber || "").replace(/\s/g, ""),
          expMonth: parseInt(mm, 10),
          expYear: 2000 + parseInt(yy, 10),
          cvv: data.cardCvv || "",
          cardholderName: data.cardholderName || "",
          amount: cart.total,
        }});
        if (!result.success) { toast.error(result.message || "Payment was declined"); return; }
        transactionId = result.transactionId;
        cardBrand = result.cardBrand ?? null;
        cardLast4 = result.cardLast4 ?? null;
      } else if (data.paymentMethod === "easypaisa" || data.paymentMethod === "jazzcash") {
        paymentMobile = (data.walletMobile || "").replace(/\D/g, "");
        const result = await processMobile.mutateAsync({ data: {
          provider: data.paymentMethod,
          mobileNumber: paymentMobile,
          amount: cart.total,
        }});
        if (!result.success) { toast.error(result.message || "Wallet payment was declined"); return; }
        transactionId = result.transactionId;
      }
    } catch (err: any) {
      const result = err?.response?.data;
      toast.error(result?.message || result?.error || "Payment processing failed. Please try again.");
      return;
    }

    createOrder.mutate({ data: {
      fullName: data.fullName, phone: data.phone, email: data.email || null,
      address: data.address, city: data.city, paymentMethod: data.paymentMethod,
      notes: data.notes || null, transactionId, cardBrand, cardLast4, paymentMobile,
    }}, {
      onSuccess: (order) => {
        toast.success("Order placed successfully!");
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setLocation(`/order/${order.id}`);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error || "Failed to place order. Please try again.");
      }
    });
  };

  const panelCls = "bg-[#12162A] rounded-3xl p-6 lg:p-8 border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]";
  const pm = form.watch("paymentMethod");

  return (
    <div className="bg-[#0C0E18] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Lock className="w-5 h-5 text-emerald-500" />
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#EEF1FA]">Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <div className="lg:w-3/5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Shipping */}
                <div className={panelCls}>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.06]">
                    <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-800/30 flex items-center justify-center text-emerald-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold font-display text-[#EEF1FA]">Shipping Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelCls}>Full Name <span className="text-red-400">*</span></FormLabel>
                        <FormControl><Input placeholder="Ali Khan" className={inputCls} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelCls}>Phone Number <span className="text-red-400">*</span></FormLabel>
                        <FormControl><Input placeholder="0300 1234567" className={inputCls} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelCls}>Email Address (Optional)</FormLabel>
                        <FormControl><Input placeholder="ali@example.com" type="email" className={inputCls} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelCls}>Complete Address <span className="text-red-400">*</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="House/Apartment No, Street, Area" className={`${inputCls} min-h-[90px] resize-none`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelCls}>City <span className="text-red-400">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputCls}>
                              <SelectValue placeholder="Select your city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CITIES.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelCls}>Delivery Instructions (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. Leave at front door, call before arriving" className={inputCls} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* Payment */}
                <div className={panelCls}>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.06]">
                    <div className="w-10 h-10 rounded-xl bg-[#2A1F08] border border-[#3A2F10] flex items-center justify-center text-[#E8B84A]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold font-display text-[#EEF1FA]">Payment Method</h2>
                  </div>
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-3">
                          {[
                            { value: "cod", label: "Cash on Delivery (COD)", icon: Banknote, badge: "Pay when you receive" },
                            { value: "card", label: "Credit / Debit Card", icon: CreditCard, badge: "VISA · MC" },
                            { value: "easypaisa", label: "Easypaisa", icon: Smartphone, badge: "Mobile Wallet" },
                            { value: "jazzcash", label: "JazzCash", icon: Building, badge: "Mobile Wallet" },
                          ].map(({ value, label, icon: Icon, badge }) => (
                            <label
                              key={value}
                              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === value ? "border-emerald-500/50 bg-emerald-900/20" : "border-white/[0.06] bg-[#181B2E] hover:border-white/[0.12]"}`}
                            >
                              <div className="flex items-center gap-4">
                                <RadioGroupItem value={value} id={value} className="text-emerald-500 border-white/20" />
                                <div className="flex items-center gap-2.5">
                                  <Icon className={`w-5 h-5 ${field.value === value ? "text-emerald-400" : "text-[#5A6480]"}`} />
                                  <span className={`font-bold text-sm ${field.value === value ? "text-[#EEF1FA]" : "text-[#8A93B4]"}`}>{label}</span>
                                </div>
                              </div>
                              <span className="hidden sm:inline text-xs font-medium text-[#5A6480] bg-white/5 border border-white/8 px-2 py-1 rounded-lg">{badge}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {paymentMethod === "card" && (
                    <div className="mt-5 p-5 rounded-2xl bg-[#181B2E] border border-white/[0.06] space-y-5">
                      <div className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-3">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span><span className="font-bold">Test mode</span> — try card <span className="font-mono font-bold">4242 4242 4242 4242</span> with any future expiry and any CVV. Cards ending <span className="font-mono">0000</span> simulate a decline.</span>
                      </div>
                      <FormField control={form.control} name="cardNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>Card Number <span className="text-red-400">*</span></FormLabel>
                          <FormControl>
                            <Input inputMode="numeric" placeholder="4242 4242 4242 4242" className={`${inputCls} font-mono tracking-wide`}
                              value={field.value} onChange={(e) => field.onChange(formatCardNumber(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="cardholderName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>Name on Card <span className="text-red-400">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="ALI KHAN" className={`${inputCls} uppercase`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelCls}>Expiry <span className="text-red-400">*</span></FormLabel>
                            <FormControl>
                              <Input inputMode="numeric" placeholder="MM/YY" className={`${inputCls} font-mono`}
                                value={field.value} onChange={(e) => field.onChange(formatExpiry(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="cardCvv" render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelCls}>CVV <span className="text-red-400">*</span></FormLabel>
                            <FormControl>
                              <Input inputMode="numeric" placeholder="123" maxLength={4} className={`${inputCls} font-mono`}
                                value={field.value} onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  )}

                  {(paymentMethod === "easypaisa" || paymentMethod === "jazzcash") && (
                    <div className="mt-5 p-5 rounded-2xl bg-[#181B2E] border border-white/[0.06] space-y-4">
                      <div className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-900/30 border border-emerald-800/30 rounded-xl p-3">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span><span className="font-bold">Test mode</span> — any 11-digit Pakistani mobile (e.g. <span className="font-mono">03001234567</span>) authorizes. Numbers ending <span className="font-mono">0000</span> simulate a decline.</span>
                      </div>
                      <FormField control={form.control} name="walletMobile" render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>{paymentMethod === "easypaisa" ? "Easypaisa" : "JazzCash"} Mobile Number <span className="text-red-400">*</span></FormLabel>
                          <FormControl>
                            <Input inputMode="numeric" placeholder="0300 1234567" className={`${inputCls} font-mono`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  )}
                </div>

                <div className="hidden lg:block">
                  <Button type="submit" disabled={isProcessing} className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg border-none shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
                    {processCard.isPending || processMobile.isPending ? "Authorizing payment..." : createOrder.isPending ? "Placing order..." : `Place Order · ${formatPrice(cart.total)}`}
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-xs text-[#3A4060] mt-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" /> 256-bit SSL Secure Checkout · Your data is protected
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-2/5">
            <div className={`${panelCls} sticky top-24`}>
              <h2 className="text-xl font-display font-bold text-[#EEF1FA] mb-6 pb-6 border-b border-white/[0.06]">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto hide-scrollbar">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-14 h-14 bg-white rounded-xl border border-white/5 flex items-center justify-center p-2 flex-shrink-0">
                      <img src={getImageUrl(item.productImage)} alt={item.productName} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#EEF1FA] line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-[#5A6480]">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-sm text-[#EEF1FA] whitespace-nowrap">{formatPrice(item.lineTotal)}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                <div className="flex justify-between text-sm text-[#5A6480]">
                  <span>Subtotal</span><span className="text-[#EEF1FA]">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#5A6480]">
                  <span>Delivery</span><span className={cart.deliveryFee === 0 ? "text-emerald-400 font-semibold" : "text-[#EEF1FA]"}>{cart.deliveryFee === 0 ? "FREE" : formatPrice(cart.deliveryFee)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-sm text-[#E8B84A] font-medium">
                    <span>Discount</span><span>-{formatPrice(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-white/[0.06]">
                  <span className="font-bold text-[#EEF1FA] text-lg">Total</span>
                  <span className="text-2xl font-bold text-[#EEF1FA]">{formatPrice(cart.total)}</span>
                </div>
              </div>

              <Button type="submit" form="checkout-form" disabled={isProcessing} onClick={() => form.handleSubmit(onSubmit)()} className="w-full h-14 rounded-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg border-none shadow-[0_4px_20px_rgba(16,185,129,0.3)] lg:hidden">
                {isProcessing ? "Processing..." : `Place Order · ${formatPrice(cart.total)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
