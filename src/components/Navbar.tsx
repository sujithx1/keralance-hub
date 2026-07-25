import { useState } from "react";
import { Menu, X, ArrowUpRight, LogOut, User as UserIcon } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  currentUser: { name: string; email: string; role: "admin" | "user" | "freelancer" } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navbar({
  activePage,
  setActivePage,
  currentUser,
  onOpenAuth,
  onLogout
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", key: "home" },
    { name: "Directory", key: "directory" },
    { name: "Jobs", key: "jobs" },
    { name: "Events", key: "events" },
    { name: "Resources", key: "resources" },
    { name: "About", key: "about" },
  ];

  // Only show Dashboard link when authenticated
  if (currentUser) {
    navLinks.splice(5, 0, { name: "Dashboard", key: "dashboard" });
  }

  const handleLinkClick = (key: string) => {
    setActivePage(key);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div
            onClick={() => handleLinkClick("home")}
            className="cursor-pointer group flex items-center"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activePage === link.key;
              return (
                <button
                  key={link.key}
                  onClick={() => handleLinkClick(link.key)}
                  className={`font-heading text-sm font-medium tracking-wide transition-colors relative py-1 cursor-pointer ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-text-muted hover:text-primary"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.7 bg-primary rounded-full animate-fadeIn" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Call to Actions / User State */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => handleLinkClick("contact")}
              className={`text-sm font-heading font-semibold px-4 py-2 cursor-pointer transition-colors ${
                activePage === "contact" ? "text-primary" : "text-text-muted hover:text-primary"
              }`}
            >
              Contact Us
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3.5 pl-4 border-l border-primary/10">
                <div className="flex items-center space-x-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-xl">
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold font-heading">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-primary block leading-none">{currentUser.name}</span>
                    <span className="text-[9px] text-accent font-extrabold uppercase tracking-wider block mt-0.5 leading-none">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer flex items-center space-x-1"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all duration-300 flex items-center space-x-1 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-text-muted hover:text-primary hover:bg-white/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-4 pt-4 pb-6 border-t border-primary/10 flex flex-col space-y-3.5 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive = activePage === link.key;
              return (
                <button
                  key={link.key}
                  onClick={() => handleLinkClick(link.key)}
                  className={`font-heading text-left text-base font-semibold px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "text-primary bg-primary/5 font-bold"
                      : "text-text-muted hover:text-primary hover:bg-white/40"
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
            <div className="h-px bg-primary/10 my-2" />
            
            <button
              onClick={() => handleLinkClick("contact")}
              className="font-heading text-left text-base font-semibold text-text-muted px-3 py-2.5 hover:text-primary hover:bg-white/40 rounded-xl"
            >
              Contact Us
            </button>

            {currentUser ? (
              <div className="p-3 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-primary leading-none">{currentUser.name}</h4>
                    <span className="text-[10px] text-accent font-extrabold uppercase mt-0.5 block">{currentUser.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-colors"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsOpen(false);
                }}
                className="bg-primary hover:bg-primary-hover text-white text-center px-4 py-3 rounded-xl font-heading font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span>Sign In</span>
                <ArrowUpRight className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
