import React from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useGetCart, 
  useCreateOrder,
  getGetCartQueryKey
} from "@workspace/api-client-react";
import { ShieldCheck, Truck, CreditCard, Banknote, MapPin, Building, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice, getImageUrl } from "@/lib/format";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", 
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad"
];

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(11, "Valid phone number is required").max(15),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  address: z.string().min(10, "Complete address is required"),
  city: z.string().min(1, "City is required"),
  paymentMethod: z.enum(["cod", "easypaisa", "jazzcash", "card"]),
  notes: z.string().optional()
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function Checkout() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useGetCart();
  const createOrder = useCreateOrder();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      paymentMethod: "cod",
      notes: ""
    }
  });

  React.useEffect(() => {
    if (cart && cart.items.length === 0) {
      setLocation("/cart");
    }
  }, [cart, setLocation]);

  if (isLoading || !cart) {
    return <div className="min-h-[50vh] flex items-center justify-center text-emerald-600 font-display text-xl animate-pulse">Loading secure checkout...</div>;
  }

  if (cart.items.length === 0) {
    return null;
  }

  const onSubmit = (data: CheckoutFormValues) => {
    createOrder.mutate({ data: {
      ...data,
      email: data.email || null,
      notes: data.notes || null,
    } }, {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <div className="flex items-center justify-center gap-2 mb-10">
        <Lock className="w-5 h-5 text-emerald-600" />
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#1A1A1A]">Secure Checkout</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Checkout Form */}
        <div className="lg:w-3/5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              
              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/5">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold font-display text-[#1A1A1A]">Shipping Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#1A1A1A] font-medium">Full Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Ali Khan" className="h-12 bg-[#FAF7F1] border-black/10 focus-visible:ring-emerald-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#1A1A1A] font-medium">Phone Number <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="0300 1234567" className="h-12 bg-[#FAF7F1] border-black/10 focus-visible:ring-emerald-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[#1A1A1A] font-medium">Email Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ali@example.com" type="email" className="h-12 bg-[#FAF7F1] border-black/10 focus-visible:ring-emerald-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[#1A1A1A] font-medium">Complete Address <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="House/Apartment No, Street, Area" className="min-h-[100px] bg-[#FAF7F1] border-black/10 focus-visible:ring-emerald-600 resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[#1A1A1A] font-medium">City <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-[#FAF7F1] border-black/10 focus:ring-emerald-600">
                              <SelectValue placeholder="Select your city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CITIES.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[#1A1A1A] font-medium">Delivery Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Leave at front door, call before arriving" className="h-12 bg-[#FAF7F1] border-black/10 focus-visible:ring-emerald-600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/5">
                  <div className="w-10 h-10 rounded-full bg-saffron-50 flex items-center justify-center text-saffron-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold font-display text-[#1A1A1A]">Payment Method</h2>
                </div>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col gap-4"
                        >
                          <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${field.value === 'cod' ? 'border-emerald-600 bg-emerald-50' : 'border-black/5 bg-[#FAF7F1] hover:border-black/20'}`}>
                            <div className="flex items-center gap-4">
                              <RadioGroupItem value="cod" id="cod" className="text-emerald-600 border-gray-300" />
                              <div className="flex items-center gap-2">
                                <Banknote className="w-5 h-5 text-[#6B6B6B]" />
                                <span className="font-bold text-[#1A1A1A]">Cash on Delivery (COD)</span>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded">Pay when you receive</span>
                          </label>

                          <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${field.value === 'card' ? 'border-emerald-600 bg-emerald-50' : 'border-black/5 bg-[#FAF7F1] hover:border-black/20'}`}>
                            <div className="flex items-center gap-4">
                              <RadioGroupItem value="card" id="card" className="text-emerald-600 border-gray-300" />
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#6B6B6B]" />
                                <span className="font-bold text-[#1A1A1A]">Credit / Debit Card</span>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-60">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3" />
                            </div>
                          </label>

                          <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${field.value === 'easypaisa' ? 'border-emerald-600 bg-emerald-50' : 'border-black/5 bg-[#FAF7F1] hover:border-black/20'}`}>
                            <div className="flex items-center gap-4">
                              <RadioGroupItem value="easypaisa" id="easypaisa" className="text-emerald-600 border-gray-300" />
                              <div className="flex items-center gap-2">
                                <Building className="w-5 h-5 text-[#6B6B6B]" />
                                <span className="font-bold text-[#1A1A1A]">Easypaisa</span>
                              </div>
                            </div>
                          </label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="hidden lg:block">
                <Button 
                  type="submit" 
                  disabled={createOrder.isPending}
                  className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/20"
                >
                  {createOrder.isPending ? "Processing..." : `Place Order • ${formatPrice(cart.total)}`}
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4">By placing this order, you agree to our Terms of Service and Privacy Policy.</p>
              </div>

            </form>
          </Form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-2/5">
          <div className="bg-[#F8F9FA] rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5 sticky top-24">
            <h3 className="font-display font-bold text-xl text-[#1A1A1A] mb-6 pb-6 border-b border-black/5">Order Items</h3>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-black/5 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-lg border border-black/5 flex items-center justify-center p-2">
                      <img src={getImageUrl(item.productImage)} alt={item.productName} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-[#F8F9FA]">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="font-medium text-[#1A1A1A] text-sm line-clamp-1">{item.productName}</span>
                    <span className="text-sm font-bold text-emerald-600">{formatPrice(item.lineTotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[#6B6B6B] text-sm">
                <span>Subtotal</span>
                <span className="text-[#1A1A1A] font-medium">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B] text-sm">
                <span>Delivery Fee</span>
                <span className="text-[#1A1A1A] font-medium">{cart.deliveryFee === 0 ? 'FREE' : formatPrice(cart.deliveryFee)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-saffron-600 text-sm font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-end mb-8 pt-6 border-t border-black/5">
              <span className="text-lg font-bold text-[#1A1A1A]">Total</span>
              <span className="text-2xl font-bold text-[#1A1A1A] block leading-none">{formatPrice(cart.total)}</span>
            </div>

            <div className="lg:hidden">
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={createOrder.isPending}
                className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/20"
              >
                {createOrder.isPending ? "Processing..." : `Place Order • ${formatPrice(cart.total)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
