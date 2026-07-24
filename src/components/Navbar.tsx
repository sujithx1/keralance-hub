"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Award } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Directory", href: "/directory" },
    { name: "Jobs", href: "/jobs" },
    { name: "Events", href: "/events" },
    { name: "Resources", href: "/resources" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? "glass-nav shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105 duration-300">
              <span className="font-heading font-extrabold text-lg tracking-wider">K</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg text-text-main tracking-tight group-hover:text-primary transition-colors duration-300">
                Keralance Hub
              </span>
              <span className="text-[10px] text-accent font-semibold tracking-widest uppercase -mt-1 flex items-center">
                <Award className="h-3 w-3 mr-0.5 inline" /> Kasavu Premium
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-heading text-sm font-medium tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-text-muted hover:text-text-main"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Call to Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/contact"
              className="text-sm font-heading font-medium text-text-muted hover:text-text-main transition-colors px-4 py-2"
            >
              Contact Us
            </Link>
            <a
              href="#join-cta"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  document.getElementById("join-cta")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all duration-300 flex items-center space-x-1 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5"
            >
              <span>Join Community</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-4 pt-4 pb-6 border-t border-gray-200/50 flex flex-col space-y-4 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-heading text-base font-medium px-2 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "text-primary bg-primary/5 font-semibold"
                      : "text-text-muted hover:text-text-main hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="h-px bg-gray-200/50 my-2" />
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="font-heading text-base font-medium text-text-muted px-2 py-1.5 hover:text-text-main"
            >
              Contact Us
            </Link>
            <a
              href="#join-cta"
              onClick={(e) => {
                setIsOpen(false);
                if (pathname === "/") {
                  e.preventDefault();
                  document.getElementById("join-cta")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-primary hover:bg-primary-hover text-white text-center px-4 py-3 rounded-xl font-heading font-semibold transition-colors flex items-center justify-center space-x-1 shadow-sm"
            >
              <span>Join Community</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
