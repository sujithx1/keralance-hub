import { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Users,
  Search,
  CheckCircle,
  X,
  Sparkles
} from "lucide-react";

const INITIAL_EVENTS = [
  {
    id: "e1",
    type: "Workshop",
    title: "Freelancing 101: Landing International Clients",
    date: "Aug 02, 2026",
    time: "3:00 PM - 5:00 PM",
    speaker: "Jose Kurian (Top Rated Developer)",
    location: "Online (Zoom)",
    tag: "Online",
    color: "border-primary text-primary bg-primary/5",
    attendees: 142,
    limit: 200,
    description: "Learn practical secrets of setting up a global profile, bidding strategically, optimizing client contracts, and converting small projects into high-value monthly retainers."
  },
  {
    id: "e2",
    type: "Meetup",
    title: "Kochi Creators & Builders Mixer",
    date: "Aug 15, 2026",
    time: "4:00 PM onwards",
    speaker: "Kochi Startup Zone, Kakkanad",
    location: "Kakkanad, Kochi",
    tag: "In-Person",
    color: "border-accent text-accent-hover bg-accent/5",
    attendees: 85,
    limit: 120,
    description: "Connect face-to-face with developers, designers, startup founders, and marketers based in Kochi. Snacks and refreshments will be provided. Excellent networking opportunity."
  },
  {
    id: "e3",
    type: "Hackathon",
    title: "Malabar Web3 & AI Builders Sprint",
    date: "Sep 05, 2026",
    time: "36-Hour Sprint",
    speaker: "Prizes up to ₹1,00,000",
    location: "Hybrid (Calicut Cyberpark / Online)",
    tag: "Hybrid",
    color: "border-secondary text-secondary bg-secondary/5",
    attendees: 210,
    limit: 300,
    description: "A fast-paced builders hackathon. Build innovative apps using modern Web3 frameworks and AI APIs. Form teams of 1-4. Mentors from elite tech firms will guide you."
  },
  {
    id: "e4",
    type: "AMA",
    title: "Inside React 19: AMA with Core Contributors",
    date: "Sep 22, 2026",
    time: "6:00 PM - 7:30 PM",
    speaker: "React Core Engineers & Experts",
    location: "Discord Voice Channel",
    tag: "Online",
    color: "border-primary text-primary bg-primary/5",
    attendees: 420,
    limit: 500,
    description: "Got questions about React 19 Server Actions, compiler setups, or hydration updates? Hop into our community Discord voice chat for an open AMA session."
  }
];

const FILTERS = ["All", "Workshop", "Meetup", "Hackathon", "AMA"];

export default function EventsView() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<typeof INITIAL_EVENTS[0] | null>(null);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const filteredEvents = useMemo(() => {
    return INITIAL_EVENTS.filter((e) => {
      const matchesFilter = selectedFilter === "All" || e.type === selectedFilter;
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail) return;

    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setSelectedEvent(null);
      setRegisterName("");
      setRegisterEmail("");
    }, 1500);
  };

  return (
    <div className="bg-kasavu-pattern min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary tracking-tight">
            Community Events
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1.5 max-w-xl">
            Learn new skills, network with founders, and participate in community-led hackathons.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-primary/10 p-5 shadow-xs mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-primary/10 bg-bg-base/40 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap gap-2 self-stretch sm:self-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all border cursor-pointer ${
                  selectedFilter === f
                    ? "bg-primary border-primary text-white shadow-xs"
                    : "bg-bg-base/60 border-primary/5 text-text-muted hover:text-primary hover:bg-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-primary/5 rounded-2xl p-6 shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`border text-[10px] font-heading font-bold px-3 py-1 rounded-lg ${event.color}`}>
                      {event.type}
                    </span>
                    <span className="bg-bg-base border border-primary/5 text-text-muted text-[9px] font-heading font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {event.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-primary text-base sm:text-lg">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-2xl leading-relaxed font-sans">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs text-text-muted font-medium">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5 text-primary" /> {event.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-accent" /> {event.time}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5 text-secondary" /> {event.location}
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1.5 text-primary" /> {event.speaker}
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 gap-4">
                  <div className="text-left lg:text-right">
                    <span className="text-[9px] text-text-muted block font-heading font-bold uppercase tracking-wider">Registered</span>
                    <span className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5 mt-0.5">
                      <Users className="h-4 w-4 text-primary" /> {event.attendees} / {event.limit} spots
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer"
                  >
                    <span>Register RSVP</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-primary/20">
              <Calendar className="h-10 w-10 text-text-muted mx-auto mb-4" />
              <h3 className="font-heading font-bold text-lg text-primary">No events found</h3>
              <p className="text-text-muted text-sm mt-1">Try changing your filters or searching another keyword.</p>
            </div>
          )}
        </div>

      </div>

      {/* RSVP Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-primary/10">
            <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-bg-base">
              <h3 className="font-heading font-bold text-sm sm:text-base text-primary flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" /> Event registration
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-gray-200 text-text-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="p-6 space-y-4">
              {registerSuccess && (
                <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-4 flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Registration successful! We've sent a link to your email.</span>
                </div>
              )}

              <div className="bg-bg-base border border-primary/5 p-4 rounded-xl space-y-2">
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">Selected:</span>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-primary leading-tight">{selectedEvent.title}</h4>
                <p className="text-xs text-text-muted flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" /> {selectedEvent.date}</p>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-primary mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Krishna"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/10 text-xs sm:text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-primary mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. anand@gmail.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/10 text-xs sm:text-sm focus:outline-hidden"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-primary/5">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2.5 rounded-xl border border-primary/10 text-xs font-bold text-text-muted hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer"
                >
                  Confirm RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
