"use client";

import React from "react";
import Link from "next/link";
import { User, Gavel, Calendar, FileText, Settings, Bell, Briefcase } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function LawyerDashboard() {
  const { user } = useUser();
  const stats = useQuery(api.lawyers.getMyStats);
  const defaultStats = { activeCases: 0, pendingConsults: 0, profileViews: 0, documents: 0 };
  const displayStats = stats || defaultStats;

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#F3EEE6] py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-8 relative overflow-hidden flex flex-col items-center">
      <div className="w-full max-w-6xl relative z-10 flex flex-col gap-6 sm:gap-7 lg:gap-8">
        
        <div className="bg-[#111111] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 shadow-lg lg:shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-semibold tracking-wide mb-2 sm:mb-4 uppercase">
              <Gavel size={12} className="sm:block" />
              <span>Attorney Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Welcome Counsel, {user?.firstName || ""}
            </h1>
            <p className="text-gray-400 mt-1.5 sm:mt-2 max-w-xl text-sm sm:text-base lg:text-lg">
              Manage your practice, update your profile, and track your consultations all in one place.
            </p>
          </div>
          
          <div className="flex gap-2 sm:gap-3 w-full lg:w-auto relative z-10">
            <button className="p-2 sm:p-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all text-white shrink-0">
               <Bell size={18} className="sm:block lg:block" />
            </button>
            <Link href="/Lawyer/profile" className="flex-1 lg:flex-none px-3 sm:px-5 py-2.5 sm:py-3 bg-nyayak-orange text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:bg-[#A88256] transition-all flex items-center justify-center lg:justify-start gap-2">
              <Settings size={16} className="sm:size-[18]" /> <span className="hidden sm:inline">Edit Profile</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
          {[
            { label: "Active Cases", value: displayStats.activeCases.toString(), icon: Briefcase },
            { label: "Pending Consults", value: displayStats.pendingConsults.toString(), icon: Calendar },
            { label: "Profile Views", value: displayStats.profileViews.toString(), icon: User },
            { label: "Documents", value: displayStats.documents.toString(), icon: FileText },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg sm:rounded-2xl p-3 sm:p-5 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              <stat.icon size={18} className="sm:size-[24] text-nyayak-orange mb-1.5 sm:mb-2" />
              <span className="text-lg sm:text-2xl font-bold text-[#111111]">{stat.value}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 leading-tight sm:leading-normal">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          
          <div className="group bg-[#fbfbfb] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-lg lg:hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#111111] group-hover:scale-110 group-hover:bg-[#111111] group-hover:text-white transition-all duration-300">
                <Calendar size={20} className="sm:size-[24]" />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Schedule</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-2 sm:mb-3">Consultations</h2>
            <p className="text-gray-500 mb-6 sm:mb-8 leading-relaxed grow text-sm sm:text-base">
              View upcoming appointments, manage your calendar availability, and review session history.
            </p>
            <button className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-400 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium cursor-not-allowed border border-gray-200 text-sm sm:text-base">
              Coming Soon
            </button>
          </div>

          <div className="group bg-[#fbfbfb] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-lg lg:hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#111111] group-hover:scale-110 group-hover:bg-[#111111] group-hover:text-white transition-all duration-300">
                <Gavel size={20} className="sm:size-[24]" />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Practice</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-2 sm:mb-3">My Cases</h2>
            <p className="text-gray-500 mb-6 sm:mb-8 leading-relaxed grow text-sm sm:text-base">
              Track and manage your active legal cases, client documents, and upcoming court dates.
            </p>
            <button className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-400 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium cursor-not-allowed border border-gray-200 text-sm sm:text-base">
              Coming Soon
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
