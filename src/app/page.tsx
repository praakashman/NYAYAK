
"use client";
import Link from "next/link";
import { ChevronDown, ArrowRight, Scale, Shield, Users, ArrowUpRight, Instagram, Facebook, Twitter } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";


export default function Home() {
  const { user } = useUser();
  const role = (user?.unsafeMetadata?.role as string) || "user";

  return (
    <main className="font-sans text-nyayak-dark selection:bg-nyayak-orange selection:text-white bg-[#F3EFE7]">
            {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-[#F3EFE7] px-3 sm:px-6 lg:px-16 flex items-center overflow-hidden">
        
        {/* Giant background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] sm:text-[12vw] lg:text-[15vw] font-black text-[#E8E2D4] opacity-50 whitespace-nowrap pointer-events-none select-none z-0">
          N Y A Y A K
        </div>

        {/* Decorative thin line */}
        <svg className="absolute hidden sm:block right-0 top-1/4 w-1/3 h-1/2 text-[#E8E2D4] pointer-events-none z-0" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C50,150 150,50 200,100" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center pt-8 sm:pt-16 pb-8 sm:pb-12">
          
          {/* Left Content */}
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-4xl sm:text-5xl lg:text-[76px] font-bold text-[#2A2925] leading-[1.05] tracking-tight mb-6 sm:mb-8 relative z-10">
              Legal <span className="text-[#64615A]">clarity</span> <br />
              made instant. <br />
              Justice <br />
              accessible.
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-[#5A5751] max-w-md mb-8 sm:mb-10 leading-relaxed font-medium">
              Navigate Nepal's legal landscape with confidence. Get instant AI guidance directly from the Constitution and connect with top verified lawyers in one unified platform.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-24">
              <Link href="/chat" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#2A2925] hover:bg-[#1A1915] text-[#F3EFE7] rounded-full font-semibold transition-all shadow-lg text-center">
                Ask Nyayak AI
              </Link>
              {role === 'lawyer' ? (
                <Link href="/cases" className="text-[#2A2925] font-bold hover:text-[#5A5751] decoration-2 underline-offset-4 hover:underline transition-all text-center">
                  Pending Cases
                </Link>
              ) : (
                <Link href="/lawyers" className="text-[#2A2925] font-bold hover:text-[#5A5751] decoration-2 underline-offset-4 hover:underline transition-all text-center">
                  Find a Lawyer
                </Link>
              )}
            </div>

            {/* Social Pills - Hidden on Mobile */}
            <div className="hidden sm:flex gap-2 sm:gap-4 items-center justify-center sm:justify-start">
              <span className="sr-only">Social links</span>
              <div className="flex gap-1.5 sm:gap-2 lg:gap-3 bg-[#EAE5D9]/60 p-1.5 sm:p-2 rounded-full backdrop-blur-sm">
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-[#34362F] rounded-full flex items-center justify-center text-[#E5DDCB] hover:scale-105 transition-transform shadow-sm">
                  <Instagram size={18} strokeWidth={2} />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-transparent rounded-full border border-[#D3CEBE] flex items-center justify-center text-[#7A7568] hover:bg-[#D5CFC1]/50 transition-colors">
                  <Facebook size={18} strokeWidth={2} />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-transparent rounded-full border border-[#D3CEBE] flex items-center justify-center text-[#7A7568] hover:bg-[#D5CFC1]/50 transition-colors">
                  <Twitter size={18} strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="relative h-100 sm:h-150 lg:h-200 w-full flex items-center justify-center lg:justify-end mt-8 sm:mt-12 lg:mt-0">
            {/* Soft Shape Backdrop */}
            <div className="absolute right-2 sm:right-4 lg:right-12 top-1/2 -translate-y-1/2 w-[90%] sm:w-[85%] lg:w-100 h-[75%] sm:h-[80%] bg-[#E5DDCB] rounded-[30px] sm:rounded-[40px] z-0"></div>
            
            {/* The Statue Image */}
            <div className="absolute inset-0 z-10 flex items-center justify-center lg:justify-end pointer-events-none">
              <img 
                src="/justice_lady.svg" 
                alt="Justice Statue" 
                className="h-[115%] w-auto object-contain object-bottom -translate-y-12 lg:-translate-y-16 pointer-events-auto filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>

            {/* Floating Top Right Card - Hidden on Mobile */}
            <div className="hidden sm:block absolute top-4 lg:top-12 right-0 lg:-right-12 max-w-60 sm:max-w-70 text-right z-20 px-2 sm:px-0">
              <p className="text-[#4A4843] text-xs sm:text-sm lg:text-base leading-relaxed tracking-wide font-medium">
                Powered by a <span className="font-bold text-[#2A2925]">Constitution-Centric RAG</span> system, bridging the gap between <span className="font-bold text-[#2A2925]">citizens & justice</span> in Nepal.
              </p>
            </div>

            {/* Floating Tags Bottom Right */}
            <div className="absolute bottom-6 sm:bottom-12 lg:bottom-32 right-0 lg:-right-8 flex flex-col gap-2 sm:gap-3 items-end z-20 px-2 sm:px-0">
              
              <div className="flex items-center gap-2 hover:-translate-x-2 transition-transform cursor-pointer">
                <div className="bg-[#2A2925] text-[#F3EFE7] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-lg tracking-wide whitespace-nowrap">
                  Family law
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D5CFC1] bg-[#F3EFE7]/80 backdrop-blur-sm flex items-center justify-center text-[#2A2925] font-light text-lg shadow-sm shrink-0">
                  +
                </div>
              </div>

              <div className="flex items-center gap-2 hover:-translate-x-2 transition-transform cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#2A2925] text-[#F3EFE7] flex items-center justify-center font-light text-lg shadow-lg shrink-0">
                  +
                </div>
                <div className="bg-[#F3EFE7]/80 backdrop-blur-sm text-[#7A7568] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-sm border border-[#D5CFC1] tracking-wide whitespace-nowrap">
                  Criminal law
                </div>
              </div>

              <div className="flex items-center gap-2 hover:-translate-x-2 transition-transform cursor-pointer">
                <div className="bg-[#F3EFE7]/80 backdrop-blur-sm text-[#7A7568] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-sm border border-[#D5CFC1] tracking-wide whitespace-nowrap">
                  Divorce solicitors
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D5CFC1] bg-[#F3EFE7]/80 backdrop-blur-sm flex items-center justify-center text-[#2A2925] font-light text-lg shadow-sm shrink-0">
                  +
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
