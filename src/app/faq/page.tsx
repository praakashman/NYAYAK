"use client";
import React, { useState } from 'react';
import { Mail, MessageCircle, ChevronDown, Plus, Minus } from 'lucide-react';
import Footer from '@/components/Footer';

const faqs = [
    { q: "What is this platform and what problem does it solve?", a: "It explains complex legal language in simple terms and connects citizens with lawyers who fit their case. It makes law easier to understand and helps users find the right legal help without confusion." },
    { q: "How does the AI chatbot work?", a: "The chatbot uses RAG (Retrieval-Augmented Generation) to pull relevant legal text from the constitution and generate clear, citation-backed answers to your questions." },
    { q: "Is this legal information binding advice?", a: "No. AI responses are for general guidance to help you understand your situation. Real legal advice and representation must come from qualified lawyers." },
    { q: "How are lawyers matched to my case?", a: "Lawyers are suggested based on your legal topic and case details using a recommendation system so you see professionals specialized in the area you need." },
    { q: "Do I have to pay to use it?", a: "Basic AI answers are free. Fees apply when you choose to contact or hire a lawyer or unlock premium features." }
];

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#F3EFE7] font-sans text-nyayak-dark selection:bg-nyayak-orange selection:text-white">
      {/* Decorative thin line */}
      <svg className="fixed left-0 top-1/4 w-1/2 h-1/2 text-[#E8E2D4] pointer-events-none z-0 opacity-50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C50,150 150,50 200,100" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      
      {/* Giant background text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] sm:text-[15vw] font-black text-[#E8E2D4] opacity-50 whitespace-nowrap pointer-events-none select-none z-0">
          F A Q
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-16">
          
          {/* Left Column: Heading & Contact CTA */}
          <div className="lg:col-span-5 mb-8 sm:mb-12 lg:mb-0 relative">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[64px] font-bold text-[#2A2925] leading-[1.05] tracking-tight mb-4 sm:mb-6 lg:mb-8">
              Got questions? <br />
              <span className="text-[#64615A]">We&apos;ve got <br /> answers.</span>
            </h1>
            <p className="text-[#5A5751] text-sm sm:text-base lg:text-lg max-w-md mb-6 sm:mb-8 lg:mb-10 leading-relaxed font-medium">
              Everything you need to know about navigating the platform, AI accuracy, and contacting lawyers. 
              Still stuck? <a href="mailto:support@nyayak.com" className="text-[#2A2925] font-bold hover:text-[#5A5751] decoration-2 underline-offset-4 hover:underline transition-all">Chat to our team.</a>
            </p>
            
            {/* Contact Info Box */}
            <div className="mt-8 sm:mt-10 lg:mt-12 bg-[#EAE5D9]/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-4xl border border-[#D5CFC1] shadow-sm relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 sm:w-32 h-24 sm:h-32 bg-[#E5DDCB] rounded-full opacity-50 blur-2xl pointer-events-none"></div>
                <h3 className="text-lg sm:text-xl font-bold text-[#2A2925] mb-4 sm:mb-6 tracking-tight relative z-10">Get in touch</h3>
                <div className="space-y-4 sm:space-y-6 relative z-10">
                    <div className="flex items-start gap-3 sm:gap-4 group cursor-pointer">
                        <div className="w-9 sm:w-10 h-9 sm:h-10 bg-[#34362F] rounded-full flex items-center justify-center text-[#E5DDCB] shadow-sm transform group-hover:scale-105 transition-transform shrink-0">
                            <Mail size={16} className="sm:size-[18]" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-[#2A2925] text-sm sm:text-base">Email us</p>
                            <p className="text-xs sm:text-sm text-[#5A5751] mt-0.5 sm:mt-1 font-medium break-all">support@nyayak.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4 group cursor-pointer">
                        <div className="w-9 sm:w-10 h-9 sm:h-10 bg-transparent border border-[#D3CEBE] rounded-full flex items-center justify-center text-[#7A7568] group-hover:bg-[#D5CFC1]/50 transition-colors shrink-0">
                            <MessageCircle size={16} className="sm:size-[18]" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-[#2A2925] text-sm sm:text-base">Live Chat</p>
                            <p className="text-xs sm:text-sm text-[#5A5751] mt-0.5 sm:mt-1 font-medium">Mon-Fri, 9am-5pm NPT</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Column: FAQ Items */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {faqs.map((faq, idx) => (
                <div 
                    key={idx} 
                    className={`bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all duration-500 overflow-hidden border ${
                        openFaq === idx 
                        ? 'border-[#2A2925] shadow-[0_20px_50px_rgba(0,0,0,0.05)]' 
                        : 'border-[#D5CFC1] hover:border-[#8E8A80] shadow-sm'
                    }`}
                >
                    <button 
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full flex items-start sm:items-center justify-between p-3 sm:p-5 lg:p-8 text-left focus:outline-none gap-3 sm:gap-4"
                    >
                        <span className={`font-semibold text-sm sm:text-base lg:text-xl transition-colors duration-300 ${openFaq === idx ? 'text-[#2A2925]' : 'text-[#4A4843]'}`}>
                            {faq.q}
                        </span>
                        <div className={`w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ${
                            openFaq === idx 
                            ? 'bg-[#2A2925] text-[#F3EFE7] rotate-180' 
                            : 'bg-[#F3EFE7] text-[#2A2925] border border-[#D5CFC1]'
                        }`}>
                            {openFaq === idx ? <ChevronDown size={16} className="sm:size-[20]" /> : <Plus size={16} className="sm:size-[20]" />}
                        </div>
                    </button>
                    <div 
                        className={`px-3 sm:px-5 lg:px-8 overflow-hidden transition-all duration-500 ease-in-out ${
                            openFaq === idx ? 'max-h-125 mb-4 sm:mb-6 lg:mb-8 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <p className="text-[#5A5751] leading-relaxed text-xs sm:text-sm lg:text-base font-medium pr-4 sm:pr-6 lg:pr-10">
                            {faq.a}
                        </p>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
