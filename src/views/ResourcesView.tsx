import { useState, useMemo } from "react";
import {
  FileText,
  BookOpen,
  Scale,
  Download,
  Search,
  CheckCircle,
  Wrench
} from "lucide-react";

// Mock Resources Data
const RESOURCES = [
  {
    title: "Freelance Service Agreement (Indian Contract Act Compliant)",
    category: "Legal & Contracts",
    type: "Template (PDF / Docx)",
    desc: "A watertight contract template drafted specifically for Indian freelancers working with domestic and international clients. Cover scopes, milestones, and late fees.",
    icon: Scale,
    size: "140 KB",
    downloads: "1,240 downloads",
  },
  {
    title: "GST and Income Tax Guide for Kerala Freelancers",
    category: "Guides & Ebooks",
    type: "PDF E-Book",
    desc: "Understand Section 44ADA (presumptive taxation), how to file ITR-4, and when to register for GST. Designed in collaboration with chartered accountants in Kochi.",
    icon: BookOpen,
    size: "1.2 MB",
    downloads: "890 downloads",
  },
  {
    title: "Premium Client Proposal & Slide Deck Template",
    category: "Proposal & Pitch",
    type: "Figma Template",
    desc: "A beautifully structured slide deck template to present your design or development services. Includes pages for case studies, pricing, and project roadmaps.",
    icon: FileText,
    size: "Figma Link",
    downloads: "2,100 downloads",
  },
  {
    title: "Freelance Hourly Rate & Project Pricing Calculator",
    category: "Tools & Utilities",
    type: "Interactive Spreadsheet",
    desc: "Enter your desired monthly salary, overhead costs, billable hours, and tax obligations to automatically compute your target hourly rate.",
    icon: Wrench,
    size: "68 KB",
    downloads: "950 downloads",
  },
  {
    title: "International Payments & Remittance Setup Guide",
    category: "Guides & Ebooks",
    type: "PDF Guide",
    desc: "Compare Wise, Payoneer, PayPal, and Direct SWIFT wire transfers. Learn how to secure the best exchange rates and lowest conversion charges.",
    icon: BookOpen,
    size: "450 KB",
    downloads: "1,410 downloads",
  }
];

const CATEGORIES = ["All", "Legal & Contracts", "Guides & Ebooks", "Proposal & Pitch", "Tools & Utilities"];

export default function ResourcesView() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    return RESOURCES.filter((res) => {
      const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
      const matchesSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleDownload = (title: string) => {
    setDownloadingId(title);
    setTimeout(() => {
      setDownloadingId(null);
      setSuccessId(title);
      setTimeout(() => {
        setSuccessId(null);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="bg-kasavu-pattern min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-primary tracking-tight">
            Premium Resources
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1.5 max-w-xl">
            Download curated legal templates, guides, tax calculators, and assets built to elevate your freelance business.
          </p>
        </div>

        {/* Search & Categories Toolbar */}
        <div className="bg-white rounded-2xl border border-primary/10 p-5 shadow-xs mb-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-primary/10 bg-bg-base/40 text-xs sm:text-sm focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap gap-2 self-stretch lg:self-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary border-primary text-white shadow-xs"
                    : "bg-bg-base/60 border-primary/5 text-text-muted hover:text-primary hover:bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredResources.length > 0 ? (
            filteredResources.map((res, idx) => {
              const IconComponent = res.icon;
              const isDownloading = downloadingId === res.title;
              const isSuccess = successId === res.title;

              return (
                <div
                  key={idx}
                  className="bg-white border border-primary/5 rounded-2xl p-6 sm:p-8 shadow-3xs hover:shadow-2xs transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-heading font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md uppercase tracking-wider border border-primary/5">
                        {res.category}
                      </span>
                      <span className="text-xs text-text-muted font-medium">{res.type}</span>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-bg-base flex items-center justify-center text-primary shrink-0 border border-primary/5">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-primary text-base leading-snug">
                          {res.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-2 leading-relaxed font-sans">
                          {res.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-primary/5 flex items-center justify-between">
                    <div className="text-xs text-text-muted">
                      <span>{res.size}</span>
                      <span className="mx-2">•</span>
                      <span>{res.downloads}</span>
                    </div>

                    <button
                      onClick={() => handleDownload(res.title)}
                      disabled={isDownloading}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all duration-300 flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                        isSuccess
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                          : "bg-primary hover:bg-primary-hover text-white"
                      }`}
                    >
                      {isSuccess ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>Downloaded</span>
                        </>
                      ) : isDownloading ? (
                        <span>Downloading...</span>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download Asset</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-primary/20">
              <FileText className="h-10 w-10 text-text-muted mx-auto mb-4" />
              <h3 className="font-heading font-bold text-lg text-primary">No resources found</h3>
              <p className="text-text-muted text-sm mt-1">Try resetting your filters or changing search query.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
