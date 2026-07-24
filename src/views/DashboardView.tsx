import { useState } from "react";
import {
  Briefcase,
  Mail,
  Eye,
  Trash2,
  ExternalLink,
  Sparkles,
  MessageSquare
} from "lucide-react";

// Mock Dashboard data
const INITIAL_ANALYTICS = [
  { label: "Portfolio Views", value: "382", change: "+14%", icon: Eye, color: "text-primary bg-primary/5" },
  { label: "Job Applications", value: "8", change: "2 Active", icon: Briefcase, color: "text-accent bg-accent/5" },
  { label: "Received Messages", value: "14", change: "3 Unread", icon: Mail, color: "text-secondary bg-secondary/5" },
];

const INITIAL_SAVED_JOBS = [
  {
    id: "j1",
    title: "React & Supabase Platform Developer",
    company: "NeoKerala Labs",
    budget: "₹65,000 - ₹90,000",
    location: "Kochi (Remote)",
  },
  {
    id: "j3",
    title: "Short-Form Video Editor / Creator",
    company: "VibeKerala Media",
    budget: "₹25,000 - ₹35,000 / mo",
    location: "Remote",
  }
];

const INITIAL_CHECKLIST = [
  { id: 1, text: "Upload profile avatar & bio", completed: true },
  { id: 2, text: "Link personal portfolio website", completed: true },
  { id: 3, text: "Add 3 core skills tags", completed: true },
  { id: 4, text: "Add 2 projects with links", completed: false },
  { id: 5, text: "Set hourly rates & availability", completed: false },
];

interface DashboardViewProps {
  savedJobs: string[];
  onToggleSaveJob: (id: string) => void;
  onNavigate: (page: string) => void;
}

export default function DashboardView({ savedJobs, onToggleSaveJob, onNavigate }: DashboardViewProps) {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [activeTab, setActiveTab] = useState("overview");

  // Profile completion calculation
  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const toggleChecklistItem = (id: number) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };


  return (
    <div className="bg-kasavu-pattern min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary tracking-tight">
              Member Dashboard
            </h1>
            <p className="text-text-muted text-xs sm:text-sm mt-1.5 max-w-xl">
              Track your profile metrics, job applications, messages, and saved opportunities.
            </p>
          </div>
          
          <div className="mt-5 sm:mt-0 flex items-center space-x-2 bg-white border border-primary/10 px-4 py-2.5 rounded-xl">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-heading font-bold text-primary">Status: Vetted Member</span>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-primary/10 mb-8 space-x-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3.5 text-xs sm:text-sm font-heading font-bold transition-all relative cursor-pointer ${
              activeTab === "overview" ? "text-primary" : "text-text-muted hover:text-primary"
            }`}
          >
            <span>Overview</span>
            {activeTab === "overview" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.7 bg-primary rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-3.5 text-xs sm:text-sm font-heading font-bold transition-all relative cursor-pointer ${
              activeTab === "saved" ? "text-primary" : "text-text-muted hover:text-primary"
            }`}
          >
            <span>Saved Jobs ({savedJobs.length})</span>
            {activeTab === "saved" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.7 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Main panel */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Analytics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {INITIAL_ANALYTICS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-primary/5 rounded-2xl p-5 shadow-3xs"
                    >
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-xl ${item.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {item.change}
                        </span>
                      </div>
                      
                      <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-primary mt-4">
                        {item.value}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-text-muted mt-1">{item.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Message Inbox */}
              <div className="bg-white border border-primary/5 rounded-2xl p-5 sm:p-6 shadow-3xs space-y-4">
                <div className="flex justify-between items-center border-b border-primary/5 pb-4">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-primary flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" /> Active Messages
                  </h3>
                  <span className="text-xs text-primary font-heading font-bold cursor-pointer hover:underline">
                    View Inbox
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl hover:bg-bg-base/40 border border-transparent hover:border-primary/5 transition-all flex justify-between items-start cursor-pointer">
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-primary">Gautham (NeoKerala)</h4>
                      <p className="text-xs text-text-muted line-clamp-1">Hi, thanks for applying. We loved your portfolio. Are you available for a brief call tomorrow?</p>
                    </div>
                    <span className="text-[9px] text-primary font-bold bg-primary/5 px-2 py-0.5 rounded shrink-0">Unread</span>
                  </div>

                  <div className="p-4 rounded-xl hover:bg-bg-base/40 border border-transparent hover:border-primary/5 transition-all flex justify-between items-start cursor-pointer">
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-primary">Meera Nair</h4>
                      <p className="text-xs text-text-muted line-clamp-1">The Webflow export has been shared. Let me know if you need help with setting up the integrations.</p>
                    </div>
                    <span className="text-[9px] text-text-muted font-medium shrink-0">2 days ago</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side Panel */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-primary/5 rounded-2xl p-6 shadow-3xs space-y-5">
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-primary">Profile Completion</h3>
                  <p className="text-[11px] text-text-muted mt-1">Complete your profile to increase your visibility on the search directory.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-primary">{progressPercent}% Completed</span>
                    <span className="text-text-muted">{completedCount}/{checklist.length} tasks</span>
                  </div>
                  <div className="w-full bg-bg-base h-2 rounded-full overflow-hidden border border-primary/5">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-3 pt-2">
                  {checklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start space-x-3 cursor-pointer select-none text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="h-4.5 w-4.5 rounded-md border-primary/20 text-primary focus:ring-primary/20 shrink-0 mt-0.5"
                      />
                      <span className={item.completed ? "line-through text-text-muted font-medium" : "text-primary font-bold"}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>

                {progressPercent === 100 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                    <span>Your profile is fully optimized!</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          /* Saved Jobs Tab view */
          <div className="max-w-3xl space-y-4">
            {savedJobs.length > 0 ? (
              INITIAL_SAVED_JOBS.filter((j) => savedJobs.includes(j.id)).map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-primary/5 p-5 rounded-2xl flex justify-between items-center shadow-3xs hover:shadow-2xs transition-all"
                >
                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-primary hover:text-accent">
                      <button onClick={() => onNavigate("jobs")} className="cursor-pointer text-left font-bold">{job.title}</button>
                    </h3>
                    <p className="text-[10px] sm:text-xs text-text-muted">
                      {job.company} • {job.location}
                    </p>
                    <p className="text-xs font-bold text-accent">{job.budget}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2.5">
                    <button
                      onClick={() => onNavigate("jobs")}
                      className="bg-bg-base hover:bg-gray-100 text-primary border border-primary/5 px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Apply</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    
                    <button
                      onClick={() => onToggleSaveJob(job.id)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                      aria-label="Remove saved job"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-primary/20">
                <Briefcase className="h-10 w-10 text-text-muted mx-auto mb-3" />
                <h3 className="font-heading font-bold text-base text-primary">No saved jobs</h3>
                <p className="text-xs text-text-muted">Browse the Job Board and click bookmark to save jobs.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
