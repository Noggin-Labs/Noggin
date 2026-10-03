import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, GraduationCap, Users, BookOpen, Shield } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";

const ROLES = [
  { id: "student",  label: "Student",  desc: "I'm here to learn",          icon: GraduationCap, color: "border-blue-300 bg-blue-50 text-blue-700" },
  { id: "parent",   label: "Parent",   desc: "I want to track my child",    icon: Users,         color: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  { id: "teacher",  label: "Teacher",  desc: "I manage classes",            icon: BookOpen,      color: "border-purple-300 bg-purple-50 text-purple-700" },
  { id: "admin",    label: "Admin",    desc: "Platform administration",     icon: Shield,        color: "border-amber-300 bg-amber-50 text-amber-700" },
];

export default function Register() {
  const [step, setStep] = useState("role"); // "role" | "details" | "otp"
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  const handleRoleSelect = (r) => {
    setRole(r);
    setStep("details");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      base44.analytics.track({ eventName: "user_registered", properties: { role } });
      setStep("otp");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      // Save the chosen role
      await base44.auth.updateMe({ role });
      // Redirect based on role
      const dest = role === "student" ? "/student" : role === "teacher" ? "/teacher" : role === "parent" ? "/parent" : "/";
      window.location.href = dest;
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  // ── Step: Role selection ──────────────────────────────────────────────────
  if (step === "role") {
    return (
      <AuthLayout
        icon={UserPlus}
        title="Create your account"
        subtitle="First, tell us who you are"
        footer={
          <>
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3 mb-5">
          {ROLES.map(({ id, label, desc, icon: Icon, color }) => (
            <button key={id} onClick={() => handleRoleSelect(id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all hover:scale-105 active:scale-95 ${color}`}>
              <Icon className="w-6 h-6" />
              <p className="font-extrabold text-sm">{label}</p>
              <p className="text-xs opacity-75 leading-tight">{desc}</p>
            </button>
          ))}
        </div>
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground">or</span></div>
        </div>
        <Button variant="outline" className="w-full h-12 text-sm font-medium" onClick={handleGoogle}>
          <GoogleIcon className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>
      </AuthLayout>
    );
  }

  // ── Step: OTP verification ────────────────────────────────────────────────
  if (step === "otp") {
    const selectedRole = ROLES.find(r => r.id === role);
    return (
      <AuthLayout
        icon={Mail}
        title="Verify your email"
        subtitle={`We sent a code to ${email}`}
      >
        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        {selectedRole && (
          <div className={`mb-4 flex items-center gap-2 p-3 rounded-xl border-2 ${selectedRole.color}`}>
            <selectedRole.icon className="w-4 h-4 shrink-0" />
            <span className="text-sm font-bold">Signing up as: {selectedRole.label}</span>
          </div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="w-full h-12 font-medium" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : "Verify & Continue"}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">Resend</button>
        </p>
        <button onClick={() => setStep("details")} className="mt-2 w-full text-center text-xs text-muted-foreground hover:underline">← Back</button>
      </AuthLayout>
    );
  }

  // ── Step: Email + Password details ───────────────────────────────────────
  const selectedRole = ROLES.find(r => r.id === role);
  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle={`Signing up as ${selectedRole?.label || "User"}`}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </>
      }
    >
      {selectedRole && (
        <div className={`mb-5 flex items-center gap-2 p-3 rounded-xl border-2 ${selectedRole.color}`}>
          <selectedRole.icon className="w-4 h-4 shrink-0" />
          <span className="text-sm font-bold">{selectedRole.label} — {selectedRole.desc}</span>
          <button onClick={() => setStep("role")} className="ml-auto text-xs underline opacity-60 hover:opacity-100">Change</button>
        </div>
      )}

      <Button variant="outline" className="w-full h-12 text-sm font-medium mb-5" onClick={handleGoogle}>
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground">or</span></div>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" autoComplete="email" autoFocus placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type="password" autoComplete="new-password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="confirm" type="password" autoComplete="new-password" placeholder="••••••••"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
