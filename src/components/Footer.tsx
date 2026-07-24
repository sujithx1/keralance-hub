"use client";

import Link from "next/link";
import { MessageSquare, ArrowUp, Heart } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-gray-200/80 relative z-10">
      {/* Wave/Pattern background */}
      <div className="absolute inset-0 bg-mesh-gradient-reverse opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Logo Section */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <span className="font-heading font-extrabold text-lg tracking-wider">K</span>
              </div>
              <span className="font-heading font-extrabold text-lg text-text-main tracking-tight">
                Keralance Hub
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm">
              Connecting, empowering, and elevating freelancers, builders, and creators across Kerala. Built for modern creators who value craftsmanship and community.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted hover:text-primary hover:bg-soft-accent transition-all duration-300"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted hover:text-primary hover:bg-soft-accent transition-all duration-300"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted hover:text-primary hover:bg-soft-accent transition-all duration-300"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-text-muted hover:text-primary hover:bg-soft-accent transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-text-main mb-6">
              Community
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/directory" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Freelancers Directory
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Freelance Jobs
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Community Events
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Member Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-text-main mb-6">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/resources" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Guides & Templates
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="#" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Community Code
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Scroll Top */}
          <div className="flex flex-col justify-between items-start lg:items-end">
            <div>
              <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-text-main mb-6 lg:text-right">
                Platform
              </h4>
              <p className="text-sm text-text-muted lg:text-right">
                Platform version 1.0.0
                <br />
                Prisma & Supabase Ready
              </p>
            </div>
            <button
              onClick={scrollToTop}
              className="mt-8 lg:mt-0 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/20 text-text-muted hover:text-primary transition-all duration-300 flex items-center space-x-2 self-stretch lg:self-auto justify-center"
            >
              <span className="text-xs font-semibold">Back to Top</span>
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-200/60 my-12" />

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Keralance Hub. All rights reserved.
          </p>
          <p className="text-xs text-text-muted flex items-center">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500 mx-1 animate-pulse" /> in Kerala
          </p>
        </div>
      </div>
    </footer>
  );
}
