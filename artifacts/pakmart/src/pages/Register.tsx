import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PERKS = [
  "Exclusive member deals & early access",
  "Order tracking & history",
  "Faster checkout experience",
  "Free delivery on first order",
];

export function Register() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName || form.fullName.trim().length < 2) e.fullName = "Enter your full name";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone && !/^03\d{9}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Pakistani mobile (03XX XXXXXXX)";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.agreeTerms) e.agreeTerms = "You must agree to continue";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created! Welcome to PakMart.");
      setLocation("/");
    }, 1600);
  };

  const inputCls = (field: string) =>
    `h-12 bg-[#181B2E] border ${errors[field] ? "border-red-500/60 focus-visible:ring-red-500/30" : "border-white/[0.08] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"} text-[#EEF1FA] placeholder:text-[#3E475E] rounded-xl transition-all`;

  const passwordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-500" };
    if (score === 2) return { level: 2, label: "Fair", color: "bg-[#E8B84A]" };
    if (score === 3) return { level: 3, label: "Good", color: "bg-emerald-500" };
    return { level: 4, label: "Strong", color: "bg-emerald-400" };
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="bg-[#0C0E18] min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Left — Perks panel */}
        <div className="hidden lg:flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-display font-black text-2xl shadow-[0_0_24px_rgba(16,185,129,0.3)]">
                P
              </div>
              <div className="flex items-baseline gap-0 font-display text-2xl leading-none">
                <span className="font-semibold text-[#EEF1FA]">Pak</span>
                <span className="font-black text-emerald-400 tracking-widest uppercase text-xl">MART</span>
              </div>
            </div>
            <h2 className="text-4xl font-display font-bold text-[#EEF1FA] leading-tight mb-4">
              Join Pakistan's<br />
              <span className="text-emerald-400">premier marketplace</span>
            </h2>
            <p className="text-[#5A6480] leading-relaxed text-base">
              Millions of Pakistanis trust PakMart for authentic products, fast delivery, and unbeatable prices.
            </p>
          </div>

          <div className="space-y-4">
            {PERKS.map((perk, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/50 border border-emerald-800/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[#8A93B4] text-sm font-medium">{perk}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[#12162A] border border-white/[0.06] rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {["A","F","R","K"].map((initial, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-emerald-900/60 border-2 border-[#0C0E18] flex items-center justify-center text-xs font-bold text-emerald-300">
                    {initial}
                  </div>
                ))}
              </div>
              <div className="flex text-[#E8B84A]">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                ))}
              </div>
            </div>
            <p className="text-[#5A6480] text-sm leading-relaxed">
              "PakMart has completely changed how I shop. Authentic products, fast delivery — I'm a customer for life."
            </p>
            <p className="text-[#8A93B4] text-xs font-semibold mt-2">— Fatima R., Lahore</p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="w-full">
          <div className="text-center lg:text-left mb-8 lg:hidden">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-display font-black text-2xl shadow-[0_0_24px_rgba(16,185,129,0.3)] mx-auto mb-4">
              P
            </div>
            <h1 className="text-2xl font-display font-bold text-[#EEF1FA]">Create your account</h1>
            <p className="text-[#5A6480] text-sm mt-1">Join millions of happy PakMart shoppers</p>
          </div>
          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-display font-bold text-[#EEF1FA]">Create your account</h1>
            <p className="text-[#5A6480] text-sm mt-1">It's free and only takes a minute</p>
          </div>

          <div className="bg-[#12162A] border border-white/[0.06] rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label className="text-[#8A93B4] font-medium text-sm">Full Name <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3E475E]" />
                  <Input
                    placeholder="Ali Khan"
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    className={`${inputCls("fullName")} pl-10`}
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-[#8A93B4] font-medium text-sm">Email Address <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3E475E]" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={`${inputCls("email")} pl-10`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              {/* Phone (optional) */}
              <div className="space-y-1.5">
                <Label className="text-[#8A93B4] font-medium text-sm">Mobile Number <span className="text-[#3A4060] font-normal">(optional)</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3E475E]" />
                  <Input
                    placeholder="0300 1234567"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={`${inputCls("phone")} pl-10`}
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-[#8A93B4] font-medium text-sm">Password <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3E475E]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className={`${inputCls("password")} pl-10 pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3E475E] hover:text-[#8A93B4] transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex gap-1 flex-1">
                      {[1,2,3,4].map(l => (
                        <div key={l} className={`h-1 flex-1 rounded-full transition-all ${l <= strength.level ? strength.color : "bg-white/[0.06]"}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-semibold ${strength.level <= 1 ? "text-red-400" : strength.level === 2 ? "text-[#E8B84A]" : "text-emerald-400"}`}>
                      {strength.label}
                    </span>
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label className="text-[#8A93B4] font-medium text-sm">Confirm Password <span className="text-red-400">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3E475E]" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    className={`${inputCls("confirmPassword")} pl-10 pr-10`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3E475E] hover:text-[#8A93B4] transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div className="space-y-1">
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={e => setForm(f => ({ ...f, agreeTerms: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-[#181B2E] accent-emerald-500 cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-[#8A93B4] cursor-pointer select-none leading-snug">
                    I agree to PakMart's{" "}
                    <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Privacy Policy</a>
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-red-400 text-xs pl-6">{errors.agreeTerms}</p>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base border-none shadow-[0_4px_20px_rgba(16,185,129,0.3)] group mt-1"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Free Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-[#5A6480] text-sm mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-[#3A4060] mt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-900" />
            Your data is protected with 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  );
}
