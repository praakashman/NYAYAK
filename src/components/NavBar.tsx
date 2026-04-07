"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Briefcase, Users, Star, Scale, MessageSquare, BookOpen, Search, Home, Gavel, Landmark, SearchCheck, HelpCircle, Phone, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";

export default function NavBar() {
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { user } = useUser();
    
    // Determine role. If there's no metadata, assume user.
    const role = (user?.unsafeMetadata?.role as string) || "user";

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsCompanyOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsCompanyOpen(false);
        }, 150);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-[#fbfbfb]/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-22 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center shrink-0">
                    <Image src="/logo.png" alt="Nyayak Logo" width={200} height={60} className="object-contain h-14 w-auto sm:h-16" priority />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex flex-1 justify-center items-center gap-8 text-[14px] font-medium text-[#111111]">
                    
                    {/* Common link: Home */}
                    <Link href="/" className="hover:text-nyayak-orange transition-colors flex items-center gap-2">
                        <Home size={18} /> Home
                    </Link>

                    {/* Common link: Legal Chat */}
                    <Link href="/chat" className="hover:text-nyayak-orange transition-colors flex items-center gap-2">
                        <MessageSquare size={18} /> Legal Chat
                    </Link>

                    {/* Conditional Role-specific links ONLY shown when SignedIn */}
                    <SignedIn>
                        {role === 'lawyer' ? (
                            <Link href="/cases" className="hover:text-nyayak-orange transition-colors flex items-center gap-2">
                                <Briefcase size={18} /> Pending Cases
                            </Link>
                        ) : (
                            <Link href="/lawyers" className="hover:text-nyayak-orange transition-colors flex items-center gap-2">
                                <SearchCheck size={18} /> Find Lawyers
                            </Link>
                        )}
                    </SignedIn>
                    
                    {/* Common link: Courts */}
                    <Link href="/courts" className="hover:text-nyayak-orange transition-colors flex items-center gap-2">
                        <Landmark size={18} /> Courts
                    </Link>

                    {/* Common link: Forum */}
                    <Link href="/forum" className="hover:text-nyayak-orange transition-colors flex items-center gap-2">
                        <Users size={18} /> Forum
                    </Link>

                    {/* Dropdown Menu Item */}
                    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <button className="hover:opacity-60 transition-opacity flex items-center gap-1 py-6 outline-none focus:outline-none">                                                                                                                                                                     
                            QuickLinks <ChevronDown size={14} className={`mt-0.5 transition-transform duration-200 ${isCompanyOpen ? 'rotate-180' : ''}`}/>                                                                                                                                                   
                        </button>
                        
                        {/* Dropdown Card */}
                        {isCompanyOpen && (
                            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[340px] bg-[#fbfbfb] border border-gray-100 shadow-[0_16px_40px_rgba(0,0,0,0.06)] rounded-3xl p-3 flex flex-col pt-4 pb-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">                                           
                                <Link onClick={() => setIsCompanyOpen(false)} href="/faq" className="flex items-start gap-4 px-4 py-3 hover:bg-[#f6f6f6] rounded-2xl transition-colors">                                                                                                                                  
                                    <HelpCircle className="text-black shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <div className="font-medium text-[15px] text-black mb-0.5">FAQ</div>
                                        <div className="text-[13px] text-gray-500 font-normal leading-relaxed">Learn how the AI system works</div>                                                                                                                                                                        
                                    </div>
                                </Link>
                                <Link onClick={() => setIsCompanyOpen(false)} href="/contact" className="flex items-start gap-4 px-4 py-3 hover:bg-[#f6f6f6] rounded-2xl transition-colors">                                                                                                                                  
                                    <Phone className="text-black shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <div className="font-medium text-[15px] text-black mb-0.5">Contact Us</div>
                                        <div className="text-[13px] text-gray-500 font-normal leading-relaxed">Get in touch with our team</div>                                                                                                                                                                        
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Right Side / Auth */}
                <div className="flex md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-4 lg:gap-6">
                    <SignedOut>
                        <Link href="/signin" className="h-10 px-6 flex items-center justify-center bg-[#2A2925] text-[#F3EFE7] text-[14px] font-semibold rounded-full hover:-translate-y-0.5 hover:shadow-md transition-all">
                            Get Started
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex items-center gap-3 lg:gap-4">
                            <Link href={role === 'lawyer' ? "/Lawyer/Dashboard" : "/User/Dashboard"} className="h-10 px-5 lg:px-6 flex items-center justify-center border border-gray-200 bg-[#fbfbfb] text-[#111111] text-[13px] lg:text-[14px] font-semibold rounded-full hover:-translate-y-0.5 hover:shadow-sm transition-all whitespace-nowrap">
                                Dashboard
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#fbfbfb] border-t border-gray-200 py-4 px-4 space-y-2">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-[#111111] font-medium">
                        <Home size={18} /> Home
                    </Link>
                    <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-[#111111] font-medium">
                        <MessageSquare size={18} /> Legal Chat
                    </Link>
                    <SignedIn>
                        {role === 'lawyer' && (
                            <Link href="/cases" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-[#111111] font-medium">
                                <Briefcase size={18} /> Pending Cases
                            </Link>
                        )}
                        {role !== 'lawyer' && (
                            <Link href="/lawyers" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-[#111111] font-medium">
                                <SearchCheck size={18} /> Find Lawyers
                            </Link>
                        )}
                    </SignedIn>
                    <Link href="/courts" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-[#111111] font-medium">
                        <Landmark size={18} /> Courts
                    </Link>
                    <Link href="/forum" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-[#111111] font-medium">
                        <Users size={18} /> Forum
                    </Link>
                    <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-[#111111] font-medium">
                        <HelpCircle size={18} /> FAQ
                    </Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-[#111111] font-medium">
                        <Phone size={18} /> Contact
                    </Link>
                    <SignedOut>
                        <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center w-full mt-4 h-10 px-6 bg-[#2A2925] text-[#F3EFE7] text-[14px] font-semibold rounded-full">
                            Get Started
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 mt-4 pt-4">
                            <span className="text-[#111111] font-medium text-sm">{user?.firstName}</span>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>
                </div>
            )}
        </header>
    );
}
