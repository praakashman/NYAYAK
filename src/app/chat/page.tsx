"use client";
import { useState } from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import WaveBackground from "@/components/chat/WaveBackground";
import LawyerRecommendations from "@/components/chat/LawyerRecommendations";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Edit, Trash2, MessageSquare, Plus } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const [recommendedField, setRecommendedField] = useState<string>("");
  const [activeSessionId, setActiveSessionId] = useState<Id<"chat_sessions"> | null>(null);

  const role = user?.unsafeMetadata?.role as string;
  const isLawyer = role === 'lawyer';

  // Fetch chat sessions
  const sessions = useQuery(api.chats.getSessions) || [];
  const deleteSession = useMutation(api.chats.deleteSession);

  if (!isLoaded) return null;

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#F3EEE6] py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-6 flex items-center justify-center relative overflow-hidden">
      <WaveBackground />
      <div className="w-full max-w-350 h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] min-h-100 sm:min-h-120 lg:min-h-150 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 relative z-10">
        
        {/* Sidebar: Chat History */}
        <div className="hidden lg:flex flex-col col-span-3 shadow-lg rounded-3xl overflow-hidden bg-[#fbfbfb] border border-gray-200 p-4 lg:p-5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3 lg:pb-4 lg:mb-4">
            <h3 className="font-bold text-[#111111] text-sm lg:text-lg">Chat History <span className="text-gray-400 text-xs lg:text-sm font-normal">({sessions.length < 10 ? `0${sessions.length}` : sessions.length})</span></h3>
            <div className="flex gap-2">
              <button onClick={() => setActiveSessionId(null)} className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#111111] hover:text-white transition-colors">
                <Plus size={14} className="lg:hidden" />
                <Plus size={16} className="hidden lg:block" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 sm:space-y-2 lg:space-y-2 pr-1 custom-scrollbar">
            {sessions.map(session => (
              <div 
                key={session._id} 
                onClick={() => setActiveSessionId(session._id)}
                className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all group relative border text-xs sm:text-sm ${activeSessionId === session._id ? 'border-nyayak-orange bg-[#F9F6F0]' : 'border-transparent hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-0.5 lg:mb-1">
                  <h4 className="font-semibold text-xs sm:text-sm text-[#111111] truncate pr-3 lg:pr-4">{session.title}</h4>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <MessageSquare size={10} className="lg:hidden" />
                  <MessageSquare size={12} className="hidden lg:block" />
                  <span>Nepali Law</span>
                </div>

                {/* Hover actions */}
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteSession({ sessionId: session._id }); if (activeSessionId === session._id) setActiveSessionId(null); }} 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} className="lg:hidden" />
                    <Trash2 size={14} className="hidden lg:block" />
                  </button>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center text-gray-500 text-xs mt-6 lg:mt-10">No past conversations.</div>
            )}
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className={`h-full flex flex-col shadow-lg rounded-2xl sm:rounded-3xl overflow-hidden bg-[#fbfbfb] border border-gray-200 ${isLawyer ? 'lg:col-span-9' : 'lg:col-span-6'}`}>
          <ChatInterface 
            activeSessionId={activeSessionId}
            onSessionCreated={setActiveSessionId}
            onAnalysisComplete={(field) => setRecommendedField(field)} 
          />
        </div>

        {/* Recommendations Column (Users only) */}
        {!isLawyer && (
        <div className="hidden lg:flex flex-col h-full col-span-3 overflow-hidden rounded-3xl shadow-lg border border-gray-200 bg-[#fbfbfb]">
          <LawyerRecommendations specialty={recommendedField} />
        </div>
        )}

      </div>
    </main>
  );
}
