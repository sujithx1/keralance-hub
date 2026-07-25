import { useState } from "react";
import { X, User, Shield, Sparkles, Phone, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; role: "admin" | "user" | "freelancer" }) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [debugCode, setDebugCode] = useState("");
  const [role, setRole] = useState<"admin" | "user" | "freelancer">("freelancer");
  const [error, setError] = useState("");

  // TanStack Query Send OTP Mutation
  const sendOtpMutation = useMutation({
    mutationFn: async (phoneNum: string) => {
      const payload: any = { phone: phoneNum };
      const response = await axiosInstance.post("/auth/otp/send", payload);
      return response.data;
    },
    onSuccess: (data) => {
      setDebugCode(data.debugCode || "");
      setOtpSent(true);
      setError("");
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Failed to send verification code. Try again.");
    },
  });

  // TanStack Query Verify OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async (verificationData: { phone: string; code: string; name?: string; role?: string }) => {
      const response = await axiosInstance.post("/auth/otp/verify", verificationData);
      return response.data;
    },
    onSuccess: (data) => {
      const { user, accessToken, refreshToken } = data.data;
      
      // Store JWTs locally
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Trigger context updates
      onSuccess({
        name: user.name,
        email: user.email || `${user.phone}@keralance.dev`,
        role: user.role,
      });
      setError("");
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Invalid verification code.");
    },
  });

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!phone) {
      setError("Phone number is required");
      return;
    }

    if (tab === "register" && !name) {
      setError("Name is required");
      return;
    }

    sendOtpMutation.mutate(phone);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the verification code");
      return;
    }

    verifyOtpMutation.mutate({
      phone,
      code: otp,
      name: tab === "register" ? name : undefined,
      role: tab === "register" ? role : undefined,
    });
  };

  const handleReset = () => {
    setOtpSent(false);
    setOtp("");
    setDebugCode("");
    setError("");
  };

  const loading = sendOtpMutation.isPending || verifyOtpMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* Modal Container */}
      <div className="relative bg-white border border-primary/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10 animate-fadeIn">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-secondary" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-text-muted hover:text-primary hover:bg-bg-base transition-colors cursor-pointer"
          aria-label="Close auth form"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        <div className="p-8 pt-10">
          <div className="text-center mb-6">
            <h2 className="font-heading font-extrabold text-2xl text-primary flex items-center justify-center space-x-1.5">
              <Sparkles className="h-5.5 w-5.5 text-accent animate-pulse" />
              <span>keralance HUB</span>
            </h2>
            <p className="text-text-muted text-xs mt-1">
              Join Kerala's premier network of freelancers and creators.
            </p>
          </div>

          {/* Tabs */}
          {!otpSent && (
            <div className="flex border-b border-primary/10 mb-6">
              <button
                onClick={() => { setTab("login"); handleReset(); }}
                className={`flex-1 pb-3 text-sm font-heading font-bold transition-all relative cursor-pointer ${
                  tab === "login" ? "text-primary" : "text-text-muted hover:text-primary"
                }`}
              >
                Sign In
                {tab === "login" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.7 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => { setTab("register"); handleReset(); }}
                className={`flex-1 pb-3 text-sm font-heading font-bold transition-all relative cursor-pointer ${
                  tab === "register" ? "text-primary" : "text-text-muted hover:text-primary"
                }`}
              >
                Register
                {tab === "register" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.7 bg-primary rounded-full" />
                )}
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {otpSent && (
              <div className="p-3.5 bg-accent/10 border border-accent/20 rounded-xl text-primary text-xs font-semibold text-center animate-pulse">
                🔑 Verification Code (OTP): <span className="text-accent text-sm font-bold">{debugCode}</span>
              </div>
            )}

            {!otpSent ? (
              <>
                {tab === "register" && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-text-muted block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-bg-base/40 focus:bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-text-muted block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 7994591023"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-bg-base/40 focus:bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  {tab === "login" && (
                    <span className="text-[9px] text-text-muted mt-1 block italic">
                      💡 Hint: Use admin phone "7994591023" or client phone "7994591024" to test roles
                    </span>
                  )}
                </div>

                {tab === "register" && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-text-muted block">I want to join as</label>
                    <div className="relative">
                      <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-bg-base/40 focus:bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                      >
                        <option value="freelancer">Freelancer (Sell services)</option>
                        <option value="user">Client (Hire freelancers)</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-text-muted block">Verification Code (OTP)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-bg-base/40 focus:bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-center tracking-widest font-bold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[10px] text-primary hover:underline mt-1.5 block cursor-pointer"
                >
                  ← Change phone number
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-heading font-bold text-sm transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/20 mt-6 cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{otpSent ? "Verify & Continue" : "Send Verification Code"}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
