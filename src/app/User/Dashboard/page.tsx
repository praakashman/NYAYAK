"use client";

import React from "react";
import Link from "next/link";
import { User, MessageSquare, Bookmark, FileText, ArrowRight, Shield, Bell } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function UserDashboard() {
  const { user } = useUser();

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#F3EEE6] py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-8 relative overflow-hidden flex flex-col items-center">
      {/* Main Container */}
      <div className="w-full max-w-6xl relative z-10 flex flex-col gap-6 sm:gap-7 lg:gap-8">
        
        {/* Header Section */}
        <div className="bg-[#fbfbfb] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#111111] text-white text-xs font-semibold tracking-wide mb-3 sm:mb-4 uppercase">
              <User size={12} className="sm:block" />
              <span>Citizen Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight">
              Welcome back, {user?.firstName || "User"}
            </h1>
            <p className="text-gray-500 mt-1.5 sm:mt-2 max-w-xl text-sm sm:text-base lg:text-lg">
              Access your legal queries, consult with lawyers, and manage your account details easily.
            </p>
          </div>
          
          <div className="flex gap-2 sm:gap-3 w-full lg:w-auto">
            <button className="p-2 sm:p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all text-gray-600 shrink-0">
              <Bell size={18} className="sm:block lg:block" />
            </button>
            <Link href="/lawyers" className="flex-1 lg:flex-none px-3 sm:px-5 py-2.5 sm:py-3 bg-[#111111] text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:bg-black hover:shadow-md transition-all text-center">
              Find a Lawyer
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          
          {/* My Info */}
          <div className="group bg-[#fbfbfb] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-lg lg:hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#111111] group-hover:scale-110 group-hover:bg-[#111111] group-hover:text-white transition-all duration-300">
                <User size={20} className="sm:size-[24]" />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Profile</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-2 sm:mb-3">My Info</h2>
            <p className="text-gray-500 mb-6 sm:mb-8 leading-relaxed grow text-sm sm:text-base">
              Manage your personal details, email preferences, and basic profile information.
            </p>
            <button className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-[#111111] py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium sm:font-semibold group-hover:border-[#111111] transition-all text-sm sm:text-base">
              Manage Profile
            </button>
          </div>

          {/* Legal Queries */}
          <div className="group bg-[#fbfbfb] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-lg lg:hover:shadow-xl hover:border-nyayak-orange transition-all duration-300 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-nyayak-orange/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#F9F6F0] border border-[#E5DDCB] rounded-xl sm:rounded-2xl flex items-center justify-center text-nyayak-orange group-hover:scale-110 group-hover:bg-nyayak-orange group-hover:text-white transition-all duration-300">
                <MessageSquare size={20} className="sm:size-[24]" />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI Chat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-2 sm:mb-3 relative z-10">My Queries</h2>
            <p className="text-gray-500 mb-6 sm:mb-8 leading-relaxed grow relative z-10 text-sm sm:text-base">
              View your previous AI legal chats, saved conversations, and pending questions.
            </p>
            <Link href="/chat" className="flex items-center justify-center gap-2 w-full bg-[#111111] text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium sm:font-semibold hover:bg-black transition-all transform active:scale-95 relative z-10 text-sm sm:text-base">
              Go to Chat <ArrowRight size={16} className="sm:size-[18]" />
            </Link>
          </div>

          {/* Saved Info */}
          <div className="group bg-[#fbfbfb] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-lg lg:hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-500 group-hover:scale-110 transition-all duration-300">
                <Bookmark size={20} className="sm:size-[24]" />
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Library</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-2 sm:mb-3">Saved Info</h2>
            <p className="text-gray-500 mb-6 sm:mb-8 leading-relaxed grow text-sm sm:text-base">
              Access your bookmarked lawyers, saved cases, and court details you're tracking.
            </p>
            <button className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-400 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium cursor-not-allowed border border-gray-200 text-sm sm:text-base">
              <Shield size={16} className="sm:size-[16]" /> Coming Soon
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
