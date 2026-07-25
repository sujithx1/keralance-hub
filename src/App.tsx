import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

// Views
import HomeView from "@/views/HomeView";
import DirectoryView from "@/views/DirectoryView";
import JobsView from "@/views/JobsView";
import ProfileView from "@/views/ProfileView";
import EventsView from "@/views/EventsView";
import ResourcesView from "@/views/ResourcesView";
import DashboardView from "@/views/DashboardView";
import AboutView from "@/views/AboutView";
import ContactView from "@/views/ContactView";

import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState<string>("home");
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string>("");
  const [savedJobs, setSavedJobs] = useState<string[]>(["j1", "j3"]); // default pre-saved
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: "admin" | "user" | "freelancer" } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleSelectProfile = (id: string) => {
    setSelectedFreelancerId(id);
    setActivePage("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleSaveJob = (id: string) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter((jobId) => jobId !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage("home");
  };

  // Render view based on page state
  const renderView = () => {
    switch (activePage) {
      case "home":
        return (
          <HomeView
            onNavigate={setActivePage}
            onSelectProfile={handleSelectProfile}
            savedJobs={savedJobs}
            onToggleSaveJob={handleToggleSaveJob}
          />
        );
      case "directory":
        return <DirectoryView onSelectProfile={handleSelectProfile} />;
      case "jobs":
        return (
          <JobsView
            savedJobs={savedJobs}
            onToggleSaveJob={handleToggleSaveJob}
          />
        );
      case "profile":
        return (
          <ProfileView
            freelancerId={selectedFreelancerId}
            onBack={() => setActivePage("directory")}
          />
        );
      case "events":
        return <EventsView />;
      case "resources":
        return <ResourcesView />;
      case "dashboard":
        if (!currentUser) {
          // Intercept and open login if guest tries to access dashboard
          setTimeout(() => setIsAuthOpen(true), 0);
          return (
            <div className="min-h-screen flex items-center justify-center bg-kasavu-pattern py-20 px-6">
              <div className="text-center bg-white border border-primary/10 p-10 rounded-3xl max-w-sm shadow-md">
                <h3 className="font-heading font-extrabold text-xl text-primary">Access Restricted</h3>
                <p className="text-xs text-text-muted mt-2">Please sign in to access your custom keralance HUB member dashboard.</p>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-heading font-bold text-xs mt-6 transition-all"
                >
                  Sign In Now
                </button>
              </div>
            </div>
          );
        }
        return (
          <DashboardView
            savedJobs={savedJobs}
            onToggleSaveJob={handleToggleSaveJob}
            onNavigate={setActivePage}
            currentUser={currentUser}
          />
        );
      case "about":
        return <AboutView onNavigate={setActivePage} />;
      case "contact":
        return <ContactView />;
      default:
        return (
          <HomeView
            onNavigate={setActivePage}
            onSelectProfile={handleSelectProfile}
            savedJobs={savedJobs}
            onToggleSaveJob={handleToggleSaveJob}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-base font-sans antialiased text-text-main">
      {/* Platform Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />
      
      {/* Primary SPA Content */}
      <main className="flex-1 pt-16">
        {renderView()}
      </main>

      {/* Auth Modal overlay */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={setCurrentUser}
      />

      {/* Platform Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
