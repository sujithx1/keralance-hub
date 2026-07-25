import { useState } from "react";
import {
  Briefcase,
  Mail,
  Eye,
  Trash2,
  ExternalLink,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  UserCheck,
  CheckCircle,
  XCircle,
  Ban,
  Wallet,
  Clock,
  MapPin,
  FileText,
  Plus
} from "lucide-react";

interface DashboardViewProps {
  savedJobs: string[];
  onToggleSaveJob: (id: string) => void;
  onNavigate: (page: string) => void;
  currentUser: { name: string; email: string; role: "admin" | "user" | "freelancer" };
}

// Mock initial data matching visual components
const INITIAL_FREELANCERS = [
  { id: "f1", name: "Arjun K. Varma", email: "arjun@keralance.dev", role: "freelancer", status: "active", title: "Senior Full Stack Dev", location: "Kochi" },
  { id: "f2", name: "Meera Nair", email: "meera@keralance.dev", role: "freelancer", status: "active", title: "Product Designer", location: "Trivandrum" },
  { id: "f3", name: "Rahul Siddharth", email: "rahul@keralance.dev", role: "freelancer", status: "banned", title: "AI & Data Engineer", location: "Calicut" },
];

const INITIAL_CLIENTS = [
  { id: "c1", name: "Gautham Krishna", email: "gautham@neokeralalabs.com", role: "user", status: "active" },
  { id: "c2", name: "Ananya Pillai", email: "ananya@malabarcoffee.com", role: "user", status: "active" },
];

const INITIAL_JOBS = [
  {
    id: "j1",
    title: "React & Supabase Platform Developer",
    category: "Developers",
    budget: "₹85,000",
    status: "open",
    applicants: [
      { id: "a1", freelancerName: "Arjun K. Varma", proposal: "I have 7+ years of experience and have built multiple Supabase integrations. I can deliver this in 2 weeks.", amount: "₹80,000", status: "pending" },
      { id: "a2", freelancerName: "Meera Nair", proposal: "I can help with the Figma prototypes and design assets for the platform interface before coding.", amount: "₹90,000", status: "pending" }
    ]
  },
  {
    id: "j2",
    title: "Brand Identity & Web UI Design",
    category: "Designers",
    budget: "₹50,000",
    status: "in_progress",
    applicants: [
      { id: "a3", freelancerName: "Meera Nair", proposal: "I'd love to design the brand visual guidelines and Webflow storefront for your coffee brand.", amount: "₹50,000", status: "accepted" }
    ]
  }
];

