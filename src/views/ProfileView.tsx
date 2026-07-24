import { useState } from "react";
import {
  MapPin,
  Star,
  Layers,
  Mail,
  ExternalLink,
  ChevronLeft,
  Send,
  X,
  CheckCircle
} from "lucide-react";

// Full Profiles Mock Data
const PROFILE_DATA: Record<string, any> = {
  f1: {
    id: "f1",
    name: "Arjun K. Varma",
    role: "Senior Full Stack Dev",
    category: "Developers",
    avatar: "AV",
    rating: 4.9,
    reviewsCount: 42,
    skills: ["Next.js", "React Native", "PostgreSQL", "Go", "Tailwind CSS", "TypeScript", "Redis"],
    available: true,
    location: "Kochi",
    hourlyRate: "₹1,500/hr",
    bio: "Ex-startup lead engineer specializing in fast, reactive, and responsive Next.js apps and mobile cross-platform platforms. I build robust production-ready web apps with clean architecture, high scalability, and clean code principles.",
    bgColor: "bg-primary/5 border-primary/20",
    coverGradient: "from-primary to-primary-hover",
    experience: "7+ years",
    projects: [
      {
        title: "keralance HUB Platform",
        desc: "Designed and built the full community forum, job board integrations, and live messenger features using React, Supabase, and Tailwind CSS.",
        link: "https://keralancehub.com"
      },
      {
        title: "AyurCare App",
        desc: "Developed a cross-platform tele-consultation mobile app for ayurvedic therapies using React Native, Express, and PostgreSQL.",
        link: "https://ayurcare.in"
      }
    ],
    reviews: [
      {
        author: "Vinod Kumar",
        company: "CEO, TechMalabar",
        rating: 5,
        text: "Arjun delivered the MVP of our SaaS platform two weeks ahead of schedule. Excellent code quality and superb communication throughout the process.",
        date: "June 2026"
      },
      {
        author: "Sarah Matthew",
        company: "PM, SpiceGlobal",
        rating: 4.8,
        text: "Highly skilled React developer. Arjun helped us refactor our legacy dashboard into a clean, modern Next.js app. Would definitely work with him again.",
        date: "May 2026"
      }
    ]
  },
  f2: {
    id: "f2",
    name: "Meera Nair",
    role: "Product Designer",
    category: "Designers",
    avatar: "MN",
    rating: 5.0,
    reviewsCount: 38,
    skills: ["Figma", "Design Systems", "UI/UX", "Webflow", "Illustrator", "Prototyping", "UX Research"],
    available: true,
    location: "Trivandrum",
    hourlyRate: "₹1,800/hr",
    bio: "Crafting modern, accessible, and delightful experiences for startups and brands. Specializes in building and scaling design systems and creating high-converting marketing landing pages that wow clients.",
    bgColor: "bg-accent/5 border-accent/20",
    coverGradient: "from-accent to-accent-hover",
    experience: "5 years",
    projects: [
      {
        title: "Malabar Coffee Landing Page",
        desc: "Designed and implemented the core visual system, typography, and interactive Webflow storefront for Malabar Coffee Co.",
        link: "https://malabarcoffee.com"
      },
      {
        title: "Necter Care Dashboard",
        desc: "Crafted high-fidelity Figma design systems and user journey wireframes for a complex telehealth application layout.",
        link: "https://necter.care"
      }
    ],
    reviews: [
      {
        author: "Ananya Pillai",
        company: "Founder, Malabar Coffee",
        rating: 5,
        text: "Meera is an absolute design wizard. She completely captured our brand heritage and modern aesthetic. The Webflow landing page has increased conversions by 30%!",
        date: "July 2026"
      }
    ]
  },
  f3: {
    id: "f3",
    name: "Rahul Siddharth",
    role: "AI & Data Engineer",
    category: "AI Engineers",
    avatar: "RS",
    rating: 4.8,
    reviewsCount: 24,
    skills: ["Python", "PyTorch", "LLMs", "FastAPI", "LangChain", "Vector Databases", "Docker"],
    available: false,
    location: "Calicut",
    hourlyRate: "₹2,500/hr",
    bio: "Helping organizations build custom AI agents, machine learning pipelines, RAG frameworks, and analytics solutions that drive automation.",
    bgColor: "bg-secondary/5 border-secondary/20",
    coverGradient: "from-secondary to-primary",
    experience: "6 years",
    projects: [
      {
        title: "Enterprise Copilot Integration",
        desc: "Designed and deployed a private vector database search model using FastAPI and LangChain for secure business analytics.",
        link: "https://aico.tech"
      }
    ],
    reviews: [
      {
        author: "Deepak S.",
        company: "VP Engineering, SproutTech",
        rating: 5,
        text: "Rahul has deep expertise in LLM fine-tuning. He integrated our custom chatbot within our customer service stack flawlessly.",
        date: "April 2026"
      }
    ]
  }
};

