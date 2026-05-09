import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SignIn() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
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
      toast.success("Welcome back! You're signed in.");
      setLocation("/");
    }, 1400);
  };

  const inputCls = (field: string) =>
    `h-12 bg-[#181B2E] border ${errors[field] ? "border-red-500/60 focus-visible:ring-red-500/30" : "border-white/[0.08] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"} text-[#EEF1FA] placeholder:text-[#3E475E] rounded-xl transition-all`;

  return (
    <div className="bg-[#0C0E18] min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo mark */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-display font-black text-3xl shadow-[0_0_32px_rgba(16,185,129,0.3)] mx-auto mb-5">
            P
          </div>
          <h1 className="text-3xl font-display font-bold text-[#EEF1FA] mb-2">Welcome back</h1>
          <p className="text-[#5A6480] text-sm">Sign in to your PakMart account</p>
        </div>

        {/* Card */}
        <div className="bg-[#12162A] border border-white/[0.06] rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-[#8A93B4] font-medium text-sm">Email Address</Label>
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
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-[#8A93B4] font-medium text-sm">Password</Label>
                <Link href="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3E475E]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className={`${inputCls("password")} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3E475E] hover:text-[#8A93B4] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-white/20 bg-[#181B2E] accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-[#8A93B4] cursor-pointer select-none">
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base border-none shadow-[0_4px_20px_rgba(16,185,129,0.3)] group mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[#3A4060] text-xs font-medium">or continue with</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Google", icon: "G", color: "text-red-400" },
              { label: "Facebook", icon: "f", color: "text-blue-400" },
            ].map(({ label, icon, color }) => (
              <button
                key={label}
                onClick={() => toast.info(`${label} sign-in coming soon`)}
                className="h-11 bg-[#181B2E] border border-white/[0.08] rounded-xl flex items-center justify-center gap-2.5 text-[#8A93B4] hover:text-[#EEF1FA] hover:bg-white/5 hover:border-white/[0.14] transition-all text-sm font-semibold"
              >
                <span className={`font-black text-base ${color}`}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-[#5A6480] text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Create one free
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-[#3A4060] mt-5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-900" />
          Your data is protected with 256-bit SSL encryption
        </div>
      </div>
    </div>
  );
}
