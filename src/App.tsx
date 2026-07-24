import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        return (
          <DashboardView
            savedJobs={savedJobs}
            onToggleSaveJob={handleToggleSaveJob}
            onNavigate={setActivePage}
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
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      
      {/* Primary SPA Content */}
      <main className="flex-1 pt-16">
        {renderView()}
      </main>

      {/* Platform Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
