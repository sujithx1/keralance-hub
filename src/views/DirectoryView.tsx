import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Layers,
  ChevronRight
} from "lucide-react";

// Mock Database of Freelancers matching brand colors
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
    bgColor: "bg-primary/5 border-primary/20",
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
    bgColor: "bg-accent/5 border-accent/20",
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
    bgColor: "bg-secondary/5 border-secondary/20",
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
    bgColor: "bg-primary/5 border-primary/20",
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
    bgColor: "bg-accent/5 border-accent/20",
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
    bgColor: "bg-secondary/5 border-secondary/20",
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

interface DirectoryViewProps {
  onSelectProfile: (id: string) => void;
}

export default function DirectoryView({ onSelectProfile }: DirectoryViewProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Filter Logic
  const filteredFreelancers = useMemo(() => {
    return FREELANCERS.filter((freelancer) => {
      const matchesSearch =
        freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || freelancer.category === selectedCategory;

      const matchesLocation =
        selectedLocation === "All" || freelancer.location === selectedLocation;

      const matchesAvailability = !onlyAvailable || freelancer.available;

      return matchesSearch && matchesCategory && matchesLocation && matchesAvailability;
    });
  }, [searchQuery, selectedCategory, selectedLocation, onlyAvailable]);

  return (
    <div className="bg-kasavu-pattern min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-left">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary tracking-tight">
            Freelancer Directory
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1.5 max-w-xl">
            Discover top-tier, vetted professionals in Kerala. Search by role, skills, categories, or cities.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white/90 rounded-2xl border border-primary/10 p-5 sm:p-6 shadow-xs mb-8 flex flex-col space-y-5">
          {/* Top Search Input & Action */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name, role, or skills (e.g. Next.js, Figma...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-primary/10 bg-bg-base/40 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs sm:text-sm transition-all"
              />
            </div>
            
            <div className="lg:col-span-4 flex items-center justify-between lg:justify-end space-x-4">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="h-4.5 w-4.5 rounded-md border-primary/20 text-primary focus:ring-primary/20"
                />
                <span className="text-xs font-heading font-bold text-primary flex items-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Available
                </span>
              </label>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedLocation("All");
                  setOnlyAvailable(false);
                }}
                className="text-xs font-heading font-bold text-text-muted hover:text-primary transition-colors py-2 px-3 hover:bg-bg-base rounded-lg border border-transparent hover:border-primary/10"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="h-px bg-primary/5" />

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
                  className={`px-3.5 py-2 rounded-xl text-xs font-heading font-semibold transition-all border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-primary border-primary text-white shadow-xs"
                      : "bg-bg-base/60 border-primary/5 text-text-muted hover:text-primary hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-primary/5" />

          {/* Locations Row */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-text-muted flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1 text-accent" /> City Location:
            </span>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedLocation === loc
                      ? "bg-accent text-white"
                      : "bg-bg-base text-text-muted hover:text-primary hover:bg-primary/5"
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
                className="bg-white border border-primary/5 rounded-2xl p-6 shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`h-11 w-11 rounded-xl ${freelancer.bgColor} flex items-center justify-center text-primary font-heading font-extrabold text-sm`}>
                        {freelancer.avatar}
                      </div>
                      <div>
                        <h3
                          onClick={() => onSelectProfile(freelancer.id)}
                          className="font-heading font-bold text-primary text-sm sm:text-base hover:text-accent transition-colors cursor-pointer"
                        >
                          {freelancer.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-text-muted">{freelancer.role}</p>
                      </div>
                    </div>
                    {freelancer.available ? (
                      <span className="bg-emerald-50 text-emerald-800 text-[9px] font-heading font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" /> Available
                      </span>
                    ) : (
                      <span className="bg-gray-50 text-gray-500 text-[9px] font-heading font-bold px-2 py-0.5 rounded-full border border-gray-200">
                        Busy
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] sm:text-xs text-text-muted mt-4 flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-primary" /> {freelancer.location}, Kerala
                  </p>

                  <p className="text-xs sm:text-sm text-text-muted mt-3 line-clamp-2 leading-relaxed font-sans">
                    {freelancer.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {freelancer.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-bg-base border border-primary/5 text-text-muted text-[10px] px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-primary/5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-text-muted uppercase tracking-wider block">Est. Rate</span>
                    <span className="text-xs sm:text-sm font-heading font-extrabold text-accent">{freelancer.hourlyRate}</span>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                      <span className="text-xs font-bold text-primary">{freelancer.rating}</span>
                      <span className="text-[10px] text-text-muted">({freelancer.reviews})</span>
                    </div>
                    <button
                      onClick={() => onSelectProfile(freelancer.id)}
                      className="text-xs font-heading font-bold text-primary hover:text-accent flex items-center justify-end cursor-pointer"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white border border-dashed border-primary/20 rounded-2xl">
              <Layers className="h-10 w-10 text-text-muted mx-auto mb-4" />
              <h3 className="font-heading font-bold text-lg text-primary">No freelancers found</h3>
              <p className="text-text-muted text-sm mt-1">Try broadening your search term or changing your filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