interface ProfileViewProps {
  freelancerId: string;
  onBack: () => void;
}

export default function ProfileView({ freelancerId, onBack }: ProfileViewProps) {
  const freelancer = PROFILE_DATA[freelancerId] || PROFILE_DATA.f1;

  const [activeTab, setActiveTab] = useState("portfolio");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendingState, setSendingState] = useState<"idle" | "sending" | "success">("idle");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSendingState("sending");
    setTimeout(() => {
      setSendingState("success");
      setTimeout(() => {
        setIsContactOpen(false);
        setSendingState("idle");
        setSubject("");
        setMessage("");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="bg-kasavu-pattern min-h-screen pb-20">
      
      {/* Cover Header */}
      <div className={`h-64 sm:h-72 w-full bg-gradient-to-r ${freelancer.coverGradient} relative`}>
        <div className="absolute inset-0 bg-kasavu-pattern opacity-10 mix-blend-overlay" />
        
        {/* Back Link */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-6 relative z-10">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-white bg-black/20 hover:bg-black/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Directory</span>
          </button>
        </div>
      </div>

      {/* Profile details container */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Avatar & Basic Details Card */}
          <div className="lg:col-span-4 bg-white border border-primary/10 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center">
            
            {/* Avatar */}
            <div className={`h-28 w-28 rounded-2xl ${freelancer.bgColor} border-4 border-white shadow-xs flex items-center justify-center text-primary font-heading font-extrabold text-2xl mb-4`}>
              {freelancer.avatar}
            </div>

            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-primary tracking-tight">
              {freelancer.name}
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">{freelancer.role}</p>

            <div className="flex items-center space-x-1 mt-3">
              <Star className="h-4.5 w-4.5 text-accent fill-accent" />
              <span className="text-xs sm:text-sm font-bold text-primary">{freelancer.rating}</span>
              <span className="text-[10px] sm:text-xs text-text-muted">({freelancer.reviewsCount} reviews)</span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-text-muted mt-3">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{freelancer.location}, Kerala</span>
            </div>

            {/* Status Badge */}
            <div className="w-full mt-6 pt-4 border-t border-primary/5 flex justify-between items-center text-left">
              <span className="text-xs text-text-muted font-heading font-semibold">Availability</span>
              {freelancer.available ? (
                <span className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Available
                </span>
              ) : (
                <span className="bg-gray-50 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200">
                  Busy
                </span>
              )}
            </div>

            <div className="w-full mt-4 flex justify-between items-center text-left">
              <span className="text-xs text-text-muted font-heading font-semibold">Hourly Rate</span>
              <span className="text-xs sm:text-sm font-heading font-extrabold text-accent">{freelancer.hourlyRate}</span>
            </div>

            <div className="w-full mt-4 flex justify-between items-center text-left">
              <span className="text-xs text-text-muted font-heading font-semibold">Experience</span>
              <span className="text-xs sm:text-sm font-semibold text-primary">{freelancer.experience}</span>
            </div>

            {/* CTA Contact Button */}
            <button
              onClick={() => setIsContactOpen(true)}
              className="w-full mt-6 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <Mail className="h-4.5 w-4.5" />
              <span>Contact & Hire Me</span>
            </button>
          </div>

          {/* Right Column: Bio, Skills, Portfolio / Reviews Switcher */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Bio Card */}
            <div className="bg-white border border-primary/10 rounded-2xl p-6 sm:p-8 shadow-3xs">
              <h2 className="font-heading font-bold text-base sm:text-lg text-primary mb-3">About Me</h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
                {freelancer.bio}
              </p>

              <h3 className="font-heading font-bold text-xs sm:text-sm text-primary mt-6 mb-3">Core Expertise</h3>
              <div className="flex flex-wrap gap-1.5">
                {freelancer.skills.map((skill: string, sIdx: number) => (
                  <span
                    key={sIdx}
                    className="bg-bg-base border border-primary/10 text-primary text-[10px] sm:text-xs px-3 py-1.5 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-primary/10 space-x-6">
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`pb-3 text-xs sm:text-sm font-heading font-bold transition-all relative cursor-pointer ${
                  activeTab === "portfolio"
                    ? "text-primary"
                    : "text-text-muted hover:text-primary"
                }`}
              >
                <span>Portfolio Projects</span>
                {activeTab === "portfolio" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 text-xs sm:text-sm font-heading font-bold transition-all relative cursor-pointer ${
                  activeTab === "reviews"
                    ? "text-primary"
                    : "text-text-muted hover:text-primary"
                }`}
              >
                <span>Client Reviews ({freelancer.reviews.length})</span>
                {activeTab === "reviews" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="space-y-6">
              {activeTab === "portfolio" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {freelancer.projects.map((proj: any, pIdx: number) => (
                    <div
                      key={pIdx}
                      className="bg-white border border-primary/5 rounded-2xl p-6 shadow-3xs flex flex-col justify-between h-48"
                    >
                      <div>
                        <h3 className="font-heading font-bold text-sm sm:text-base text-primary">
                          {proj.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-text-muted mt-2 leading-relaxed font-sans line-clamp-3">
                          {proj.desc}
                        </p>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-primary/5 flex justify-between items-center">
                        <span className="text-[9px] text-text-muted flex items-center">
                          <Layers className="h-3 w-3 mr-1" /> Case Study
                        </span>
                        
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-primary hover:text-accent flex items-center space-x-1"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {freelancer.reviews.map((rev: any, rIdx: number) => (
                    <div
                      key={rIdx}
                      className="bg-white border border-primary/5 rounded-2xl p-6 shadow-3xs space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-primary">{rev.author}</h4>
                          <p className="text-[10px] text-text-muted">{rev.company}</p>
                        </div>
                        <span className="text-[10px] text-text-muted">{rev.date}</span>
                      </div>

                      <div className="flex items-center space-x-0.5 text-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(rev.rating) ? "fill-accent" : "text-gray-205"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans italic">
                        “{rev.text}”
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Hire contact modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-primary/10">
            <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-bg-base">
              <h3 className="font-heading font-bold text-base sm:text-lg text-primary flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" /> Hire {freelancer.name.split(" ")[0]}
              </h3>
              <button
                onClick={() => setIsContactOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-text-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              {sendingState === "success" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Proposal sent successfully! Arjun will contact you shortly.</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-heading font-bold text-primary mb-1">
                  Your Message Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website redesign project"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/10 text-xs sm:text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-primary mb-1">
                  Describe Project Details & Budget
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Include requirements, estimated timelines, and approximate budget..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/10 text-xs sm:text-sm focus:outline-hidden"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-primary/5">
                <button
                  type="button"
                  onClick={() => setIsContactOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-primary/10 text-xs font-bold text-text-muted hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingState === "sending"}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  {sendingState === "sending" ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Proposal</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
