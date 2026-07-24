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
  MessageSquare,
  Sparkles,
  MapPin,
  Bookmark
} from "lucide-react";

interface HomeViewProps {
  onNavigate: (page: string) => void;
  onSelectProfile: (id: string) => void;
  savedJobs: string[];
  onToggleSaveJob: (id: string) => void;
}

// Mock Data matching color themes
const STATS = [
  { label: "Active Members", value: "2,400+", icon: Users, gradient: "from-primary/10 to-accent/10" },
  { label: "Projects Completed", value: "1,850+", icon: Layers, gradient: "from-accent/10 to-primary/10" },
  { label: "Jobs Posted", value: "720+", icon: Briefcase, gradient: "from-primary/15 to-primary/5" },
  { label: "Collaborations", value: "340+", icon: Zap, gradient: "from-accent/15 to-accent/5" },
];

const WHY_US = [
  {
    title: "Trusted Community First",
    description: "Every member is verified. Build lasting local partnerships with trustworthy creators, designers, and engineers based right here in Kerala.",
    icon: ShieldCheck,
  },
  {
    title: "Quality Gigs & Projects",
    description: "Access curated projects from local startups to global firms. Say goodbye to spam bids and race-to-the-bottom pricing models.",
    icon: TrendingUp,
  },
  {
    title: "Vibrant Collaboration",
    description: "Participate in weekly community reviews, code sessions, design reviews, and local developer meetups to hone your freelance craft.",
    icon: Sparkles,
  },
];

const CATEGORIES = [
  { name: "Developers", icon: Code, count: "840+", gradient: "from-primary to-primary-hover" },
  { name: "Designers", icon: Palette, count: "520+", gradient: "from-accent to-accent-hover" },
  { name: "Writers", icon: Edit3, count: "310+", gradient: "from-secondary to-primary" },
  { name: "Video Editors", icon: Video, count: "290+", gradient: "from-primary to-accent" },
  { name: "AI Engineers", icon: Cpu, count: "180+", gradient: "from-accent to-secondary" },
  { name: "Marketing", icon: TrendingUp, count: "220+", gradient: "from-secondary to-primary-hover" },
  { name: "No-Code Makers", icon: MousePointer, count: "140+", gradient: "from-primary-hover to-accent" },
  { name: "Photographers", icon: Camera, count: "90+", gradient: "from-accent-hover to-secondary" },
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
    bgColor: "bg-primary/5 border-primary/20",
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
    bgColor: "bg-accent/5 border-accent/20",
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
    bgColor: "bg-secondary/5 border-secondary/20",
  },
];

const LATEST_JOBS = [
  {
    id: "j1",
    title: "React & Supabase Platform Developer",
    client: "NeoKerala Labs",
    budget: "₹65,000 - ₹90,000",
    type: "Contract",
    location: "Remote (Kerala)",
    skills: ["React", "Supabase", "TypeScript"],
    time: "2 hours ago",
  },
  {
    id: "j2",
    title: "Brand Identity & Web UI Design",
    client: "Malabar Coffee Co.",
    budget: "₹40,000 - ₹50,000",
    type: "Fixed Price",
    location: "Hybrid (Calicut)",
    skills: ["Brand Guidelines", "Figma", "Webflow"],
    time: "5 hours ago",
  },
  {
    id: "j3",
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
    color: "border-primary text-primary bg-primary/5",
  },
  {
    type: "Meetup",
    title: "Kochi Creators & Builders Mixer",
    date: "Aug 15, 2026",
    time: "4:00 PM onwards",
    speaker: "Kochi Startup Zone, Kakkanad",
    tag: "In-Person",
    color: "border-accent text-accent-hover bg-accent/5",
  },
  {
    type: "Hackathon",
    title: "Malabar Web3 & AI Builders Sprint",
    date: "Sep 05, 2026",
    time: "36-Hour Virtual Hackathon",
    speaker: "Prizes up to ₹1,00,000",
    tag: "Hybrid",
    color: "border-secondary text-secondary bg-secondary/5",
  },
];

