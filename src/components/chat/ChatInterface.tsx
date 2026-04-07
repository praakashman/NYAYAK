"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Bot, User, Clock, ShieldQuestion, FileText, Scale } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface ChatProps {
  activeSessionId: Id<"chat_sessions"> | null;
  onSessionCreated: (id: Id<"chat_sessions">) => void;
  onAnalysisComplete?: (field: string) => void;
}

function ChatContent({ activeSessionId, onSessionCreated, onAnalysisComplete }: ChatProps) {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  // Convex mutations & queries
  const messages = useQuery(api.chats.getMessages, activeSessionId ? { sessionId: activeSessionId } : "skip") || [];
  const createSession = useMutation(api.chats.createSession);
  const addMessage = useMutation(api.chats.addMessage);

  const [localMessages, setLocalMessages] = useState<Array<{id: string, text: string, sender: "user" | "assistant", timestamp?: string}>>([]);

  // Sync convex messages to local display logic
  useEffect(() => {
    if (activeSessionId && messages.length > 0) {
      setLocalMessages(messages.map(m => ({
        id: m._id,
        text: m.text,
        sender: m.sender as "user" | "assistant",
        timestamp: new Date(m._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));
    } else if (!activeSessionId) {
      setLocalMessages([]);
    }
  }, [activeSessionId, JSON.stringify(messages)]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    let currentSessionId = activeSessionId;

    // Create session if it doesn't exist
    if (!currentSessionId) {
      const title = text.length > 30 ? text.substring(0, 30) + "..." : text;
      currentSessionId = await createSession({ title });
      onSessionCreated(currentSessionId);
    }

    // Add user message optimistically to local and then to DB
    const tempId = Date.now().toString();
    setLocalMessages(prev => [...prev, {
      id: tempId,
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setLoading(true);

    try {
      // Save user message to DB
      await addMessage({
        sessionId: currentSessionId,
        text,
        sender: "user",
      });

      const response = await fetch("/api/ask-legal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (data.field && onAnalysisComplete) {
        onAnalysisComplete(data.field);
      }

      // Save assistant message to DB
      await addMessage({
        sessionId: currentSessionId,
        text: data.answer,
        sender: "assistant",
      });

    } catch (error) {
       await addMessage({
        sessionId: currentSessionId,
        text: `Error: ${error instanceof Error ? error.message : "Failed to process query"}`,
        sender: "assistant",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, loading]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !initialLoadDone.current && !activeSessionId) {
        initialLoadDone.current = true;
        setTimeout(() => sendMessage(q), 500);
        window.history.replaceState({}, '', '/chat');
    }
  }, [searchParams, activeSessionId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#fbfbfb] relative rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      
      {/* Header */}
      <div className="bg-[#fbfbfb] border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-nyayak-mute flex items-center justify-center text-gray-500">
                <Bot size={24} />
            </div>
            <div>
                <h2 className="font-bold text-[#111111] text-lg">Nyayak AI</h2>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-[#111111] font-medium">Online</span>
                </div>
            </div>
        </div>
      </div>

      {/* Messages Area / Welcome Screen */}
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-4 md:p-6 bg-[#fbfbfb]/30 scroll-smooth ${!activeSessionId && localMessages.length === 0 ? 'flex items-center justify-center p-8' : 'space-y-6'}`}
      >
        {!activeSessionId && localMessages.length === 0 ? (
          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center space-y-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <Bot size={40} className="text-[#111111]" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">How can I assist you today?</h1>
              <p className="text-gray-500 text-lg max-w-md mx-auto">Get instant insights on Nepali law, legal processes, and find the right guidance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
              <button onClick={() => sendMessage("What are the grounds for divorce in Nepal?")} className="flex flex-col text-left p-4 rounded-2xl bg-white border border-gray-200 hover:border-[#111111] hover:shadow-md transition-all group">
                <ShieldQuestion className="text-gray-400 group-hover:text-[#111111] mb-2" size={20} />
                <span className="text-sm font-medium text-[#111111]">Divorce Grounds</span>
                <span className="text-xs text-gray-500">Learn about legal separation</span>
              </button>
              <button onClick={() => sendMessage("How do I register a company in Nepal?")} className="flex flex-col text-left p-4 rounded-2xl bg-white border border-gray-200 hover:border-[#111111] hover:shadow-md transition-all group">
                <FileText className="text-gray-400 group-hover:text-[#111111] mb-2" size={20} />
                <span className="text-sm font-medium text-[#111111]">Company Registration</span>
                <span className="text-xs text-gray-500">Business setup steps</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {localMessages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                 <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${message.sender === "user" ? "bg-[#111111] text-white" : "bg-nyayak-mute text-gray-500"}`}>
                    {message.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                 </div>

                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${message.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                            message.sender === "user"
                            ? "bg-[#111111] text-white rounded-tr-none"
                            : "bg-white text-[#111111] border border-gray-200 rounded-tl-none"
                        }`}
                    >
                        <div className={`prose prose-sm max-w-none prose-p:my-0 prose-headings:mb-2 prose-headings:mt-1 prose-ul:my-1 prose-strong:text-current ${message.sender === "user" ? "text-white **:text-white" : ""}`}>
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                    </div>
                    {message.timestamp && (
                      <span className="text-[10px] text-gray-500 mt-1.5 px-1 flex items-center gap-1">
                          {message.timestamp}
                      </span>
                    )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-nyayak-mute shrink-0 flex items-center justify-center text-gray-500">
                    <Bot size={16} />
                 </div>
                 <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-nyayak-slate animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-nyayak-slate animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-nyayak-slate animate-bounce" style={{ animationDelay: '300ms' }}></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-2 sm:p-3 lg:p-4 bg-[#fbfbfb] border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-1.5 sm:gap-2 items-end bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-nyayak-slate focus-within:border-nyayak-slate transition-all shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about Nepali Law..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[#111111] placeholder:text-gray-400 px-2 sm:px-3 py-2 sm:py-2.5 max-h-32 text-xs sm:text-sm outline-none"
            disabled={loading}
          />
          
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 sm:p-3 bg-[#111111] text-white rounded-lg sm:rounded-xl hover:bg-black disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-sm transform active:scale-95 shrink-0 flex items-center justify-center min-h-11 min-w-11 lg:min-h-auto lg:min-w-auto"
          >
            <Send size={16} className={`sm:size-4 ${loading ? 'opacity-0' : 'opacity-100'}`} />
            {loading && <div className="absolute inset-0 flex items-center justify-center"><Clock size={14} className="sm:size-4 animate-spin" /></div>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChatInterface(props: ChatProps) {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center">Loading chat...</div>}>
      <ChatContent {...props} />
    </Suspense>
  );
}
