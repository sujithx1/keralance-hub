"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Layers,
  Sparkles,
  CheckCircle,
  XCircle,
  Briefcase,
  ChevronRight
} from "lucide-react";

// Mock Database of Freelancers
const FREELANCERS = [
  {
    id: "f1",
    name: "Arjun K. Varma",
    role: "Senior Full Stack Dev",
    category: "Developers",
    avatar: "AV",
    rating: 4.9,
    reviews: 42,
    skills: ["Next.js", "React Native", "PostgreSQL", "Go", "Tailwind CSS"],
    available: true,
    location: "Kochi",
    hourlyRate: "₹1,500/hr",
    bio: "Ex-startup lead engineer specializing in fast, reactive, and responsive Next.js apps and mobile cross-platform platforms.",
    bgColor: "bg-teal-50",
  },
  {
    id: "f2",
    name: "Meera Nair",
    role: "Product Designer",
    category: "Designers",
    avatar: "MN",
    rating: 5.0,
    reviews: 38,
    skills: ["Figma", "Design Systems", "UI/UX", "Webflow", "Illustrator"],
    available: true,
    location: "Trivandrum",
    hourlyRate: "₹1,800/hr",
    bio: "Crafting modern, accessible, and delightful experiences for startups and brands. Specializes in building and scaling design systems.",
    bgColor: "bg-emerald-50",
  },
  {
    id: "f3",
    name: "Rahul Siddharth",
    role: "AI & Data Engineer",
    category: "AI Engineers",
    avatar: "RS",
    rating: 4.8,
    reviews: 24,
    skills: ["Python", "PyTorch", "LLMs", "FastAPI", "LangChain"],
    available: false,
    location: "Calicut",
    hourlyRate: "₹2,500/hr",
    bio: "Helping organizations build custom AI copilots, machine learning models, and complex analytics pipelines.",
    bgColor: "bg-amber-50",
  },
  {
    id: "f4",
    name: "Sneha Joseph",
    role: "Short-Form Video Editor",
    category: "Video Editors",
    avatar: "SJ",
    rating: 4.7,
    reviews: 19,
    skills: ["Premiere Pro", "CapCut", "After Effects", "DaVinci Resolve"],
    available: true,
    location: "Kochi",
    hourlyRate: "₹1,200/hr",
    bio: "Creating high-retention vertical videos for TikTok, Instagram Reels, and YouTube Shorts. 10M+ collective organic views generated.",
    bgColor: "bg-teal-50",
  },
  {
    id: "f5",
    name: "Karthik Menon",
    role: "SEO & Growth Marketer",
    category: "Marketing",
    avatar: "KM",
    rating: 4.9,
    reviews: 31,
    skills: ["Google Analytics", "SEO Strategy", "Meta Ads", "Copywriting"],
    available: true,
    location: "Palakkad",
    hourlyRate: "₹1,400/hr",
    bio: "Helping SaaS and local e-commerce brands double their organic search traffic through data-driven content marketing and SEO frameworks.",
    bgColor: "bg-emerald-50",
  },
  {
    id: "f6",
    name: "Anjali Dev",
    role: "Technical Writer & Copywriter",
    category: "Writers",
    avatar: "AD",
    rating: 4.9,
    reviews: 22,
    skills: ["Technical Writing", "Copywriting", "Ghostwriting", "API Docs"],
    available: true,
    location: "Trivandrum",
    hourlyRate: "₹1,100/hr",
    bio: "Translating complex developer documentation and cloud architectures into engaging blogs, articles, and whitepapers.",
    bgColor: "bg-amber-50",
  },
];

const CATEGORIES = [
  "All",
  "Developers",
  "Designers",
  "Writers",
  "Video Editors",
  "AI Engineers",
  "Marketing",
];

const LOCATIONS = ["All", "Kochi", "Trivandrum", "Calicut", "Palakkad"];

function DirectoryContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Filter Logic
  const filteredFreelancers = useMemo(() => {
    return FREELANCERS.filter((freelancer) => {
      // 1. Search Query Match
      const matchesSearch =
        freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // 2. Category Match
      const matchesCategory =
        selectedCategory === "All" || freelancer.category === selectedCategory;

      // 3. Location Match
      const matchesLocation =
        selectedLocation === "All" || freelancer.location === selectedLocation;

      // 4. Availability Match
      const matchesAvailability = !onlyAvailable || freelancer.available;

      return matchesSearch && matchesCategory && matchesLocation && matchesAvailability;
    });
  }, [searchQuery, selectedCategory, selectedLocation, onlyAvailable]);

  return (
    <div className="bg-mesh-gradient min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Page Header */}
        <div className="mb-12 text-left">
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-main tracking-tight">
            Freelancer Directory
          </h1>
          <p className="text-text-muted text-sm sm:text-base mt-2 max-w-xl">
            Discover top-tier, vetted professionals in Kerala. Search by role, skills, categories, or cities.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-6 shadow-sm mb-10 flex flex-col space-y-6">
          {/* Top Search Input & Action */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name, role, or skills (e.g. Next.js, Figma...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
              />
            </div>
            
            <div className="lg:col-span-4 flex items-center justify-between lg:justify-end space-x-4">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="h-4.5 w-4.5 rounded-md border-gray-300 text-primary focus:ring-primary/20"
                />
                <span className="text-xs font-heading font-bold text-text-main flex items-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Available Now
                </span>
              </label>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedLocation("All");
                  setOnlyAvailable(false);
                }}
                className="text-xs font-heading font-bold text-text-muted hover:text-primary transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-200/50" />

          {/* Categories Horizontal Scroll */}
          <div>
            <span className="block text-xs font-heading font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center">
              <Filter className="h-3.5 w-3.5 mr-1 text-primary" /> Filter by Category
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all duration-300 border ${
                    selectedCategory === cat
                      ? "bg-primary border-primary text-white shadow-sm shadow-primary/20"
                      : "bg-white/50 border-gray-200 text-text-muted hover:text-text-main hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-200/50" />

          {/* Locations Row */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-text-muted flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1 text-secondary" /> City Location:
            </span>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedLocation === loc
                      ? "bg-secondary text-white"
                      : "bg-gray-100 text-text-muted hover:text-text-main hover:bg-gray-200"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Directory Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFreelancers.length > 0 ? (
            filteredFreelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Details */}
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
                    <MapPin className="h-3.5 w-3.5 mr-1" /> {freelancer.location}, Kerala
                  </p>

                  <p className="text-sm text-text-muted mt-3 line-clamp-2 leading-relaxed">
                    {freelancer.bio}
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
                  <div>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block">Est. Rate</span>
                    <span className="text-sm font-heading font-extrabold text-secondary">{freelancer.hourlyRate}</span>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                      <span className="text-xs font-bold text-text-main">{freelancer.rating}</span>
                      <span className="text-[10px] text-text-muted">({freelancer.reviews})</span>
                    </div>
                    <Link
                      href={`/profile/${freelancer.id}`}
                      className="text-xs font-heading font-bold text-primary hover:text-primary-hover flex items-center justify-end"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white/50 rounded-2xl border border-dashed border-gray-300">
              <Layers className="h-10 w-10 text-text-muted mx-auto mb-4" />
              <h3 className="font-heading font-bold text-lg text-text-main">No freelancers found</h3>
              <p className="text-text-muted text-sm mt-1">Try broadening your search term or changing your filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-sm font-semibold text-text-muted">Loading Directory...</span>
      </div>
    }>
      <DirectoryContent />
    </Suspense>
  );
}