const TESTIMONIALS = [
  {
    quote: "keralance HUB changed how I freelance. I found three high-paying clients based in Bangalore and Singapore directly through local recommendations here.",
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

export default function HomeView({
  onNavigate,
  onSelectProfile,
  savedJobs,
  onToggleSaveJob
}: HomeViewProps) {
  return (
    <div className="bg-kasavu-pattern min-h-screen relative overflow-hidden pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-6 flex flex-col space-y-6 md:space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-white/80 border border-primary/10 px-4 py-1.5 rounded-full w-fit shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-heading font-bold text-primary">Kerala's Premier Freelance Network</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-text-main">
                  കേരളത്തിലെ <br />
                  <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    Freelancers
                  </span>{" "}
                  ഒന്നിക്കുന്ന Community.
                </h1>
                <p className="font-sans text-base sm:text-lg text-text-muted max-w-lg leading-relaxed">
                  Connect. Learn. Collaborate. Grow. Discover top local developers, designers, video editors, and marketers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    document.getElementById("join-cta")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-primary hover:bg-primary-hover text-white text-center px-8 py-4 rounded-xl font-heading font-bold text-sm transition-all duration-300 shadow-md shadow-primary/15 hover:shadow-primary/25 hover:-translate-y-0.5 cursor-pointer"
                >
                  Join Community
                </button>
                <button
                  onClick={() => onNavigate("directory")}
                  className="bg-white hover:bg-gray-50 text-text-main border border-primary/10 text-center px-8 py-4 rounded-xl font-heading font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-2xs cursor-pointer"
                >
                  <span>Explore Freelancers</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Badges list */}
              <div className="pt-6 border-t border-primary/10 grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-heading font-bold text-primary text-base sm:text-lg">100%</h4>
                  <p className="text-[10px] sm:text-xs text-text-muted">Kerala Vetted</p>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary text-base sm:text-lg">Zero</h4>
                  <p className="text-[10px] sm:text-xs text-text-muted">Bidding Charges</p>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary text-base sm:text-lg">₹25M+</h4>
                  <p className="text-[10px] sm:text-xs text-text-muted">Collab Valuation</p>
                </div>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md md:max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-accent/5 to-secondary/5 rounded-3xl blur-2xl transform rotate-3" />
                
                {/* Illustration Box */}
                <div className="relative bg-white border border-primary/10 rounded-2xl p-4 sm:p-6 shadow-lg overflow-hidden">
                  <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-xs">
                    <defs>
                      <linearGradient id="rectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0B5D3B" stopOpacity="0.06" />
                        <stop offset="50%" stopColor="#C89B3C" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#083D29" stopOpacity="0.08" />
                      </linearGradient>
                    </defs>

                    <rect width="500" height="400" rx="16" fill="url(#rectGrad)" />

                    {/* Wave elements in background */}
                    <path d="M 0 320 Q 125 300 250 320 T 500 320 L 500 400 L 0 400 Z" fill="#0B5D3B" fillOpacity="0.06" />
                    <path d="M 0 350 Q 125 330 250 350 T 500 350 L 500 400 L 0 400 Z" fill="#C89B3C" fillOpacity="0.07" />

                    {/* Giant Palm Tree SVG representing Visual System */}
                    <g transform="translate(10, 40)">
                      <path d="M48 300 C 49 200, 52 140, 50 60 L 54 60 C 56 140, 53 200, 52 300 Z" fill="#0B5D3B" />
                      <path d="M52 70 Q 15 65, 5 95 Q 17 78, 52 70" fill="#0B5D3B" />
                      <path d="M52 70 Q 10 30, 30 10 Q 38 45, 52 70" fill="#0B5D3B" />
                      <path d="M52 70 Q 50 -10, 65 -5 Q 60 45, 52 70" fill="#0B5D3B" />
                      <path d="M52 70 Q 95 20, 85 60 Q 72 50, 52 70" fill="#0B5D3B" />
                      <path d="M52 70 Q 98 80, 75 110 Q 66 90, 52 70" fill="#0B5D3B" />
                    </g>

                    {/* IDE / Laptop Workspace screen in foreground */}
                    <rect x="170" y="130" width="260" height="170" rx="12" fill="#083D29" filter="drop-shadow(0 10px 15px rgba(8,61,41,0.2))" />
                    
                    {/* Header bar */}
                    <circle cx="195" cy="148" r="4" fill="#E5E7EB" fillOpacity="0.4" />
                    <circle cx="207" cy="148" r="4" fill="#E5E7EB" fillOpacity="0.4" />
                    <circle cx="219" cy="148" r="4" fill="#E5E7EB" fillOpacity="0.4" />
                    <rect x="240" y="144" width="120" height="8" rx="4" fill="#0B5D3B" fillOpacity="0.3" />

                    {/* Code mock lines */}
                    <rect x="195" y="175" width="100" height="6" rx="3" fill="#C89B3C" />
                    <rect x="195" y="192" width="180" height="6" rx="3" fill="#F7F6F2" fillOpacity="0.8" />
                    <rect x="195" y="209" width="130" height="6" rx="3" fill="#0B5D3B" />
                    <rect x="195" y="226" width="200" height="6" rx="3" fill="#C89B3C" />
                    <rect x="195" y="243" width="80" height="6" rx="3" fill="#F7F6F2" fillOpacity="0.8" />
                    
                    {/* Connection Node overlay */}
                    <g transform="translate(330, 20)" stroke="#C89B3C" strokeWidth="2">
                      <line x1="20" y1="20" x2="60" y2="35" />
                      <line x1="60" y1="35" x2="40" y2="70" />
                      <line x1="40" y1="70" x2="20" y2="20" />
                      <circle cx="20" cy="20" r="8" fill="#0B5D3B" stroke="#C89B3C" strokeWidth="1.5" />
                      <circle cx="60" cy="35" r="8" fill="#0B5D3B" stroke="#C89B3C" strokeWidth="1.5" />
                      <circle cx="40" cy="70" r="8" fill="#C89B3C" stroke="#0B5D3B" strokeWidth="1.5" />
                    </g>
                  </svg>
                  
                  <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center bg-white/95 px-4 py-2.5 rounded-xl border border-primary/10 shadow-xs">
                    <span className="text-[10px] font-heading font-bold text-primary">keralance HUB</span>
                    <span className="text-[10px] font-heading font-extrabold text-accent flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" /> MADE IN KERALA
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. Community Stats */}
      <section className="py-12 bg-white border-y border-primary/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {STATS.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-bg-base border border-primary/5 p-6 rounded-2xl flex flex-col items-center text-center shadow-3xs hover:shadow-2xs transition-all"
                >
                  <div className={`h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-text-muted mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Why Keralance Hub */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary tracking-tight">
              A community made for Kerala’s freelance renaissance.
            </h2>
            <p className="text-text-muted text-sm sm:text-base mt-3 font-sans">
              We focus on premium projects, skilled collaboration, and keeping the profits with the creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-primary/10 p-8 rounded-2xl shadow-3xs hover:shadow-2xs hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Freelancer Categories */}
      <section className="py-16 bg-white border-t border-primary/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
                Explore Talent Categories
              </h2>
              <p className="text-text-muted text-xs sm:text-sm mt-1.5 font-sans">
                Find elite freelancers specialized in diverse domains.
              </p>
            </div>
            <button
              onClick={() => onNavigate("directory")}
              className="mt-4 sm:mt-0 text-primary hover:text-primary-hover text-xs sm:text-sm font-heading font-bold flex items-center group cursor-pointer"
            >
              <span>View Directory</span>
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate("directory")}
                  className="group relative bg-white border border-primary/5 hover:border-primary/15 p-5 rounded-2xl shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between h-36 text-left cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-xl bg-bg-base flex items-center justify-center text-primary group-hover:bg-primary/5 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-primary group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-text-muted mt-0.5">{cat.count} members</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Featured Freelancers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
              Featured Freelancers of the Week
            </h2>
            <p className="text-text-muted text-xs sm:text-sm mt-2 font-sans">
              Handpicked professionals who have set benchmarks in quality work and timely delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_FREELANCERS.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white border border-primary/5 rounded-2xl p-6 shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`h-11 w-11 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-heading font-extrabold text-sm border border-primary/10`}>
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
                  <div className="flex items-center space-x-1">
                    <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                    <span className="text-xs font-bold text-primary">{freelancer.rating}</span>
                    <span className="text-[10px] text-text-muted">({freelancer.reviews})</span>
                  </div>
                  
                  <button
                    onClick={() => onSelectProfile(freelancer.id)}
                    className="text-xs font-heading font-bold text-primary hover:text-accent flex items-center cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Latest Freelance Jobs */}
      <section className="py-16 bg-white border-y border-primary/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
                Latest Freelance Jobs
              </h2>
              <p className="text-text-muted text-xs sm:text-sm mt-1.5 font-sans">
                Apply directly to trusted listings from Kerala and beyond.
              </p>
            </div>
            <button
              onClick={() => onNavigate("jobs")}
              className="mt-4 sm:mt-0 text-primary hover:text-primary-hover text-xs sm:text-sm font-heading font-bold flex items-center group cursor-pointer"
            >
              <span>View Job Board</span>
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {LATEST_JOBS.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white border border-primary/5 rounded-2xl p-6 shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/5">
                        {job.type}
                      </span>
                      <button
                        onClick={() => onToggleSaveJob(job.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved
                            ? "bg-accent/5 border-accent/20 text-accent"
                            : "bg-gray-50 border-gray-100 text-text-muted hover:text-primary"
                        }`}
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <h3
                      onClick={() => onNavigate("jobs")}
                      className="font-heading font-bold text-primary text-sm sm:text-base mt-4 hover:text-accent transition-colors cursor-pointer"
                    >
                      {job.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-text-muted mt-0.5">{job.client}</p>

                    <p className="font-heading font-extrabold text-sm sm:text-base text-accent mt-4">
                      {job.budget}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-bg-base text-[9px] sm:text-[10px] text-text-muted px-2 py-0.5 rounded border border-primary/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-primary/5 flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs text-text-muted flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" /> {job.time}
                    </span>
                    
                    <button
                      onClick={() => onNavigate("jobs")}
                      className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all duration-300 cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Community Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
                Upcoming Community Events
              </h2>
              <p className="text-text-muted text-xs sm:text-sm mt-1.5 font-sans">
                Sharpen your skills and build networking connections at our next meetup.
              </p>
            </div>
            <button
              onClick={() => onNavigate("events")}
              className="mt-4 sm:mt-0 text-primary hover:text-primary-hover text-xs sm:text-sm font-heading font-bold flex items-center group cursor-pointer"
            >
              <span>Explore All Events</span>
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-4">
            {EVENTS.map((event, idx) => (
              <div
                key={idx}
                className="bg-white border border-primary/5 rounded-2xl p-5 sm:p-6 shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <span className={`border text-[10px] font-heading font-bold px-3 py-1.5 rounded-lg ${event.color} min-w-[90px] text-center`}>
                    {event.type}
                  </span>
                  
                  <div>
                    <h3 className="font-heading font-bold text-primary text-base sm:text-lg">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted mt-1.5">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-primary" /> {event.date}
                      </span>
                      <span>•</span>
                      <span>{event.time}</span>
                      <span>•</span>
                      <span className="font-medium text-primary">{event.speaker}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <span className="bg-bg-base text-text-muted text-[10px] font-bold px-2.5 py-1 rounded-md border border-primary/5">
                    {event.tag}
                  </span>
                  <button
                    onClick={() => onNavigate("events")}
                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all duration-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Register</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-16 bg-white border-t border-primary/5">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
              Community Success Stories
            </h2>
            <p className="text-text-muted text-xs sm:text-sm mt-2 font-sans">
              Hear from freelancers and founders who call keralance HUB home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-bg-base border border-primary/10 p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-3xs"
              >
                <div className="relative">
                  <span className="absolute -top-4 -left-2 text-6xl font-serif text-primary/10 select-none">“</span>
                  <p className="text-primary text-sm sm:text-base italic leading-relaxed relative z-10 font-sans">
                    {t.quote}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-primary/5">
                  <div>
                    <h4 className="font-heading font-bold text-primary text-sm">{t.author}</h4>
                    <p className="text-[10px] sm:text-xs text-text-muted">{t.role}</p>
                  </div>
                  <span className="text-[10px] font-heading font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md flex items-center border border-primary/5">
                    <MapPin className="h-3 w-3 mr-1" /> {t.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Join Community CTA */}
      <section id="join-cta" className="py-16 relative">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-primary via-primary-hover to-secondary p-8 md:p-14 text-center text-white shadow-lg">
            <div className="absolute inset-0 bg-kasavu-pattern opacity-10 mix-blend-overlay" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl leading-tight">
                Grow your freelance business in Kerala.
              </h2>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                Connect with vetted peers, view shared resources, participate in local events, and apply to premium freelance contracts.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-gray-100 text-primary px-8 py-3.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  <span>Join WhatsApp Group</span>
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-secondary hover:bg-black border border-primary/20 text-white px-8 py-3.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm"
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
