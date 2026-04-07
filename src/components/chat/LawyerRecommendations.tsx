"use client";
import React from 'react';
import { Star, CheckCircle, Briefcase, Zap } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface LawyerRecommendationsProps {
  specialty?: string;
  query?: string;
}

import Link from 'next/link';

export default function LawyerRecommendations({ specialty, query }: LawyerRecommendationsProps) {
  // If specialty is provided, fetch lawyers. Otherwise, skip query.
  // We can fetch but render differently or as "disabled"
  const listLawyers = useQuery(api.lawyers.list, (specialty && !query) ? { specialization: specialty } : "skip");
  
  // Use the new recommend query if we have the user query text
  const recommendedLawyers = useQuery(api.lawyers.recommend, query ? { query } : "skip");
  
  const lawyers = (query ? recommendedLawyers : listLawyers) || [];

  // Determine what to render
  const showList = !!query || !!specialty;
  const showLoading = ((query && recommendedLawyers === undefined) || (specialty && !query && listLawyers === undefined));
  const showEmpty = showList && !showLoading && lawyers.length === 0;
  const showComingSoon = !query && !specialty;

  return (
    <div className="h-full flex flex-col bg-[#fbfbfb]/50 border-l border-gray-200/50">
      <div className="p-4 border-b border-gray-200/50">
        <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
          Recommended Lawyers
        </h2>
        <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 mt-0.5">
              {specialty ? `AI Matches for ${specialty}` : 'AI-curated experts for your case'}
            </p>
        </div>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        {showComingSoon && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#fbfbfb]/50 rounded-xl border border-dashed border-gray-200 m-2 opacity-75">
                <div className="w-12 h-12 bg-[#fbfbfb] rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Zap size={20} className="text-blue-500 fill-blue-500" />
                </div>
                <h3 className="text-sm font-bold text-[#111111] mb-1">AI Matching</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                   Ask a question, and our AI will pair you with the best related legal experts.
                </p>
            </div>
        )}

        {showLoading && (
           <div className="p-8 text-center flex flex-col items-center justify-center space-y-3 text-gray-500 text-sm">
             <Zap size={24} className="animate-pulse text-blue-500" />
             <p>Finding the right experts for your case...</p>
           </div>
        )}

        {showEmpty && (
            <div className="p-8 text-center text-gray-500 text-sm">
              <p>No lawyers found matching your exact case details.</p>
              <Link href="/lawyers" className="text-blue-600 hover:underline mt-2 inline-block">Browse all lawyers</Link>
            </div>
        )}

        {showList && lawyers.slice(0, 5).map((lawyer: any) => (
            <Link href={`/lawyers#${lawyer._id}`} key={lawyer._id}>
                <div className="p-3 rounded-xl border border-gray-200 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                      {lawyer.image ? (
                        <img src={lawyer.image} alt={lawyer.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">{lawyer.name.charAt(0)}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{lawyer.name}</h4>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-medium">{lawyer.rating ? lawyer.rating.toFixed(1) : "New"}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-blue-600 flex items-center gap-1 mt-0.5 truncate">
                        <Briefcase size={10} />
                        {lawyer.specializations[0]} {lawyer.specializations.length > 1 && `+${lawyer.specializations.length - 1}`}
                      </p>
                      
                      {lawyer.matchReasons && lawyer.matchReasons.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-[10px] text-gray-500 italic leading-snug">
                            " {lawyer.matchReasons[0]} "
                          </p>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        {lawyer.availableNow && (
                          <span className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Available
                          </span>
                        )}
                        {lawyer.relevanceScore && (
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium ml-auto">
                            <Zap size={10} /> Match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            </Link>
        ))}
      </div>
    </div>
  );
}
