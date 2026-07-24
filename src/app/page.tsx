"use client";
// Keralance Hub Landing Page - Main view with modern Kerala illustration and highlight sections

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Layers,
  Zap,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Code,
  Palette,
  Edit3,
  Video,
  MousePointer,
  Camera,
  Star,
  Clock,
  Calendar,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  MapPin,
  Bookmark
} from "lucide-react";

// Mock Data for Landing Page
const STATS = [
  { label: "Active Members", value: "2,400+", icon: Users, gradient: "from-teal-500/20 to-emerald-500/20" },
  { label: "Projects Completed", value: "1,850+", icon: Layers, gradient: "from-emerald-500/20 to-yellow-500/20" },
  { label: "Jobs Posted", value: "720+", icon: Briefcase, gradient: "from-yellow-500/20 to-teal-500/20" },
  { label: "Collaborations", value: "340+", icon: Zap, gradient: "from-teal-500/20 to-indigo-500/20" },
];

const WHY_US = [
  {
    title: "Trusted Community",
    description: "Every member is verified. Build lasting local partnerships with trustworthy creators, designers, and engineers based right here in Kerala.",
    icon: ShieldCheck,
  },
  {
    title: "Quality Opportunities",
    description: "Access curated projects from local startups to global firms. Say goodbye to spam bids and race-to-the-bottom pricing models.",
    icon: TrendingUp,
  },
  {
    title: "Learn & Grow Together",
    description: "Participate in weekly community reviews, code sessions, design reviews, and local developer meetups to hone your freelance craft.",
    icon: Sparkles,
  },
];

const CATEGORIES = [
  { name: "Developers", icon: Code, count: "840+", gradient: "from-teal-500 to-emerald-500" },
  { name: "Designers", icon: Palette, count: "520+", gradient: "from-emerald-500 to-yellow-500" },
  { name: "Writers", icon: Edit3, count: "310+", gradient: "from-yellow-500 to-amber-600" },
  { name: "Video Editors", icon: Video, count: "290+", gradient: "from-teal-600 to-cyan-500" },
  { name: "AI Engineers", icon: Cpu, count: "180+", gradient: "from-teal-500 to-indigo-500" },
  { name: "Marketing", icon: TrendingUp, count: "220+", gradient: "from-emerald-600 to-teal-400" },
  { name: "No-Code Makers", icon: MousePointer, count: "140+", gradient: "from-amber-500 to-emerald-600" },
  { name: "Photographers", icon: Camera, count: "90+", gradient: "from-teal-700 to-yellow-600" },
];

const FEATURED_FREELANCERS = [
  {
    id: "f1",
    name: "Arjun K. Varma",
    role: "Senior Full Stack Dev",
    avatar: "AV",
    rating: 4.9,
    reviews: 42,
    skills: ["Next.js", "React Native", "PostgreSQL", "Go"],
    available: true,
    location: "Kochi",
    bgColor: "bg-teal-50",
  },
  {
    id: "f2",
    name: "Meera Nair",
    role: "Product Designer",
    avatar: "MN",
    rating: 5.0,
    reviews: 38,
    skills: ["Figma", "Design Systems", "UI/UX", "Webflow"],
    available: true,
    location: "Trivandrum",
    bgColor: "bg-emerald-50",
  },
  {
    id: "f3",
    name: "Rahul Siddharth",
    role: "AI & Data Engineer",
    avatar: "RS",
    rating: 4.8,
    reviews: 24,
    skills: ["Python", "PyTorch", "LLMs", "FastAPI"],
    available: false,
    location: "Calicut",
    bgColor: "bg-amber-50",
  },
];

