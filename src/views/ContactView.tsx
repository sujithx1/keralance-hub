import { useState } from "react";
import { Mail, MessageSquare, MapPin, CheckCircle, Send } from "lucide-react";

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msgType, setMsgType] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSuccess(false), 2500);
    }, 1200);
  };

  return (
    <div className="bg-kasavu-pattern min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary tracking-tight">
            Get in Touch
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1.5 max-w-xl">
            Have questions about keralance HUB? Want to partner with us or hire at scale? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left panel: Info & Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-primary/10 p-6 sm:p-8 rounded-2xl shadow-3xs space-y-6">
              <h3 className="font-heading font-bold text-sm sm:text-base text-primary">Contact Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/5">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-text-muted font-heading font-bold uppercase tracking-wider block">Email Address</span>
                    <a href="mailto:hello@keralancehub.com" className="text-xs sm:text-sm font-semibold text-primary hover:text-accent transition-colors">
                      hello@keralancehub.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/5">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-text-muted font-heading font-bold uppercase tracking-wider block">Community Channels</span>
                    <a href="#join-cta" className="text-xs sm:text-sm font-semibold text-primary hover:text-accent transition-colors">
                      WhatsApp, Discord, Slack
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/5">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-text-muted font-heading font-bold uppercase tracking-wider block">Location HQ</span>
                    <span className="text-xs sm:text-sm font-semibold text-primary">
                      Kochi, Kerala, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white rounded-2xl p-6 sm:p-8 space-y-3 relative overflow-hidden border border-primary/5">
              <div className="absolute inset-0 bg-kasavu-pattern opacity-5 pointer-events-none" />
              <h4 className="font-heading font-bold text-xs sm:text-sm">Looking to hire at scale?</h4>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                If you have complex developer, designer, or editorial requirements, we can curate a custom shortlist of elite professionals. Email our community leads at <a href="mailto:talent@keralancehub.com" className="underline hover:text-accent font-bold">talent@keralancehub.com</a>.
              </p>
            </div>
          </div>

          {/* Right panel: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-primary/10 rounded-2xl p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-5">
              {success && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span>Thank you! Your message has been sent. We'll get back to you within 24 hours.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-primary mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-primary/10 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold text-primary mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. anand@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-primary/10 text-xs sm:text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-primary mb-1.5">
                  Message Type
                </label>
                <select
                  value={msgType}
                  onChange={(e) => setMsgType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/10 text-xs sm:text-sm focus:outline-hidden bg-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Community Support">Community Support</option>
                  <option value="Partnership proposal">Partnership / Sponsorship</option>
                  <option value="Hire Talent">Hiring Talent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-primary mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we help you? Describe in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/10 text-xs sm:text-sm focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-xl text-xs font-heading font-bold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-3.5 w-3.5 text-accent" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
