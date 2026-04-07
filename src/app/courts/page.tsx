"use client";
import React, { useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  Building2, MapPin, Phone, Mail, Globe, Gavel, Scale, 
  Crosshair, Loader2, Search, Navigation2, CheckCircle2, X, Navigation
} from 'lucide-react';
import { courtsData, Court } from './courtData';
import { KDTree, getEscalationPath } from './graphAlgorithms';

const MapComponent = dynamic(() => import('./CourtMap'), { 
  ssr: false, 
  loading: () => (
    <div className="h-full w-full bg-[#fbfbfb] flex flex-col items-center justify-center text-gray-400 rounded-2xl border border-gray-200">
       <Loader2 className="animate-spin mb-2" size={24} /> 
       <span className="text-sm font-medium">Loading Interactive Map...</span>
    </div>
  ) 
});

export default function CourtsPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [escalationPath, setEscalationPath] = useState<Court[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);

  const kdTree = useMemo(() => new KDTree(courtsData), []);
  const allCourtTypes = ["All", "Supreme Court", "High Court", "District Court", "Special Court"];
  
  const filteredCourts = useMemo(() => {
    return courtsData.filter(court => {
      const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            court.location.toLowerCase().includes(searchQuery.toLowerCase());
      const courtTypeNormalized = court.type.includes("High Court") ? "High Court" : court.type;
      const matchesType = activeType === "All" || !activeType || courtTypeNormalized === activeType || court.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, activeType]);

  const handleFindNearest = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
           setUserLocation([position.coords.latitude, position.coords.longitude]);
           const nearest = kdTree.nearestNeighbor([position.coords.latitude, position.coords.longitude]);
           if (nearest) handleCourtSelect(nearest);
           setIsLocating(false);
        },
        () => { alert("Location access denied."); setIsLocating(false); }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
    setEscalationPath([]); 
  };

  const handleShowEscalationPath = () => {
    if (selectedCourt) {
      setEscalationPath(getEscalationPath(selectedCourt.name));
    }
  };

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#F3EEE6] py-10 relative overflow-hidden flex flex-col items-center">
      
      {/* Main Container - Exact Match to Lawyers UI Container */}
      <div className="relative z-10 w-full max-w-7xl px-6 border border-gray-200 min-h-[calc(100vh-14rem)] md:rounded-3xl bg-[#fbfbfb]/50 backdrop-blur-[2px] flex flex-col">
        
        <div className="py-12 flex flex-col h-full">
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-[#111111] mb-4 tracking-tight">Jurisdictional Directory</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore local courts, navigate appellate structures, and map legal jurisdictions interactively.
              </p>
            </div>

            {/* Interactive Location Banner - Matching AI Banner style */}
            <div className="bg-[#111111] rounded-2xl p-6 md:p-8 mb-10 text-white shadow-xl relative overflow-hidden group shrink-0">
               <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-700"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                   <div className="flex items-center gap-2 mb-2 text-gray-300 font-bold text-sm uppercase tracking-wider">
                     <MapPin size={16} className="text-white" /> Geospatial Routing
                   </div>
                   <h2 className="text-2xl font-bold mb-2">Find your nearest Jurisdiction</h2>
                   <p className="text-gray-400 max-w-lg">
                     Use your device's location to automatically find the closest District court using KD-Tree algorithms.
                   </p>
                 </div>
                 <button 
                   onClick={handleFindNearest}
                   disabled={isLocating}
                   className="px-6 py-3 bg-white text-black font-bold rounded-xl shadow-md hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                   {isLocating ? <Loader2 className="animate-spin" size={18} /> : <Crosshair size={18} />}
                   {isLocating ? 'Locating...' : 'Find Nearest Court'}
                 </button>
               </div>
            </div>

            {/* Application Split View */}
            <div className="flex flex-col lg:flex-row gap-8 w-full">
                
                {/* Left Side: Directory Scroll */}
                <div className="w-full lg:w-100 h-125 lg:h-175 flex flex-col bg-[#fbfbfb] border border-gray-200 rounded-2xl shadow-sm overflow-hidden shrink-0">
                    <div className="p-5 border-b border-gray-200 bg-white">
                       <div className="relative mb-4">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                             type="text" 
                             placeholder="Search court names..." 
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                             className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-all text-sm font-medium"
                          />
                       </div>
                       <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                          {allCourtTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setActiveType(activeType === type ? "All" : type)}
                              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-xs font-semibold border ${
                                (activeType === type) || (type === "All" && !activeType) || (type === "All" && activeType === "All")
                                ? 'bg-[#111111] text-white border-[#111111]' 
                                : 'bg-white text-[#111111] border-gray-200 hover:border-black'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {filteredCourts.length === 0 ? (
                          <div className="text-center py-12 text-gray-400">
                             <Building2 className="mx-auto mb-3 opacity-50" size={32}/>
                             <p className="text-sm">No courts match your search.</p>
                          </div>
                        ) : (
                          filteredCourts.map(court => (
                             <div 
                               key={court.name}
                               onClick={() => handleCourtSelect(court)}
                               className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#111111] transition-all cursor-pointer group"
                             >
                                <div className="flex justify-between items-start mb-2">
                                   <span className="px-2 py-1 bg-[#F5F1ED] text-[#111111] text-[10px] font-bold rounded uppercase tracking-wider border border-[#E8E1D9]">
                                     {court.type}
                                   </span>
                                   {court.type === "Supreme Court" && <Scale size={16} className="text-gray-300"/>}
                                </div>
                                <h3 className="font-bold text-[#111111] leading-tight mb-2 group-hover:text-black">
                                   {court.name}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                   <MapPin size={14} className="shrink-0 text-black"/>
                                   <span className="truncate">{court.location}</span>
                                </div>
                             </div>
                          ))
                        )}
                    </div>
                </div>

                {/* Right Side: Interactive Map */}
                <div className="flex-1 h-125 lg:h-175 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 relative z-0">
                   <MapComponent 
                     userLocation={userLocation} 
                     escalationPath={escalationPath} 
                     onCourtSelect={handleCourtSelect} 
                   />
                </div>
            </div>

        </div>
      </div>

      {/* --- Court Details Overlay (Matches Lawyer Profile Overlay EXACTLY) --- */}
      {selectedCourt && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
             className="absolute inset-0 bg-black/40 backdrop-blur-[3px] transition-opacity" 
             onClick={() => setSelectedCourt(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-[#fbfbfb] h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden">
             
             {/* Header Image Background */}
             <div className="h-40 bg-[#111111] relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                <button 
                  onClick={() => setSelectedCourt(null)}
                  className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                   <X size={24} />
                </button>
             </div>

             {/* Details Info Pull-up */}
             <div className="px-8 flex-1 overflow-y-auto -mt-16 relative z-10 pb-20">
                <div className="flex items-end justify-between mb-6">
                   <div className="relative">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center text-[#111111]">
                          <Building2 size={48} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold border-2 border-white shadow-sm">
                         {selectedCourt.type}
                      </div>
                   </div>
                </div>

                <div className="mb-8">
                   <h2 className="text-3xl font-bold text-[#111111] mb-2 flex items-center gap-2">
                      {selectedCourt.name}
                   </h2>
                   <div className="flex items-center gap-2 text-lg text-gray-600 mb-6">
                      <MapPin size={20} className="text-black" /> {selectedCourt.location}
                   </div>

                   <div className="space-y-8">
                      {/* Description */}
                      <section>
                         <h3 className="font-bold text-lg text-[#111111] mb-3 flex items-center gap-2"><Globe size={20} className="text-black" /> About Jurisdiction</h3>
                         <p className="text-gray-700 leading-relaxed bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            {selectedCourt.description}
                         </p>
                      </section>

                      {/* Contact Info (Side-by-Side like Experience/Contact) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <section>
                           <h3 className="font-bold text-lg text-[#111111] mb-3 flex items-center gap-2"><Phone size={20} className="text-black" /> Connect</h3>
                           <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                               {selectedCourt.phones.map((phone, i) => (
                                 <div key={i} className="flex items-center gap-3 text-sm text-[#111111] font-medium">
                                   <Phone size={18} className="text-gray-400" /> {phone}
                                 </div>
                               ))}
                               <div className="flex items-center gap-3 text-sm text-[#111111] font-medium">
                                 <Mail size={18} className="text-gray-400" /> 
                                 <a href={`mailto:${selectedCourt.email}`} className="hover:underline">{selectedCourt.email}</a>
                               </div>
                           </div>
                         </section>
                         
                         <section>
                           <h3 className="font-bold text-lg text-[#111111] mb-3 flex items-center gap-2"><Navigation2 size={20} className="text-black" /> Website</h3>
                           <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                              <a href={selectedCourt.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm text-blue-600 font-bold hover:underline py-2">
                                <Globe size={18} /> Official Portal
                              </a>
                           </div>
                         </section>
                      </div>

                      {/* Appellate Tracing Data */}
                      <div className="mt-8 border-t border-gray-200 pt-8">
                         <div className="bg-red-50 rounded-2xl p-6 border border-red-100 relative overflow-hidden group">
                           <div className="absolute right-0 top-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-10 -mt-10 transition-colors"></div>
                           <h3 className="text-lg font-bold text-[#111111] mb-2 flex items-center gap-2 relative z-10">
                              <Navigation size={20} className="text-red-600" /> Appeals Pipeline
                           </h3>
                           <p className="text-sm text-gray-600 mb-5 relative z-10 leading-relaxed">
                              Visually trace the DAG appeal path if a case gets escalated from this jurisdiction directly onto the map.
                           </p>
                           <button 
                             onClick={handleShowEscalationPath}
                             className="w-full py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
                           >
                             "What if I lose here?"
                           </button>

                           {/* Render active path inside modal */}
                           {escalationPath.length > 0 && (
                             <div className="mt-6 pt-6 border-t border-red-200/50 space-y-4 relative z-10 bg-white p-5 rounded-xl">
                               <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Escalation Trajectory:</p>
                               <div className="relative before:absolute before:inset-y-2 before:left-2.75 before:w-0.5 before:bg-gray-200">
                                   {escalationPath.map((c, i) => (
                                     <div key={c.name} className="flex gap-4 relative z-10 mb-4 last:mb-0">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${i === escalationPath.length - 1 ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                          {i === escalationPath.length - 1 ? <CheckCircle2 size={12}/> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300"/>}
                                       </div>
                                       <div className="pt-0.5">
                                         <div className={`text-sm font-bold leading-none mb-1.5 ${i === escalationPath.length - 1 ? 'text-[#111111]' : 'text-gray-600'}`}>{c.name}</div>
                                         <div className="text-[10px] text-gray-500 uppercase font-semibold">{c.type}</div>
                                       </div>
                                     </div>
                                   ))}
                               </div>
                             </div>
                           )}
                         </div>
                      </div>

                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </main>
  );
}