const LATEST_JOBS = [
  {
    title: "Next.js & Supabase Platform Developer",
    client: "NeoKerala Labs",
    budget: "₹65,000 - ₹90,000",
    type: "Contract",
    location: "Remote (Kerala)",
    skills: ["Next.js", "Supabase", "TypeScript"],
    time: "2 hours ago",
  },
  {
    title: "Brand Identity & Web UI Design",
    client: "Malabar Coffee Co.",
    budget: "₹40,000 - ₹50,000",
    type: "Fixed Price",
    location: "Hybrid (Calicut)",
    skills: ["Brand Guidelines", "Figma", "Webflow"],
    time: "5 hours ago",
  },
  {
    title: "Short-Form Video Editor / Creator",
    client: "VibeKerala Media",
    budget: "₹25,000 - ₹35,000 / mo",
    type: "Monthly Retainer",
    location: "Remote",
    skills: ["Premiere Pro", "CapCut", "Motion Graphics"],
    time: "1 day ago",
  },
];

const EVENTS = [
  {
    type: "Workshop",
    title: "Freelancing 101: Landing International Clients",
    date: "Aug 02, 2026",
    time: "3:00 PM - 5:00 PM",
    speaker: "Jose Kurian (Top Rated Freelancer)",
    tag: "Online",
    color: "border-teal-500 text-teal-600 bg-teal-50/50",
  },
  {
    type: "Meetup",
    title: "Kochi Creators & Builders Mixer",
    date: "Aug 15, 2026",
    time: "4:00 PM onwards",
    speaker: "Kochi Startup Zone, Kakkanad",
    tag: "In-Person",
    color: "border-emerald-500 text-emerald-600 bg-emerald-50/50",
  },
  {
    type: "Hackathon",
    title: "Malabar Web3 & AI Builders Sprint",
    date: "Sep 05, 2026",
    time: "36-Hour Virtual Hackathon",
    speaker: "Prizes up to ₹1,00,000",
    tag: "Hybrid",
    color: "border-accent text-amber-700 bg-amber-50/50",
  },
];

const TESTIMONIALS = [
  {
    quote: "Keralance Hub changed how I freelance. I found three high-paying clients based in Bangalore and Singapore directly through local recommendations here.",
    author: "Fathima Riza",
    role: "Freelance Copywriter",
    location: "Calicut",
  },
  {
    quote: "Finding quality developers in Kerala was a challenge until we tapped into this hub. The talent quality, communication, and professionalism are outstanding.",
    author: "Gautham Krishna",
    role: "Founder, SproutTech",
    location: "Kochi",
  },
];

