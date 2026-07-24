"use client";
// Job Board - Dynamic list, detail preview panel, and post gig slide-over forms

import { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Plus,
  X,
  Bookmark,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Mock Database of Freelance Jobs
const INITIAL_JOBS = [
  {
    id: "j1",
    title: "Next.js & Supabase Platform Developer",
    company: "NeoKerala Labs",
    budget: 90000,
    budgetString: "₹65,000 - ₹90,000",
    type: "Contract",
    location: "Kochi",
    remote: true,
    skills: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
    time: "2 hours ago",
    description: "We are seeking a senior frontend engineer to build out our collaboration portal. The work involves setting up secure row-level security policies in Supabase, optimizing next-gen dashboard views with Next.js App Router, and implementing real-time web socket updates."
  },
  {
    id: "j2",
    title: "Brand Identity & Web UI Design",
    company: "Malabar Coffee Co.",
    budget: 50000,
    budgetString: "₹40,000 - ₹50,000",
    type: "Fixed Price",
    location: "Calicut",
    remote: false,
    skills: ["Brand Guidelines", "Figma", "Webflow", "Illustrator"],
    time: "5 hours ago",
    description: "Looking for an experienced designer to revamp the online presence of our premium coffee brand. Deliverables include a comprehensive brand style guide, logo iterations, and high-fidelity prototypes in Figma for our main store and subscription flow."
  },
  {
    id: "j3",
    title: "Short-Form Video Editor / Creator",
    company: "VibeKerala Media",
    budget: 35000,
    budgetString: "₹25,000 - ₹35,000 / mo",
    type: "Monthly Retainer",
    location: "Remote",
    remote: true,
    skills: ["Premiere Pro", "CapCut", "Motion Graphics", "Vertical Video"],
    time: "1 day ago",
    description: "Create engaging, high-retention vertical videos for Instagram and YouTube. You will work closely with our scripts team and must understand pacing, color correction, sound design, and text callouts."
  },
  {
    id: "j4",
    title: "SaaS SEO Audit & Backlink Campaign",
    company: "SproutTech",
    budget: 45000,
    budgetString: "₹45,000 Fixed",
    type: "Fixed Price",
    location: "Trivandrum",
    remote: true,
    skills: ["SEO Strategy", "Google Analytics", "Screaming Frog", "Link Building"],
    time: "3 days ago",
    description: "Audit our existing Webflow SaaS site, identify speed and indexation bottlenecks, compile a competitor gap report, and design a custom backlink acquisition campaign focused on authority tech blogs."
  },
  {
    id: "j5",
    title: "Custom LLM Chatbot Integration",
    company: "Kozhikode AI Solutions",
    budget: 120000,
    budgetString: "₹1,00,000 - ₹1,20,000",
    type: "Contract",
    location: "Calicut",
    remote: true,
    skills: ["Python", "FastAPI", "OpenAI API", "LangChain"],
    time: "4 days ago",
    description: "Integrate a custom LLM assistant with our existing enterprise support channel. Needs expertise in LangChain retrieval-augmented generation (RAG), vector databases, and high-performance FastAPI backends."
  }
];

export default function JobBoard() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  
  // Job detail selection
  const [selectedJob, setSelectedJob] = useState<typeof INITIAL_JOBS[0] | null>(INITIAL_JOBS[0]);
  
  // Job Post Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobBudget, setNewJobBudget] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobSkills, setNewJobSkills] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newJobType, setNewJobType] = useState("Contract");
  const [newJobRemote, setNewJobRemote] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);

  // Filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation =
        selectedLocation === "All" || job.location === selectedLocation;

      const matchesRemote = !isRemoteOnly || job.remote;

      return matchesSearch && matchesLocation && matchesRemote;
    });
  }, [jobs, searchQuery, selectedLocation, isRemoteOnly]);

  const toggleSaveJob = (id: string) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter((jobId) => jobId !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCompany || !newJobBudget || !newJobDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    const createdJob = {
      id: "j" + (jobs.length + 1),
      title: newJobTitle,
      company: newJobCompany,
      budget: parseInt(newJobBudget) || 30000,
      budgetString: `₹${parseInt(newJobBudget).toLocaleString()}`,
      type: newJobType,
      location: newJobLocation || "Remote",
      remote: newJobRemote,
      skills: newJobSkills.split(",").map((s) => s.trim()).filter((s) => s !== ""),
      time: "Just now",
      description: newJobDescription
    };

    setJobs([createdJob, ...jobs]);
    setSelectedJob(createdJob);
    
    // reset form
    setNewJobTitle("");
    setNewJobCompany("");
    setNewJobBudget("");
    setNewJobLocation("");
    setNewJobSkills("");
    setNewJobDescription("");
    
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsFormOpen(false);
    }, 1500);
  };

  return (
    <div className="bg-mesh-gradient min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-text-main tracking-tight">
              Freelance Job Board
            </h1>
            <p className="text-text-muted text-sm sm:text-base mt-2 max-w-xl">
              Apply directly to exclusive local and international opportunities without paying broker fees.
            </p>
          </div>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-6 sm:mt-0 bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-xl font-heading font-bold text-sm transition-all duration-300 flex items-center space-x-2 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Post a Freelance Job</span>
          </button>
        </div>

        {/* Filters and List view layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Filters & Listings */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Search and Filters */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-5 shadow-xs flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-text-muted">Location:</span>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded-lg border-none px-3 py-1.5 focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="All">All Locations</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Trivandrum">Trivandrum</option>
                    <option value="Calicut">Calicut</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isRemoteOnly}
                    onChange={(e) => setIsRemoteOnly(e.target.checked)}
                    className="h-4 w-4 rounded-md border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-xs font-heading font-bold text-text-main">Remote Only</span>
                </label>
              </div>
            </div>

            {/* Listings Grid */}
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const isSelected = selectedJob?.id === job.id;
                  const isSaved = savedJobs.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`bg-white border p-6 rounded-2xl cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/10 shadow-md"
                          : "border-gray-200/80 hover:border-gray-300 hover:shadow-xs"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-primary bg-soft-accent px-2 py-0.5 rounded">
                            {job.type}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveJob(job.id);
                            }}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isSaved
                                ? "bg-amber-50 border-amber-200 text-accent"
                                : "bg-gray-50 border-gray-100 text-text-muted hover:text-text-main"
                            }`}
                          >
                            <Bookmark className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <h3 className="font-heading font-bold text-text-main text-base mt-3">
                          {job.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">{job.company}</p>

                        <div className="flex items-center space-x-4 mt-3 text-xs text-text-muted">
                          <span className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" /> {job.location} {job.remote && "(Remote)"}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" /> {job.time}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-heading font-extrabold text-secondary">
                          {job.budgetString}
                        </span>
                        
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 2).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="bg-gray-50 text-[10px] text-text-muted px-2 py-0.5 rounded border border-gray-100"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 2 && (
                            <span className="text-[10px] text-text-muted px-1.5 py-0.5">
                              +{job.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center bg-white/50 rounded-2xl border border-dashed border-gray-300">
                  <Briefcase className="h-10 w-10 text-text-muted mx-auto mb-4" />
                  <h3 className="font-heading font-bold text-lg text-text-main">No jobs found</h3>
                  <p className="text-text-muted text-sm mt-1">Try clearing your filters or changing search query.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Job Detail View */}
          <div className="lg:col-span-5 sticky top-28 hidden lg:block">
            {selectedJob ? (
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col space-y-6">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-primary bg-soft-accent px-3 py-1 rounded-md">
                      {selectedJob.type}
                    </span>
                    <span className="text-xs text-text-muted flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" /> {selectedJob.time}
                    </span>
                  </div>

                  <h2 className="font-heading font-extrabold text-xl text-text-main mt-4 leading-tight">
                    {selectedJob.title}
                  </h2>
                  <p className="text-sm font-semibold text-primary mt-1">{selectedJob.company}</p>

                  <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block">Estimated Budget</span>
                      <span className="text-sm font-heading font-extrabold text-secondary">{selectedJob.budgetString}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block">Location</span>
                      <span className="text-sm font-heading font-semibold text-text-main flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-primary" /> {selectedJob.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm text-text-main mb-2">Job Description</h4>
                  <p className="text-sm text-text-muted leading-relaxed font-sans">
                    {selectedJob.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm text-text-main mb-2.5">Skills Required</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-gray-100 border border-gray-200/50 text-text-main text-xs px-3 py-1 rounded-lg font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center space-x-4">
                  <a
                    href="mailto:jobs@keralancehub.com?subject=Application%20for%20Job"
                    className="flex-1 bg-primary hover:bg-primary-hover text-white text-center py-3.5 rounded-xl font-heading font-bold text-sm transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/20"
                  >
                    Apply for this Job
                  </a>
                  <button
                    onClick={() => toggleSaveJob(selectedJob.id)}
                    className={`px-4 py-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                      savedJobs.includes(selectedJob.id)
                        ? "bg-amber-50 border-amber-200 text-accent"
                        : "bg-white hover:bg-gray-50 border-gray-200 text-text-muted"
                    }`}
                  >
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 border border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <Briefcase className="h-8 w-8 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-muted">Select a job from the listing to view details and apply.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Post a Job Slide-Over / Dialog Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs p-4 sm:p-6">
          <div className="bg-white w-full max-w-xl h-full rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden border border-gray-200 animate-slideLeft">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-200/80 flex items-center justify-between bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text-main">Post a Freelance Job</h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-text-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handlePostJob} className="flex-1 overflow-y-auto p-6 space-y-5">
              {formSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3 text-emerald-800">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-semibold">Job posted successfully! Updating board...</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-heading font-bold text-text-main mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Designer, React Developer..."
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-text-main mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SproutTech"
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold text-text-main mb-1.5">
                    Budget (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={newJobBudget}
                    onChange={(e) => setNewJobBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-text-main mb-1.5">
                    Job Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kochi, Calicut"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold text-text-main mb-1.5">
                    Contract Type
                  </label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden"
                  >
                    <option value="Contract">Contract</option>
                    <option value="Fixed Price">Fixed Price</option>
                    <option value="Monthly Retainer">Monthly Retainer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 py-2">
                <input
                  type="checkbox"
                  id="remoteCheck"
                  checked={newJobRemote}
                  onChange={(e) => setNewJobRemote(e.target.checked)}
                  className="h-4.5 w-4.5 rounded-md border-gray-300 text-primary"
                />
                <label htmlFor="remoteCheck" className="text-xs font-bold text-text-main cursor-pointer select-none">
                  This job is open to remote candidates
                </label>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-text-main mb-1.5">
                  Skills Required (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Supabase, Tailwind"
                  value={newJobSkills}
                  onChange={(e) => setNewJobSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-text-main mb-1.5">
                  Job Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the scope, deliverables, timeline, and application details..."
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden"
                />
              </div>
            </form>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-gray-200/80 bg-gray-50 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-text-muted hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handlePostJob}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-xs font-heading font-bold transition-all"
              >
                Publish Job Post
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
