import { useState } from "react";
import { X, Lock, Mail, User, Shield, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; role: "admin" | "user" | "freelancer" }) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user" | "freelancer">("freelancer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate Auth API communication
    setTimeout(() => {
      setLoading(false);
      if (tab === "login") {
        if (!email || !password) {
          setError("All fields are required");
          return;
        }
        
        // Auto-assign role based on email helper for testing if not custom admin
        let userRole: "admin" | "user" | "freelancer" = "freelancer";
        let userName = email.split("@")[0];
        userName = userName.charAt(0).toUpperCase() + userName.slice(1);

        if (email.includes("admin")) {
          userRole = "admin";
        } else if (email.includes("client") || email.includes("user")) {
          userRole = "user";
        }

        onSuccess({
          name: userName,
          email,
          role: userRole,
        });
      } else {
        if (!name || !email || !password) {
          setError("All fields are required");
          return;
        }

        onSuccess({
          name,
          email,
          role,
        });
      }
      onClose();
    }, 800);
  };

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
          <div className="flex border-b border-primary/10 mb-6">
            <button
              onClick={() => { setTab("login"); setError(""); }}
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
              onClick={() => { setTab("register"); setError(""); }}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

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
              <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-text-muted block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-bg-base/40 focus:bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {tab === "login" && (
                <span className="text-[9px] text-text-muted mt-1 block italic">
                  💡 Hint: Use "client" or "admin" in email to simulate those roles
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-text-muted block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/10 bg-bg-base/40 focus:bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-heading font-bold text-sm transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/20 mt-6 cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{tab === "login" ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