export default function HomePage() {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const toggleSaveJob = (index: number) => {
    if (savedJobs.includes(index.toString())) {
      setSavedJobs(savedJobs.filter((i) => i !== index.toString()));
    } else {
      setSavedJobs([...savedJobs, index.toString()]);
    }
  };

  return (
    <div className="bg-mesh-gradient min-h-screen relative overflow-hidden">
      {/* Decorative Blob Shapes */}
      <div className="absolute top-[20%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse duration-10000" />
      <div className="absolute top-[40%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-secondary/5 blur-[100px] pointer-events-none animate-pulse duration-7000" />

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-6 flex flex-col space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-white/70 border border-gray-200/65 px-4 py-1.5 rounded-full w-fit shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-heading font-semibold text-primary">Kerala's Largest Elite Talent Pool</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-text-main">
                  കേരളത്തിലെ <br />
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Freelancers
                  </span>{" "}
                  ഒന്നിക്കുന്ന Community.
                </h1>
                <p className="font-sans text-lg sm:text-xl text-text-muted max-w-lg leading-relaxed">
                  Connect. Collaborate. Grow together. Discover elite local developers, designers, video editors, and marketers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="#join-cta"
                  className="bg-primary hover:bg-primary-hover text-white text-center px-8 py-4 rounded-xl font-heading font-semibold transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Join Community
                </a>
                <Link
                  href="/directory"
                  className="bg-white/80 hover:bg-white text-text-main border border-gray-200 text-center px-8 py-4 rounded-xl font-heading font-semibold transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-sm"
                >
                  <span>Explore Freelancers</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Badges list */}
              <div className="pt-6 border-t border-gray-200/50 grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-heading font-bold text-text-main text-lg">100%</h4>
                  <p className="text-xs text-text-muted">Kerala Verified</p>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-text-main text-lg">Zero</h4>
                  <p className="text-xs text-text-muted">Platform Bidding Fees</p>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-text-main text-lg">₹25M+</h4>
                  <p className="text-xs text-text-muted">Collaborative Value</p>
                </div>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                {/* Background decorative glowing rings */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/5 rounded-3xl blur-2xl transform rotate-3" />
                
                {/* Main Illustration Box */}
                <div className="relative glass-card rounded-2xl p-6 shadow-xl border border-gray-200/60 overflow-hidden bg-white/40">
                  <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-md">
                    {/* Sky/Backwater gradient bg */}
                    <defs>
                      <linearGradient id="backwaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E0F2F1" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#E8F5E9" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#FFFDE7" stopOpacity="0.4" />
                      </linearGradient>
                      <linearGradient id="palmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#166534" />
                        <stop offset="100%" stopColor="#0F766E" />
                      </linearGradient>
                    </defs>

                    <rect width="500" height="400" rx="16" fill="url(#backwaterGrad)" />

                    {/* Smooth backwater waves */}
                    <path d="M 0 320 Q 125 300 250 320 T 500 320 L 500 400 L 0 400 Z" fill="#0F766E" fillOpacity="0.08" />
                    <path d="M 0 350 Q 125 330 250 350 T 500 350 L 500 400 L 0 400 Z" fill="#166534" fillOpacity="0.1" />

                    {/* Left Minimal Coconut Palm Leaves */}
                    <path d="M -10 100 Q 80 50 160 120" stroke="url(#palmGrad)" strokeWidth="4" fill="none" />
                    {/* Palm leaf strands */}
                    <path d="M 40 78 L 35 110 M 60 70 L 52 112 M 80 68 L 72 118 M 100 74 L 92 125 M 120 86 L 112 135 M 140 102 L 132 145" stroke="url(#palmGrad)" strokeWidth="3" strokeLinecap="round" />

                    {/* Laptop Screen / IDE Mockup in center */}
                    <rect x="120" y="140" width="260" height="170" rx="10" fill="#1E1E24" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.15))" />
                    {/* IDE Header */}
                    <circle cx="140" cy="155" r="4" fill="#EF4444" />
                    <circle cx="152" cy="155" r="4" fill="#F59E0B" />
                    <circle cx="164" cy="155" r="4" fill="#10B981" />
                    <rect x="190" y="151" width="120" height="8" rx="4" fill="#374151" />

                    {/* Code Lines inside laptop */}
                    <rect x="140" y="180" width="100" height="6" rx="3" fill="#0F766E" />
                    <rect x="140" y="195" width="180" height="6" rx="3" fill="#D4AF37" />
                    <rect x="140" y="210" width="140" height="6" rx="3" fill="#166534" />
                    <rect x="140" y="225" width="210" height="6" rx="3" fill="#4B5563" />
                    <rect x="140" y="240" width="80" height="6" rx="3" fill="#0F766E" />
                    <rect x="140" y="255" width="160" height="6" rx="3" fill="#D4AF37" />
                    
                    {/* Laptop Base */}
                    <path d="M 90 310 L 410 310 L 430 325 L 70 325 Z" fill="#E5E7EB" />
                    <rect x="220" y="310" width="60" height="4" rx="2" fill="#9CA3AF" />

                    {/* Floating Avatar Badges */}
                    {/* Dev avatar */}
                    <g transform="translate(60, 120)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))">
                      <circle cx="25" cy="25" r="25" fill="#0F766E" />
                      <text x="25" y="29" fill="#ffffff" fontSize="11" fontFamily="system-ui" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
                    </g>
                    {/* Design avatar */}
                    <g transform="translate(390, 100)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))">
                      <circle cx="25" cy="25" r="25" fill="#D4AF37" />
                      <text x="25" y="29" fill="#ffffff" fontSize="14" fontFamily="system-ui" fontWeight="bold" textAnchor="middle">✎</text>
                    </g>
                    {/* Video avatar */}
                    <g transform="translate(360, 240)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.08))">
                      <circle cx="25" cy="25" r="25" fill="#166534" />
                      <text x="25" y="29" fill="#ffffff" fontSize="12" fontFamily="system-ui" fontWeight="bold" textAnchor="middle">▶</text>
                    </g>
                  </svg>
                  
                  {/* Subtle caption overlaid inside illustration border */}
                  <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center bg-white/90 px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-[11px] font-heading font-bold text-text-muted">KERALA CREATORS</span>
                    <span className="text-[11px] font-heading font-extrabold text-primary flex items-center">
                      <Sparkles className="h-3 w-3 mr-1 text-accent fill-accent" /> BUILDING GLOBALLY
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. Community Stats Section */}
      <section className="py-16 bg-white/60 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {STATS.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-2xl flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${stat.gradient} flex items-center justify-center text-primary mb-4`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-sans text-text-muted mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Why Keralance Hub */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-main tracking-tight">
              A community made for Kerala’s freelance renaissance.
            </h2>
            <p className="text-text-muted text-base mt-4 font-sans">
              We focus on premium projects, skilled collaboration, and keeping the profits with the creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200/80 p-8 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-soft-accent flex items-center justify-center text-primary">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text-main">{feature.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed font-sans">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Freelancer Categories */}
      <section className="py-20 bg-white/40 border-t border-gray-200/40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="font-heading font-extrabold text-3xl text-text-main tracking-tight">
                Explore Talent Categories
              </h2>
              <p className="text-text-muted text-sm mt-2 font-sans">
                Find elite freelancers specialized in diverse domains.
              </p>
            </div>
            <Link
              href="/directory"
              className="mt-4 sm:mt-0 text-primary hover:text-primary-hover text-sm font-heading font-bold flex items-center group"
            >
              <span>View Directory</span>
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={`/directory?category=${cat.name}`}
                  className="group relative bg-white border border-gray-200/80 p-6 rounded-2xl shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between h-40"
                >
                  {/* Hover background gradient flash */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-text-main group-hover:text-primary group-hover:bg-soft-accent transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading font-bold text-base text-text-main group-hover:text-primary transition-colors duration-300">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">{cat.count} members</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Featured Freelancers */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-3xl text-text-main tracking-tight">
              Featured Freelancers of the Week
            </h2>
            <p className="text-text-muted text-sm mt-3 font-sans">
              Handpicked professionals who have set benchmarks in quality work and timely delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_FREELANCERS.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`h-12 w-12 rounded-xl ${freelancer.bgColor} flex items-center justify-center text-primary font-heading font-extrabold text-base border border-primary/10`}>
                        {freelancer.avatar}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-text-main text-base hover:text-primary transition-colors">
                          <Link href={`/profile/${freelancer.id}`}>{freelancer.name}</Link>
                        </h3>
                        <p className="text-xs text-text-muted">{freelancer.role}</p>
                      </div>
                    </div>
                    {freelancer.available ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-heading font-semibold px-2 py-1 rounded-full border border-emerald-100 flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Available
                      </span>
                    ) : (
                      <span className="bg-gray-50 text-gray-500 text-[10px] font-heading font-semibold px-2 py-1 rounded-full border border-gray-200">
                        Busy
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-text-muted mt-4 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> {freelancer.location}, Kerala
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {freelancer.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-gray-50 border border-gray-100 text-text-muted text-[11px] px-2.5 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span className="text-xs font-bold text-text-main">{freelancer.rating}</span>
                    <span className="text-xs text-text-muted">({freelancer.reviews} reviews)</span>
                  </div>
                  
                  <Link
                    href={`/profile/${freelancer.id}`}
                    className="text-xs font-heading font-bold text-primary hover:text-primary-hover flex items-center"
                  >
                    <span>Portfolio</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Latest Freelance Jobs */}
      <section className="py-20 bg-white/60 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="font-heading font-extrabold text-3xl text-text-main tracking-tight">
                Latest Freelance Jobs
              </h2>
              <p className="text-text-muted text-sm mt-2 font-sans">
                Apply directly to trusted listings from Kerala and beyond.
              </p>
            </div>
            <Link
              href="/jobs"
              className="mt-4 sm:mt-0 text-primary hover:text-primary-hover text-sm font-heading font-bold flex items-center group"
            >
              <span>View Job Board</span>
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {LATEST_JOBS.map((job, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-primary bg-soft-accent px-2.5 py-1 rounded-md">
                      {job.type}
                    </span>
                    <button
                      onClick={() => toggleSaveJob(idx)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        savedJobs.includes(idx.toString())
                          ? "bg-amber-50 border-amber-200 text-accent"
                          : "bg-gray-50 border-gray-100 text-text-muted hover:text-text-main"
                      }`}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h3 className="font-heading font-bold text-text-main text-base mt-4 hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">{job.client}</p>

                  <p className="font-heading font-extrabold text-base text-secondary mt-4">
                    {job.budget}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-gray-50 text-[10px] text-text-muted px-2 py-0.5 rounded border border-gray-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-text-muted flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {job.time}
                  </span>
                  
                  <Link
                    href="/jobs"
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all duration-300"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Community Events */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="font-heading font-extrabold text-3xl text-text-main tracking-tight">
                Upcoming Community Events
              </h2>
              <p className="text-text-muted text-sm mt-2 font-sans">
                Sharpen your skills and build networking connections at our next meetup.
              </p>
            </div>
            <Link
              href="/events"
              className="mt-4 sm:mt-0 text-primary hover:text-primary-hover text-sm font-heading font-bold flex items-center group"
            >
              <span>Explore All Events</span>
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {EVENTS.map((event, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <span className={`border text-xs font-heading font-bold px-3 py-1.5 rounded-lg ${event.color} min-w-[90px] text-center`}>
                    {event.type}
                  </span>
                  
                  <div>
                    <h3 className="font-heading font-bold text-text-main text-base sm:text-lg">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted mt-1.5">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" /> {event.date}
                      </span>
                      <span>•</span>
                      <span>{event.time}</span>
                      <span>•</span>
                      <span className="font-medium text-text-main">{event.speaker}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <span className="bg-gray-100 text-text-muted text-xs font-bold px-2.5 py-1 rounded-md">
                    {event.tag}
                  </span>
                  <Link
                    href="/events"
                    className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all duration-300 flex items-center space-x-1"
                  >
                    <span>Register</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-20 bg-white/40 border-t border-gray-200/40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-3xl text-text-main tracking-tight">
              Community Success Stories
            </h2>
            <p className="text-text-muted text-sm mt-3 font-sans">
              Hear from freelancers and founders who call Keralance Hub home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="glass-card p-8 rounded-2xl flex flex-col justify-between shadow-xs border border-gray-200/60"
              >
                <div className="relative">
                  <span className="absolute -top-4 -left-2 text-7xl font-serif text-primary/10 select-none">“</span>
                  <p className="text-text-main text-base italic leading-relaxed relative z-10 font-sans">
                    {t.quote}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="font-heading font-bold text-text-main text-sm">{t.author}</h4>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                  <span className="text-[11px] font-heading font-bold text-primary bg-soft-accent px-2.5 py-1 rounded-md flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> {t.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Join Community CTA */}
      <section id="join-cta" className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          {/* Banner card with Kerala inspired gradient (Teal & Emerald) */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-primary via-secondary to-teal-800 p-8 md:p-16 text-center text-white shadow-xl">
            {/* Wave overlay patterns */}
            <div className="absolute inset-0 bg-mesh-gradient-reverse opacity-10 mix-blend-overlay" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="font-heading font-extrabold text-3xl md:text-5xl leading-tight">
                Grow your freelance business in Kerala.
              </h2>
              <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
                Connect with vetted peers, view shared resources, participate in local events, and apply to premium local and global freelance contracts.
              </p>
              
              <div className="pt-6 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-gray-100 text-primary px-8 py-3.5 rounded-xl font-heading font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  <span>Join WhatsApp Group</span>
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary-hover hover:bg-teal-900 border border-teal-500/30 text-white px-8 py-3.5 rounded-xl font-heading font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Users className="h-4.5 w-4.5" />
                  <span>Join Discord Server</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
