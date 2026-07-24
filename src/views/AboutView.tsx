import { Sparkles, Heart, Award, ShieldCheck, ArrowUpRight } from "lucide-react";

interface AboutViewProps {
  onNavigate: (page: string) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  const VALUES = [
    {
      title: "Community First",
      desc: "We support each other. Whether it's answering a technical question, reviewing a contract, or collaborating on a client gig, our community shares resources openly.",
      icon: Heart,
    },
    {
      title: "Premium Craftsmanship",
      desc: "Kerala freelancers are world-class developers, designers, and creators. We maintain high standards of quality, punctuality, and professionalism.",
      icon: Award,
    },
    {
      title: "Trust & Transparency",
      desc: "No hidden fees, no opaque bidding bots, no middleman cuts. Direct communication, honest work, and fair compensation.",
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="bg-kasavu-pattern min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-12 sm:space-y-16">
        
        {/* Page Header */}
        <div className="text-left space-y-4">
          <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 px-3 py-1 rounded-full text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Our Story</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-primary tracking-tight leading-tight">
            Elevating Kerala's Digital Craftsmen.
          </h1>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed font-sans">
            keralance HUB was founded as a grassroots initiative to connect remote freelancers, developers, designers, and creators across Kerala. What started as a simple WhatsApp group has grown into a premium community of over 2,400+ vetted professionals building world-class products.
          </p>
        </div>

        {/* Values Section */}
        <div className="space-y-8">
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-primary tracking-tight border-b border-primary/5 pb-3">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="space-y-3 bg-white p-5 rounded-2xl border border-primary/5 shadow-3xs">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-primary">{val.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-sans">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vision statement */}
        <div className="bg-white border border-primary/10 rounded-2xl p-6 sm:p-8 shadow-3xs space-y-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-kasavu-pattern opacity-40 pointer-events-none" />
          <h2 className="font-heading font-extrabold text-lg sm:text-xl text-primary relative z-10">Our Mission</h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans relative z-10">
            To build a robust ecosystem where Kerala talent doesn't have to migrate to Tier-1 metropolitan cities to land premium tech and creative contracts. By facilitating remote networking, organizing skills bootcamps, and providing localized templates, we enable freelancers to run highly profitable businesses from their hometowns.
          </p>
        </div>

        {/* Partner CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-tr from-primary to-secondary p-8 rounded-2xl text-white shadow-md">
          <div className="space-y-2 text-center sm:text-left mb-6 sm:mb-0">
            <h3 className="font-heading font-bold text-base sm:text-lg">Have questions or want to partner?</h3>
            <p className="text-[10px] sm:text-xs text-white/80">We're always open to sponsorships, partnerships, and collaborations.</p>
          </div>
          <button
            onClick={() => onNavigate("contact")}
            className="bg-white hover:bg-gray-150 text-primary px-6 py-3 rounded-xl font-heading font-bold text-xs transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <span>Send us a Message</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
          </button>
        </div>

      </div>
    </div>
  );
}