export default function DashboardView({
  savedJobs,
  onToggleSaveJob,
  onNavigate,
  currentUser
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // State managers for Admin
  const [freelancersList, setFreelancersList] = useState(INITIAL_FREELANCERS);
  const [clientsList, setClientsList] = useState(INITIAL_CLIENTS);
  
  // State managers for Client
  const [clientJobs, setClientJobs] = useState(INITIAL_JOBS);

  // State managers for Freelancer
  const [bio, setBio] = useState("Senior Full Stack Dev specializing in Next.js apps, PostgreSQL database design, and Hono microservices.");
  const [hourlyRate, setHourlyRate] = useState("1500");
  const [skillsList, setSkillsList] = useState(["Next.js", "PostgreSQL", "Go", "TypeScript"]);
  const [newSkill, setNewSkill] = useState("");
  const [activeJobs, setActiveJobs] = useState([
    { title: "React & Supabase Platform Developer", client: "NeoKerala Labs", budget: "₹80,000", status: "Active" }
  ]);

  // Admin Actions
  const handleToggleBan = (id: string, role: string) => {
    if (role === "freelancer") {
      setFreelancersList(freelancersList.map(f => 
        f.id === id ? { ...f, status: f.status === "active" ? "banned" : "active" } : f
      ));
    } else {
      setClientsList(clientsList.map(c => 
        c.id === id ? { ...c, status: c.status === "active" ? "banned" : "active" } : c
      ));
    }
  };

  const handleDeleteUser = (id: string, role: string) => {
    if (role === "freelancer") {
      setFreelancersList(freelancersList.filter(f => f.id !== id));
    } else {
      setClientsList(clientsList.filter(c => c.id !== id));
    }
  };

  // Client Actions
  const handleApplicationStatus = (jobId: string, applicantId: string, newStatus: "accepted" | "rejected") => {
    setClientJobs(clientJobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          applicants: job.applicants.map(app => 
            app.id === applicantId ? { ...app, status: newStatus } : app
          )
        };
      }
      return job;
    }));
  };

  // Freelancer Add Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter(s => s !== skill));
  };

  // 1. RENDER ADMIN DASHBOARD
  const renderAdminDashboard = () => (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-primary/5 rounded-2xl p-5 shadow-3xs">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl text-primary bg-primary/5">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-primary mt-4">
            {freelancersList.length + clientsList.length}
          </h3>
          <p className="text-[10px] sm:text-xs text-text-muted mt-1">Total Verified Members</p>
        </div>

        <div className="bg-white border border-primary/5 rounded-2xl p-5 shadow-3xs">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl text-accent bg-accent/5">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-primary mt-4">
            {clientJobs.length}
          </h3>
          <p className="text-[10px] sm:text-xs text-text-muted mt-1">Platform Job Listings</p>
        </div>

        <div className="bg-white border border-primary/5 rounded-2xl p-5 shadow-3xs">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl text-red-500 bg-red-50">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-primary mt-4">
            {freelancersList.filter(f => f.status === "banned").length}
          </h3>
          <p className="text-[10px] sm:text-xs text-text-muted mt-1">Suspended Accounts</p>
        </div>
      </div>

      {/* User Moderation Panel */}
      <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="font-heading font-bold text-sm sm:text-base text-primary">Member Moderation Controls</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-primary/10 text-text-muted">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Location/Details</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Freelancers */}
              {freelancersList.map((f) => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-bg-base/20">
                  <td className="py-3.5 font-bold text-primary">{f.name}</td>
                  <td className="py-3.5 capitalize font-medium text-accent">{f.role}</td>
                  <td className="py-3.5 text-text-muted">{f.title} • {f.location}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleToggleBan(f.id, "freelancer")}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        f.status === "active" ? "border-red-100 hover:bg-red-50 text-red-600" : "border-emerald-100 hover:bg-emerald-50 text-emerald-600"
                      }`}
                      title={f.status === "active" ? "Suspend user" : "Unban user"}
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(f.id, "freelancer")}
                      className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete profile"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Clients */}
              {clientsList.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-bg-base/20">
                  <td className="py-3.5 font-bold text-primary">{c.name}</td>
                  <td className="py-3.5 capitalize font-medium text-blue-600">{c.role}</td>
                  <td className="py-3.5 text-text-muted">{c.email}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleToggleBan(c.id, "user")}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        c.status === "active" ? "border-red-100 hover:bg-red-50 text-red-600" : "border-emerald-100 hover:bg-emerald-50 text-emerald-600"
                      }`}
                      title={c.status === "active" ? "Suspend user" : "Unban user"}
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(c.id, "user")}
                      className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete profile"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 2. RENDER CLIENT DASHBOARD
  const renderClientDashboard = () => (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-heading font-bold text-base text-primary">Your Posted Freelance Jobs</h3>
        <button
          onClick={() => onNavigate("jobs")}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer flex items-center space-x-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Post New Job</span>
        </button>
      </div>

      <div className="space-y-6">
        {clientJobs.map((job) => (
          <div key={job.id} className="bg-white border border-primary/10 rounded-2xl p-5 sm:p-6 shadow-3xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-accent bg-accent/5 px-2.5 py-1 rounded-md border border-accent/10">
                  {job.category}
                </span>
                <h4 className="font-heading font-extrabold text-base sm:text-lg text-primary mt-2">{job.title}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-muted block">Budget</span>
                <span className="font-heading font-bold text-primary text-sm sm:text-base">{job.budget}</span>
              </div>
            </div>

            <div className="border-t border-primary/5 pt-4">
              <h5 className="text-xs font-heading font-bold text-primary mb-3">Applicants Proposals ({job.applicants.length})</h5>
              
              <div className="space-y-3">
                {job.applicants.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl bg-bg-base/40 border border-primary/5 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                          {app.freelancerName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-primary">{app.freelancerName}</span>
                      </div>
                      <span className="text-xs font-bold text-accent">{app.amount}</span>
                    </div>
                    
                    <p className="text-xs text-text-muted font-sans leading-relaxed">{app.proposal}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        app.status === "accepted" ? "bg-emerald-50 text-emerald-700" :
                        app.status === "rejected" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {app.status}
                      </span>
                      
                      {app.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApplicationStatus(job.id, app.id, "accepted")}
                            className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-[10px] font-heading font-bold transition-all cursor-pointer flex items-center space-x-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleApplicationStatus(job.id, app.id, "rejected")}
                            className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-[10px] font-heading font-bold transition-all cursor-pointer flex items-center space-x-1"
                          >
                            <XCircle className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 3. RENDER FREELANCER DASHBOARD
  const renderFreelancerDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Earnings & Stats */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Earnings Card */}
        <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="absolute inset-0 bg-kasavu-pattern opacity-5" />
          
          <div className="space-y-1 z-10">
            <span className="text-white/70 text-xs font-bold uppercase tracking-wider block">Freelancer Earnings</span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-4xl">₹1,24,500</h3>
            <p className="text-[10px] text-white/60">Includes active escrow milestones</p>
          </div>

          <div className="flex gap-3 z-10 self-stretch sm:self-auto justify-between">
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-white/80 block">Completed</span>
              <span className="font-heading font-bold text-sm sm:text-base">14</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-white/80 block">Hourly Rate</span>
              <span className="font-heading font-bold text-sm sm:text-base">₹{hourlyRate}/hr</span>
            </div>
          </div>
        </div>

        {/* Profile Settings Editor */}
        <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-3xs space-y-4">
          <h3 className="font-heading font-bold text-sm sm:text-base text-primary">Professional Profile Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-text-muted block mb-1">Your Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-primary/10 bg-bg-base/40 focus:bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all font-sans leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-text-muted block mb-1">Target Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-primary/10 bg-bg-base/40 focus:bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-text-muted block mb-1">Location City</label>
                <input
                  type="text"
                  value="Kochi"
                  disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-primary/10 bg-bg-base/20 text-text-muted text-xs sm:text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Gig Contracts */}
        <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-3xs space-y-4">
          <h3 className="font-heading font-bold text-sm sm:text-base text-primary">Active Gig Contracts</h3>

          <div className="space-y-3">
            {activeJobs.map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-primary/5 hover:border-primary/15 transition-all flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-primary">{c.title}</h4>
                  <p className="text-[10px] text-text-muted">Client: {c.client} • {c.budget}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Skills Tag Manager */}
      <div className="lg:col-span-4 space-y-6">
        
        <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-3xs space-y-4">
          <h3 className="font-heading font-bold text-sm sm:text-base text-primary">Skills Tag Manager</h3>
          
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Next.js, Figma"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-primary/10 bg-bg-base/40 text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white px-3.5 py-2 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="bg-primary/5 border border-primary/10 text-primary text-[10px] font-heading font-bold pl-2.5 pr-1.5 py-1 rounded-md flex items-center space-x-1"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-500 font-extrabold p-0.5"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="bg-kasavu-pattern min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary tracking-tight">
              {currentUser.role === "admin" ? "Platform Control Center" : "Member Dashboard"}
            </h1>
            <p className="text-text-muted text-xs sm:text-sm mt-1.5 max-w-xl">
              {currentUser.role === "admin" 
                ? "Admin moderation view, manage verified freelancers and suspend/remove flagged listings."
                : `Logged in as ${currentUser.name} (${currentUser.role}). Track your active gigs and stats.`
              }
            </p>
          </div>
          
          <div className="mt-5 sm:mt-0 flex items-center space-x-2 bg-white border border-primary/10 px-4 py-2.5 rounded-xl">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-heading font-bold text-primary">
              Status: {currentUser.role === "admin" ? "System Admin" : "Vetted Member"}
            </span>
          </div>
        </div>

        {/* Dashboard Panels */}
        {currentUser.role === "admin" && renderAdminDashboard()}
        {currentUser.role === "user" && renderClientDashboard()}
        {currentUser.role === "freelancer" && renderFreelancerDashboard()}

      </div>
    </div>
  );
}
