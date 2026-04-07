"use client";

import { useState, useEffect } from "react";
import { Star, Phone, Mail, CheckCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Lawyer {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone: string;
  bio: string;
  specializations: string[];
  yearsOfExperience: number;
  rating: number;
  availableNow: boolean;
  matchReasons?: string[];
  relevanceScore?: number;
}

export default function LawyerDirectory() {
  const [filter, setFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
    
  const [activeSearch, setActiveSearch] = useState<string>("");

  // Fetch all lawyers from Convex based on exact specialization
  const listLawyers = useQuery(api.lawyers.list, !activeSearch ? {
    specialization: filter || undefined,
  } : "skip") || [];

  // Fetch recommended lawyers using content-based filtering
  const recommendedLawyers = useQuery(api.lawyers.recommend, activeSearch ? {
    query: activeSearch,
  } : "skip") || [];

  const lawyers = activeSearch ? recommendedLawyers : listLawyers;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      setTimeout(() => {
        const el = document.getElementById(window.location.hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-4", "ring-nyayak-gold", "shadow-xl");
          setTimeout(() => el.classList.remove("ring-4", "ring-nyayak-gold"), 2000);
        }
      }, 500);
    }
  }, [lawyers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    if (searchQuery) {
      setFilter(""); // Clear specialization filter when using smart search
    }
  };

  const specializations = [
    "All Fields",
    "Constitutional Law",
    "Family Law",
    "Corporate Law",
    "Criminal Law",
    "Property Law",
    "Labor Law",
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb] pt-24 relative overflow-hidden flex flex-col items-center">
      {/* Grid Background Pattern */}
      

      {/* Main Grid Container */}
      <div className="relative z-10 w-full max-w-7xl px-6 border-x border-gray-200 min-h-[calc(100vh-6rem)] mb-20 rounded-b-2xl border-b bg-[#fbfbfb]/50 backdrop-blur-[2px]">
        
        {/* Horizontal Grid Line Top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-nyayak-mute" />

        <div className="py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#111111] mb-4 tracking-tight">
              Expert Legal Directory
            </h1>
            <p className="text-lg text-[#111111] max-w-2xl mx-auto">
              Connect with top-rated legal professionals specialized in your specific needs.
            </p>
          </div>

          {/* Smart Search Form (Content-Based Filtering) */}
          <div className="mb-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Describe your case (e.g. 'I need help with a land dispute') to find the best match..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-lg hover:bg-[#432b13] transition-colors font-medium"
              >
                Find Matches
              </button>
            </form>
            {activeSearch && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 text-blue-800 px-4 py-3 rounded-lg border border-blue-100">
                <p className="text-sm font-medium">
                  Showing AI-powered recommendations for: <span className="italic">"{activeSearch}"</span>
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSearch("");
                  }}
                  className="text-sm underline hover:text-blue-900"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="mb-12 flex justify-center">
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => {
                    setFilter(spec === "All Fields" ? "" : spec);
                    setSearchQuery("");
                    setActiveSearch("");
                  }}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    ((spec === "All Fields" && filter === "" && !activeSearch) ||
                    (filter === spec && !activeSearch))
                      ? "bg-black text-white shadow-md transform scale-105"
                      : "bg-[#fbfbfb] text-[#111111] border border-gray-200 hover:border-nyayak-slate hover:bg-[#fbfbfb]"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Lawyers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(lawyers as any[]).map((lawyer: any) => (
              <div
                key={lawyer._id}
                id={lawyer._id}
                className="group bg-[#fbfbfb] rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col scroll-mt-24"
              >
                {/* Header with availability badge */}
                <div className="bg-[#E8E1D9] p-6 relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {lawyer.image ? (
                        <img 
                          src={lawyer.image} 
                          alt={lawyer.name} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm bg-[#fbfbfb]"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-nyayak-mute flex items-center justify-center text-[#111111] font-bold text-xl border-2 border-nyayak-slate">
                          {lawyer.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-[#111111] group-hover:text-black transition-colors">{lawyer.name}</h3>
                        <p className="text-black font-medium text-sm mt-1">
                          {lawyer.yearsOfExperience} years experience
                        </p>
                      </div>
                    </div>
                    {lawyer.availableNow && (
                      <div className="flex items-center gap-1 bg-[#4A6741] text-white px-2.5 py-1 rounded-full shadow-sm shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">Available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">


                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(lawyer.rating)
                              ? "fill-current"
                              : "text-gray-300 fill-none"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[#111111] ml-1">
                      {lawyer.rating}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-[#111111] text-sm mb-6 line-clamp-3 leading-relaxed grow">
                    {lawyer.bio || "Experienced legal professional ready to assist you."}
                  </p>

                  {/* Specializations */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {lawyer.specializations.slice(0, 3).map((spec: string) => (
                        <span
                          key={spec}
                          className="text-xs bg-[#F5F1ED] text-black px-2.5 py-1 rounded-md font-medium border border-[#E8E1D9]"
                        >
                          {spec}
                        </span>
                      ))}
                      {lawyer.specializations.length > 3 && (
                        <span className="text-xs text-[#111111] py-1 font-medium">
                          +{lawyer.specializations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI Match Reasons */}
                  {lawyer.matchReasons && lawyer.matchReasons.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
                        <span className="text-xs font-bold text-blue-900">AI Match Details</span>
                      </div>
                      <ul className="list-disc list-inside text-xs text-blue-800 ml-4 space-y-1">
                        {lawyer.matchReasons.map((reason: string, idx: number) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <a
                        href={`mailto:${lawyer.email}`}
                        className="flex items-center gap-3 text-sm text-[#111111] hover:text-black transition-colors group/link"
                      >
                        <Mail className="w-4 h-4 text-gray-500 group-hover/link:text-black" />
                        <span className="truncate">{lawyer.email}</span>
                      </a>
                      <a
                        href={`tel:${lawyer.phone}`}
                        className="flex items-center gap-3 text-sm text-[#111111] hover:text-black transition-colors group/link"
                      >
                        <Phone className="w-4 h-4 text-gray-500 group-hover/link:text-black" />
                        <span>{lawyer.phone}</span>
                      </a>
                    </div>

                    {/* Contact Button */}
                    <button className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-[#432b13] transition-all shadow-sm hover:shadow-md font-medium text-sm">
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



