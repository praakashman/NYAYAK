"use client";
import Link from "next/link";
import Image from "next/image";
import { Scale } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#fbfbfb] pt-4 sm:pt-8 pb-4 px-4 sm:px-6 text-black border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
                
                {/* Quote and Newsletter Section */}
                <div className="hidden sm:flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4 mb-4 sm:mb-8">
                    <div className="max-w-2xl text-left">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[#111111] mb-1 sm:mb-2">
                            Ready To <span className="font-bold">Pull The Trigger?</span><br className="hidden sm:block" />
                            <span className="text-gray-500 sm:ml-1 md:ml-0">
                                Get A Quote Today.
                            </span>
                        </h2>
                    </div>
                    <div className="w-full md:w-auto mt-2 md:mt-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-medium tracking-tight text-[#111111] mb-2 sm:mb-3">
                            Get Our News And Updates
                        </h3>
                        <form className="flex flex-col sm:flex-row gap-2">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="w-full sm:w-64 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-transparent border border-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all placeholder:text-gray-500 text-black text-xs sm:text-sm"
                            />
                            <button 
                                type="button" 
                                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#2A2925] text-white text-xs sm:text-sm font-medium hover:bg-black transition-all shrink-0"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Top grid section */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="col-span-3 md:col-span-1 border-b border-gray-100 pb-2 md:border-0 md:pb-0">
                        <div className="flex items-center gap-2 mb-2 sm:mb-4">
                            <Image src="/logo.png" alt="Nyayak Logo" width={110} height={33} className="object-contain h-6 sm:h-8 w-auto" />
                        </div>
                        <div className="flex flex-row md:flex-col gap-4 md:gap-0">
                            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-1 sm:mb-3">
                                Kathmandu, Nepal
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-black">
                                <a href="tel:+977123456789" className="hover:text-gray-600 transition-colors">
                                    +977 123 456 789
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-4 text-[#111111]">Platform</h4>
                        <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-gray-600">
                            <li><Link href="/" className="hover:text-black transition-colors">Home</Link></li>
                            <li><Link href="/chat" className="hover:text-black transition-colors">AI Assistant</Link></li>
                            <li><Link href="/about" className="hover:text-black transition-colors">About</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-4 text-[#111111]">Citizens</h4>
                        <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-gray-600">
                            <li><Link href="/chat" className="hover:text-black transition-colors">Legal Chat</Link></li>
                            <li><Link href="/lawyers" className="hover:text-black transition-colors">Find Lawyer</Link></li>
                            <li><Link href="/faq" className="hover:text-black transition-colors">How it works</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-4 text-[#111111]">Lawyers</h4>
                        <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-gray-600">
                            <li><Link href="/cases" className="hover:text-black transition-colors">Find Cases</Link></li>
                            <li><Link href="/lawyer/dashboard" className="hover:text-black transition-colors">Dashboard</Link></li>
                            <li><Link href="/signup" className="hover:text-black transition-colors">Join Us</Link></li>
                        </ul>
                    </div>

                    <div className="hidden sm:block">
                        <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-4 text-[#111111]">Community</h4>
                        <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-gray-600">
                            <li><Link href="/forum" className="hover:text-black transition-colors">Public Forum</Link></li>
                            <li><Link href="/courts" className="hover:text-black transition-colors">Court Information</Link></li>
                            <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-gray-200 mb-2 sm:mb-4"></div>

                {/* Middle info section */}
                <div className="hidden sm:block w-full mb-2 sm:mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Nyayak is an AI-powered legal platform that simplifies Nepal's complex justice system. It connects citizens with justice and verified legal professionals securely and instantly.
                    </p>
                </div>

                {/* Bottom strip */}
                <div className="flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs text-gray-500 pt-3 sm:pt-4 border-t border-gray-200">
                    <p>Copyright © {new Date().getFullYear()} Nyayak. MIT License.</p>
                    <div className="flex gap-4 sm:gap-6 mt-3 sm:mt-4 md:mt-0">
                        <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gray-700 transition-colors flex items-center gap-1 font-medium text-black">
                            Back to Top ↑
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
