
"use client";
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, MapPin, Star, Shield, Briefcase, 
  MessageSquare, ChevronDown, CheckCircle2, X, SlidersHorizontal, 
  User, Mail, Phone, LayoutGrid, List, Zap, Heart, Share2, Sparkles
} from 'lucide-react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

// --- Types & Interfaces ---

interface Lawyer {
  _id: Id<"lawyers">;
  userId: Id<"users">;
  name: string;
  email: string;
  image: string;
  phone: string;
  bio: string;
  specializations: string[];
  yearsOfExperience: number;
  rating: number;
  availableNow: boolean;
  matchReasons?: string[];
}

// --- Utility Components ---

const FilterBadge = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
      active 
      ? 'bg-[#111111] text-white border-[#111111]' 
      : 'bg-[#fbfbfb] text-[#111111] border-gray-200 hover:border-[#111111] hover:bg-[#fbfbfb]'
    }`}
  >
    {label}
  </button>
);

// --- Main Page Component ---

export default function FindLawyersPage() {
  const router = useRouter();  
  const [viewMode, setViewMode] = useState<'Grid' | 'List'>('Grid');
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [aiDraftQuery, setAiDraftQuery] = useState("");
  const [activeAiQuery, setActiveAiQuery] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [activeSpecialties, setActiveSpecialties] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Fetch Data
  const listLawyers = useQuery(api.lawyers.list, { 
    specialization: activeSpecialties.length === 1 ? activeSpecialties[0] : undefined 
  });
  
  const recommendedLawyers = useQuery(api.lawyers.recommend, activeAiQuery ? { query: activeAiQuery } : "skip");

  const lawyersData = activeAiQuery ? recommendedLawyers : listLawyers;

  const isLoading = lawyersData === undefined;
  
  // Client-side filtering for complex cases (multi-select search, text search)
  const filteredLawyers = useMemo(() => {
    if (!lawyersData) return [];
    
    // If AI query is active, we bypass client-side text filtering as the backend handled relevance.
    // We still allow availability/specialty to refine further if wanted.
    return lawyersData.filter(l => {
      // Text Search
      const matchSearch = activeAiQuery ? true : (l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (l.bio && l.bio.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchSpecialty = activeSpecialties.length === 0 || 
                             l.specializations.some(s => activeSpecialties.some(active => s.toLowerCase().includes(active.toLowerCase())));

      const matchAvailability = onlyAvailable ? l.availableNow : true;

      return matchSearch && matchSpecialty && matchAvailability;
    });
  }, [lawyersData, searchQuery, activeAiQuery, activeSpecialties, onlyAvailable]);

  const toggleSpecialty = (s: string) => {
    setActiveSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleAiSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(aiDraftQuery.trim()) {
      setActiveAiQuery(aiDraftQuery);
      setSearchQuery(""); // clear regular search
      setActiveSpecialties([]); // clear filters to let AI do its thing
    }
  };

  const allSpecialties = ['Criminal', 'Corporate', 'Family', 'Constitutional', 'IP', 'Real Estate', 'Labor', 'Tax', 'Immigration'];

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#F3EEE6] py-6 sm:py-8 lg:py-10 relative overflow-hidden flex flex-col items-center">
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl px-3 sm:px-4 lg:px-6 border border-gray-200 min-h-[calc(100vh-14rem)] rounded-2xl sm:rounded-3xl bg-[#fbfbfb]/50 backdrop-blur-[2px]">
        <div className="py-6 sm:py-8 lg:py-12">
          
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] mb-2 sm:mb-4 tracking-tight">Legal Professionals Directory</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with Nepal's top legal minds. Verified credentials and trusted by community.
            </p>
          </div>

          {/* AI Matching Banner */}
          <div className="bg-[#111111] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10 text-white shadow-lg lg:shadow-xl relative overflow-hidden group mx-3">
            <div className="absolute right-0 top-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-700"></div>
            
            {!isAiMode ? (
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2 text-gray-300 font-bold text-xs sm:text-sm uppercase tracking-wider">
                    <Sparkles size={14} className="sm:size-[16] text-white" /> AI-Powered Matching
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">Want to hire with AI precision?</h2>
                  <p className="text-gray-400 max-w-lg text-xs sm:text-sm lg:text-base leading-relaxed">
                    Provide details about your case, and our AI will summarize your needs to match you with the most qualified lawyers tailored specifically to your legal situation.
                  </p>
                </div>
                <button 
                  onClick={() => setIsAiMode(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black font-bold rounded-lg sm:rounded-xl shadow-md hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap transition-transform active:scale-95 text-sm sm:text-base shrink-0"
                >
                  <Search size={16} className="sm:size-[18]" /> Find My Match
                </button>
              </div>
            ) : (
              <div className="relative z-10 w-full animate-in fade-in zoom-in-95 duration-200">
                 <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                      <Sparkles size={16} className="sm:size-[18]" /> Describe your legal situation
                    </div>
                    <button onClick={() => {setIsAiMode(false); setActiveAiQuery(""); setAiDraftQuery("");}} className="text-gray-400 hover:text-white transition-colors shrink-0">
                      <X size={18} className="sm:size-[20]" />
                    </button>
                 </div>
                 <form onSubmit={handleAiSearch} className="flex flex-col gap-2 sm:gap-3">
                    <textarea 
                      autoFocus
                      rows={3}
                      value={aiDraftQuery}
                      onChange={(e) => setAiDraftQuery(e.target.value)}
                      placeholder="e.g. My ancestors land in Pokhara is being claimed by my uncles without a will..."
                      className="w-full bg-[#222] text-white border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 focus:outline-none focus:border-white resize-none placeholder:text-gray-500 text-sm sm:text-base"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        disabled={!aiDraftQuery.trim()}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-black font-bold rounded-lg sm:rounded-xl shadow-md hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                      >
                        <Search size={16} className="sm:size-[18]" /> Analyze & Match
                      </button>
                    </div>
                 </form>
              </div>
            )}
          </div>

          {/* If Active AI Query */}
          {activeAiQuery && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mx-3">
               <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Showing AI Matches For:</p>
                  <p className="text-xs sm:text-sm text-blue-800 italic">"{activeAiQuery}"</p>
               </div>
               <button onClick={() => {setActiveAiQuery(""); setAiDraftQuery(""); setIsAiMode(false);}} className="px-3 py-1 sm:py-1.5 bg-white text-blue-900 font-semibold text-xs rounded-lg shadow-sm border border-blue-200 hover:bg-blue-50 shrink-0">
                  Clear AI Search
               </button>
            </div>
          )}

          {/* Main Content Areas */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 px-3">
            
            {/* Sidebar Filters */}
            <div className={`lg:w-80 shrink-0 space-y-4 sm:space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Filter Card */}
              <div className="bg-[#fbfbfb] rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="font-bold text-[#111111] flex items-center gap-2 text-sm sm:text-base">
                    <Filter size={16} className="sm:size-[18]" /> Filters
                  </h3>
                  <button 
                    onClick={() => {setActiveSpecialties([]); setOnlyAvailable(false);}}
                    className="text-xs text-[#111111] hover:text-black font-medium"
                  >
                    Reset All
                  </button>
                </div>

                {/* Specialties */}
                <div className="mb-4 sm:mb-6">
                  <label className="text-xs sm:text-sm font-semibold text-[#111111] mb-2 sm:mb-3 block">Specialization</label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {allSpecialties.map((s) => (
                      <FilterBadge 
                        key={s} 
                        label={s} 
                        active={activeSpecialties.includes(s)} 
                        onClick={() => toggleSpecialty(s)} 
                      />
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-2 border-t border-gray-200 pt-4 sm:pt-6">
                  <label className="text-xs sm:text-sm font-semibold text-[#111111] mb-2 sm:mb-3 block">Availability</label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${onlyAvailable ? 'bg-[#111111] border-[#111111]' : 'border-gray-300 group-hover:border-[#111111]'}`}
                    >
                      {onlyAvailable && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className="text-xs sm:text-sm text-[#111111] font-medium transition-colors">Available Now Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="flex-1 min-w-0">
               {/* Search & Sort Bar */}
               <div className="bg-[#fbfbfb] rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 lg:gap-4 shadow-sm sticky top-2 z-10">
                  <div className="relative flex-1 w-full">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 size-4 lg:size-4" />
                     <input 
                        type="text" 
                        placeholder="Search by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 sm:pl-10 sm:pr-4 py-2 sm:py-2.5 bg-[#fbfbfb] rounded-lg sm:rounded-lg border border-gray-200 focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-all text-xs sm:text-sm"
                        disabled={!!activeAiQuery}
                     />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                     <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500"
                     >
                        <SlidersHorizontal size={18} />
                     </button>
                     <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                     <div className="flex bg-[#fbfbfb] p-1 rounded-lg border border-gray-200">
                        <button 
                          onClick={() => setViewMode('Grid')}
                          className={`p-1.5 rounded-md transition-all ${viewMode === 'Grid' ? 'bg-[#111111] shadow text-white' : 'text-gray-500 hover:text-[#111111]'}`}
                        >
                           <LayoutGrid size={18} />
                        </button>
                        <button 
                          onClick={() => setViewMode('List')}
                          className={`p-1.5 rounded-md transition-all ${viewMode === 'List' ? 'bg-[#111111] shadow text-white' : 'text-gray-500 hover:text-[#111111]'}`}
                        >
                           <List size={18} />
                        </button>
                     </div>
                  </div>
               </div>

               {/* Loading State */}
               {isLoading && (
                  <div className="text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-[#111111] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading lawyers...</p>
                  </div>
               )}

               {/* Results Grid */}
               {!isLoading && filteredLawyers.length === 0 ? (
                  <div className="text-center py-20 bg-[#fbfbfb] rounded-3xl border border-dashed border-gray-300">
                     <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={32} className="text-gray-400" />
                     </div>
                     <h3 className="text-xl font-bold text-gray-600">No lawyers found</h3>
                     <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                  </div>
               ) : (
                  <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${viewMode === 'Grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                     {filteredLawyers.map((lawyer) => (
                        <div 
                           key={lawyer._id}
                           onClick={() => setSelectedLawyer(lawyer)}
                           className={`group relative bg-[#fbfbfb] rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg lg:hover:shadow-xl hover:border-gray-300 transition-all duration-300 cursor-pointer flex flex-col ${viewMode === 'List' ? 'lg:flex-row lg:items-center lg:gap-6' : ''}`}
                        >
                           {/* Header */}
                           <div className={`flex items-start justify-between mb-4 sm:mb-5 lg:mb-6 ${viewMode === 'List' ? 'lg:mb-0 lg:w-80 lg:shrink-0' : ''}`}>
                              <div className="flex items-start gap-3 sm:gap-4 flex-1">
                                 <div className="relative shrink-0">
                                    <div className="w-14 sm:w-16 lg:w-18 h-14 sm:h-16 lg:h-18 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                                       {lawyer.image ? (
                                           <img 
                                              src={lawyer.image} 
                                              alt={lawyer.name} 
                                              className="w-full h-full object-cover" 
                                           />
                                       ) : (
                                           <div className="w-full h-full flex items-center justify-center bg-gray-200 text-[#111111] font-bold text-lg sm:text-xl lg:text-2xl">
                                              {lawyer.name.charAt(0)}
                                           </div>
                                       )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 p-0.5 bg-[#fbfbfb] rounded-full`}>
                                       {lawyer.availableNow ? (
                                           <CheckCircle2 size={12} className="sm:size-[16] text-green-500 fill-white" />
                                       ) : (
                                           <div className="w-3 sm:w-4 h-3 sm:h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                                       )}
                                    </div>
                                 </div>
                                 <div className="pt-1 min-w-0">
                                    <h3 className="font-bold text-base sm:text-lg text-[#111111] group-hover:text-black transition-colors line-clamp-1 leading-tight">{lawyer.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 font-medium">Legal Professional</p>
                                 </div>
                              </div>
                           </div>

                           <div className={`space-y-3 sm:space-y-4 flex-1 flex flex-col ${viewMode === 'List' ? 'lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6' : ''}`}>
                              
                              {/* AI Reasoning (If Active) */}
                              {activeAiQuery && (lawyer as any).matchReasons && (lawyer as any).matchReasons.length > 0 && (
                                <div className="mb-1.5 sm:mb-2 w-full text-xs font-medium text-blue-800 bg-blue-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-blue-100 flex items-start gap-1">
                                  <Sparkles size={12} className="sm:size-[14] shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{(lawyer as any).matchReasons[0]}</span>
                                </div>
                              )}
                               {/* Stats Layout */}
                               <div className="flex items-center gap-0 border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden bg-white text-xs sm:text-sm">
                                  <div className="flex-1 py-2 sm:py-3 px-1.5 sm:px-2 text-center border-r border-gray-200">
                                     <div className="flex items-center justify-center gap-1 font-bold text-[#111111]">                                       <Star size={12} className="sm:size-[14] fill-yellow-400 text-yellow-400" />
                                       {lawyer.rating.toFixed(1)}
                                    </div>
                                    <div className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5 sm:mt-1">Rating</div>
                                 </div>
                                 <div className="flex-1 py-2 sm:py-3 px-1.5 sm:px-2 text-center border-r border-gray-200">
                                    <div className="font-bold text-[#111111]">{lawyer.yearsOfExperience}+</div>
                                    <div className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5 sm:mt-1">Exp.</div>
                                 </div>
                                 <div className="flex-1 py-2 sm:py-3 px-1.5 sm:px-2 text-center">
                                    <div className={`font-bold ${lawyer.availableNow ? 'text-green-600' : 'text-gray-400'}`}>
                                       {lawyer.availableNow ? 'Yes' : 'No'}
                                    </div>
                                    <div className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5 sm:mt-1">Available</div>
                                 </div>
                              </div>
                              
                              <div className="mt-auto pt-1 sm:pt-2">
                                 <div className={`flex items-end justify-end ${viewMode === 'List' ? 'lg:mt-0 lg:ml-auto' : ''}`}>
                                    {/* Updated Button to #111111 */}
                                    <button className="w-full sm:w-auto px-3 sm:px-5 py-2 sm:py-2.5 bg-[#111111] text-white text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl shadow-md lg:shadow-lg hover:shadow-lg lg:hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 sm:gap-2 group/btn">
                                       View Profile <ChevronDown size={12} className="sm:size-[14] -rotate-90 group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={3} />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Lawyer Profile Overlay --- */}
      {selectedLawyer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
             className="absolute inset-0 bg-black/40 backdrop-blur-[3px] transition-opacity" 
             onClick={() => setSelectedLawyer(null)}
          ></div>
          <div className="relative w-full sm:max-w-2xl lg:max-w-3xl bg-[#fbfbfb] h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden">
             
             {/* Header Image Background matching the new black aesthetic */}
             <div className="h-32 sm:h-40 lg:h-48 bg-[#111111] relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                <button 
                  onClick={() => setSelectedLawyer(null)}
                  className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 p-1.5 sm:p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                   <X size={20} className="sm:size-[24]" />
                </button>
             </div>

             {/* Profile Info Pull-up */}
             <div className="px-4 sm:px-6 lg:px-8 flex-1 overflow-y-auto -mt-12 sm:-mt-14 lg:-mt-16 relative z-10 pb-12 sm:pb-16 lg:pb-20">
                <div className="flex items-end justify-between mb-4 sm:mb-6">
                   <div className="relative">
                      <div className="w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden border-3 sm:border-4 border-white shadow-lg lg:shadow-xl bg-gray-100">
                         <img src={selectedLawyer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedLawyer.name)}&background=f3f4f6&color=111`} alt={selectedLawyer.name} className="w-full h-full object-cover" />
                      </div>
                      <div className={`absolute -bottom-2 -right-2 ${selectedLawyer.availableNow ? 'bg-green-500' : 'bg-gray-400'} text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-xs font-bold border-2 border-white shadow-sm flex items-center gap-1`}>
                         <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-white animate-pulse"></span> {selectedLawyer.availableNow ? 'Available Now' : 'Offline'}
                      </div>
                   </div>
                </div>

                <div className="mb-6 sm:mb-8">
                   <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-[#111111] mb-0.5 sm:mb-1 flex items-center gap-2">
                      {selectedLawyer.name}
                   </h2>
                   <p className="text-lg sm:text-xl text-gray-600 mb-1 sm:mb-2">Legal Professional</p>
                   <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                      <span className="flex items-center gap-1 text-yellow-600 font-bold"><Star size={14} className="sm:size-[16] fill-yellow-600" /> {selectedLawyer.rating.toFixed(1)} Rating</span>
                   </div>

                   {/* Tags */}
                   <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                      {(selectedLawyer.specializations || []).map(s => (
                         <span key={s} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-[#111111] rounded-full text-xs sm:text-sm font-semibold border border-gray-200">
                            {s}
                         </span>
                      ))}
                   </div>

                   {/* Bio Section */}
                   <div className="space-y-6 sm:space-y-8">
                      <section>
                         <h3 className="font-bold text-base sm:text-lg text-[#111111] mb-2 sm:mb-3 flex items-center gap-2"><User size={18} className="sm:size-[20] text-black" /> About</h3>
                         <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-white p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200">
                            {selectedLawyer.bio || "No biography provided."}
                         </p>
                      </section>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                         <section>
                            <h3 className="font-bold text-base sm:text-lg text-[#111111] mb-2 sm:mb-3 flex items-center gap-2"><Briefcase size={18} className="sm:size-[20] text-black" /> Experience</h3>
                            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                               <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs sm:text-sm text-gray-500 font-medium">Years Active</span>
                                  <span className="font-bold text-sm sm:text-base text-[#111111]">{selectedLawyer.yearsOfExperience} Years</span>
                               </div>
                            </div>
                         </section>

                         <section>
                           <h3 className="font-bold text-lg text-[#111111] mb-3 flex items-center gap-2"><Phone size={20} className="text-black" /> Contact</h3>
                           <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
                               {selectedLawyer.email && (
                                   <div className="flex items-center gap-2 text-sm text-[#111111] font-medium">
                                       <Mail size={16} className="text-gray-400" /> {selectedLawyer.email}
                                   </div>
                               )}
                               {selectedLawyer.phone && (
                                   <div className="flex items-center gap-2 text-sm text-[#111111] font-medium">
                                       <Phone size={16} className="text-gray-400" /> {selectedLawyer.phone}
                                   </div>
                               )}
                           </div>
                         </section>
                      </div>
                   </div>
                </div>
             </div>

             {/* Booking Footer */}
             <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0 flex gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button 
                  disabled={!selectedLawyer.availableNow}
                  className={`flex-1 py-4 text-white rounded-xl font-bold shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-lg ${selectedLawyer.availableNow ? 'bg-[#111111] hover:bg-black shadow-black/20' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                   {selectedLawyer.availableNow ? 'Book Consultation' : 'Currently Unavailable'}
                </button>
             </div>
          </div>
        </div>
      )}

    </main>
  );
}
