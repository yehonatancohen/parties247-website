"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParties } from "../hooks/useParties";
import Link from "next/link";
import { Party } from "../data/types";

// --- Icons ---
const ChatBubblesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.03 10-9 0-4.97-4.477-9-10-9S2 8.03 2 13c0 1.25.283 2.43.791 3.504L2 22l5.05-1.977A10.02 10.02 0 0 0 12 22z" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
        <path d="M22 2 11 13" />
        <path d="m22 2-7 20-4-9-9-4Z" />
    </svg>
);

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
        <path d="M9 15h6" />
        <path d="M12 2V3" />
        <path d="M8 2V3" />
    </svg>
);

// --- Types ---
type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    cards?: Party[];
};

export default function ChatWidget() {
    const { parties } = useParties();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "היי! 👋 אני מסיבוט. איך אני יכול לעזור לך למצוא מסיבה היום? 🎉",
        },
    ]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isTyping]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            // Call the AI API
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    parties: parties
                }),
            });

            if (!res.ok) throw new Error("Network response was not ok");

            const data = await res.json();

            // Map returned IDs back to full party objects
            const suggestedParties = (data.suggested_party_ids || [])
                .map((id: string) => parties.find(p => p.id === id))
                .filter((p: Party | undefined): p is Party => !!p);

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response || "מצטער, נתקלתי בבעיה קטנה...",
                cards: suggestedParties,
            };

            setMessages((prev) => [...prev, assistantMsg]);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "אופס, משהו השתבש בחיבור... 🔌 תנסה שוב?",
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] flex flex-col items-end gap-4" dir="rtl">
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="w-[85vw] md:w-[360px] h-[550px] max-h-[75vh] md:max-h-[80vh] bg-jungle-surface/95 backdrop-blur-md rounded-2xl border border-jungle-accent/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans"
                    style={{ boxShadow: '0 0 50px rgba(118, 200, 147, 0.15)' }}
                >
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-l from-jungle-deep to-jungle-surface border-b border-white/5 flex justify-between items-center text-white shadow-md shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="p-2 bg-jungle-accent/20 rounded-full border border-jungle-accent/30 text-jungle-lime">
                                    <BotIcon />
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-jungle-deep rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-lg text-jungle-text tracking-wide">מסיבוט</h3>
                                <p className="text-[11px] text-gray-400 leading-none">עוזר המסיבות שלך 🤖</p>
                            </div>
                        </div>
                        <button onClick={toggleChat} className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white">
                            <XIcon />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-jungle-accent/20 scrollbar-track-transparent bg-gradient-to-b from-transparent to-black/20"
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col max-w-[90%] ${msg.role === "user" ? "self-end items-end" : "self-start items-start"
                                    }`}
                            >
                                <div
                                    className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === "user"
                                        ? "bg-jungle-accent text-jungle-deep font-bold rounded-tl-none border border-jungle-accent"
                                        : "bg-jungle-deep text-gray-100 rounded-tr-none border border-white/10"
                                        }`}
                                >
                                    {msg.content}
                                </div>

                                {/* Party Cards */}
                                {msg.cards && msg.cards.length > 0 && (
                                    <div className="mt-3 space-y-3 w-full pl-4">
                                        {msg.cards.map((party) => (
                                            <Link
                                                key={party.id}
                                                href={`/event/${party.slug}`}
                                                className="block group bg-jungle-deep border border-white/10 hover:border-jungle-lime/50 rounded-xl overflow-hidden transition-all hover:translate-x-1 hover:shadow-lg hover:shadow-jungle-lime/10 relative"
                                            >
                                                <div className="flex h-[88px]">
                                                    {party.imageUrl && (
                                                        <div className="w-[88px] h-full shrink-0 relative">
                                                            <img src={party.imageUrl} alt={party.name} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                                                        </div>
                                                    )}
                                                    <div className="p-3 flex-grow overflow-hidden flex flex-col justify-between">
                                                        <div>
                                                            <h4 className="font-display font-bold text-sm text-jungle-text group-hover:text-jungle-lime transition-colors line-clamp-1">
                                                                {party.name}
                                                            </h4>
                                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                                {new Date(party.date).toLocaleDateString("he-IL", { day: 'numeric', month: 'numeric' })} • {party.location.name}
                                                            </p>
                                                        </div>
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-jungle-accent border border-white/5 truncate max-w-[100px]">
                                                                {party.musicGenres}
                                                            </span>
                                                            <span className="text-[11px] text-jungle-lime font-bold group-hover:translate-x-[-2px] transition-transform">
                                                                לפרטים ←
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="self-start bg-jungle-deep px-4 py-3 rounded-2xl rounded-tr-none border border-white/5 flex items-center gap-1.5 h-[42px] min-w-[64px]">
                                <div className="w-1.5 h-1.5 bg-jungle-accent/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-jungle-accent/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-jungle-accent/70 rounded-full animate-bounce" />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-jungle-deep/80 border-t border-white/5 shrink-0 backdrop-blur-md">
                        <div className="flex gap-2 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isTyping}
                                placeholder={isTyping ? "מסיבוט מקליד..." : "שאל אותי משהו... 💬"}
                                className="flex-grow bg-jungle-surface/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-jungle-accent/50 focus:ring-1 focus:ring-jungle-accent/50 transition-all placeholder:text-gray-500/80 text-right disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="p-3 bg-jungle-accent hover:bg-jungle-lime text-jungle-deep font-bold rounded-xl transition-all disabled:opacity-30 disabled:grayscale hover:shadow-lg hover:shadow-jungle-accent/20"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-jungle-deep to-jungle-surface border border-jungle-accent/30 rounded-full shadow-lg shadow-black/40 hover:shadow-jungle-lime/20 hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="text-jungle-accent group-hover:text-jungle-lime transition-colors transform group-hover:scale-110 duration-300">
                        <ChatBubblesIcon />
                    </div>
                </button>
            )}
        </div>
    );
}
