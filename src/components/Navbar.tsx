import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", key: "home" },
    { name: "Directory", key: "directory" },
    { name: "Jobs", key: "jobs" },
    { name: "Events", key: "events" },
    { name: "Resources", key: "resources" },
    { name: "Dashboard", key: "dashboard" },
    { name: "About", key: "about" },
  ];

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

          {/* Call to Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => handleLinkClick("contact")}
              className={`text-sm font-heading font-semibold px-4 py-2 cursor-pointer transition-colors ${
                activePage === "contact" ? "text-primary" : "text-text-muted hover:text-primary"
              }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => {
                handleLinkClick("home");
                setTimeout(() => {
                  document.getElementById("join-cta")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all duration-300 flex items-center space-x-1 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Join Community</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
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
            <button
              onClick={() => {
                handleLinkClick("home");
                setTimeout(() => {
                  document.getElementById("join-cta")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="bg-primary hover:bg-primary-hover text-white text-center px-4 py-3 rounded-xl font-heading font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <span>Join Community</span>
              <ArrowUpRight className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
