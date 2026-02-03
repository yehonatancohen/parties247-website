"use client";

import React, { useState } from 'react';
import { getParties } from '@/services/api';

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

interface HeroAISearchProps {
    onSearchResults?: (parties: any[], query: string) => void;
}

export default function HeroAISearch({ onSearchResults }: HeroAISearchProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const suggestions = [
        { icon: '🎵', text: 'טכנו הלילה', keyword: 'מסיבות טכנו הלילה' },
        { icon: '🌊', text: 'על החוף', keyword: 'מסיבות על החוף' },
        { icon: '🎉', text: 'סוף שבוע', keyword: 'מסיבות סוף שבוע' },
        { icon: '🏙️', text: 'תל אביב', keyword: 'מסיבות בתל אביב' },
    ];

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);

        try {
            // Fetch all parties using the service (ensure we get fully mapped objects)
            const parties = await getParties();

            // Call the chat API with the search query
            const chatRes = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: searchQuery,
                    parties: parties
                })
            });

            if (!chatRes.ok) {
                throw new Error('Chat API failed');
            }

            const chatData = await chatRes.json();
            const suggestedPartyIds = chatData.suggested_party_ids || [];

            // Filter the local parties list to get the full objects
            const resultParties = parties.filter((p: any) =>
                suggestedPartyIds.includes(p.id) || suggestedPartyIds.includes(p._id)
            );

            // Pass full results back to parent component
            if (onSearchResults) {
                onSearchResults(resultParties, searchQuery);
            }

        } catch (error) {
            console.error('Search error:', error);
            // Show error to user
            if (onSearchResults) {
                onSearchResults([], searchQuery);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(query);
    };

    const handleSuggestionClick = (keyword: string) => {
        setQuery(keyword);
        handleSearch(keyword);
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Main Search Box */}
            <div
                className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''
                    }`}
            >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-jungle-accent via-jungle-lime to-jungle-accent rounded-2xl opacity-40 blur-xl group-hover:opacity-60 transition-opacity" />

                {/* Search Box */}
                <form onSubmit={handleSubmit} className="relative">
                    <div className="relative flex items-center bg-jungle-surface/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-2 border-jungle-accent/50 hover:border-jungle-accent/80 transition-all">

                        {/* AI Badge */}
                        <div className="absolute right-2 sm:right-4 flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-jungle-accent to-jungle-lime rounded-full shadow-lg pointer-events-none z-10">
                            <SparklesIcon />
                            <span className="text-[10px] sm:text-xs font-bold text-jungle-deep uppercase tracking-wider">AI</span>
                        </div>

                        {/* Input */}
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="למשל: מסיבות טכנו בתל אביב..."
                            disabled={isLoading}
                            className="flex-1 pl-4 pr-16 sm:pr-24 py-3 sm:py-5 text-base sm:text-lg text-white placeholder-jungle-text/60 bg-transparent focus:outline-none disabled:opacity-50"
                            dir="rtl"
                        />

                        {/* Search Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="m-1 sm:m-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-jungle-accent to-jungle-lime text-jungle-deep rounded-lg sm:rounded-xl font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-jungle-glow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-jungle-deep border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <SearchIcon />
                            )}
                            <span className="hidden sm:inline">{isLoading ? 'מחפש...' : 'חיפוש'}</span>
                        </button>
                    </div>
                </form>

                {/* AI Helper Text */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 sm:px-4 sm:py-1 bg-jungle-deep/90 backdrop-blur-sm rounded-full text-[10px] sm:text-xs text-jungle-accent whitespace-nowrap border border-jungle-accent/30 shadow-sm">
                    💡 חיפוש חכם מופעל ע״י AI
                </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mt-6 sm:mt-8">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.keyword)}
                        disabled={isLoading}
                        className="group relative px-3 py-2 sm:px-4 sm:py-2.5 bg-jungle-deep/60 backdrop-blur-md border border-jungle-accent/30 rounded-full text-jungle-text hover:bg-jungle-deep hover:border-jungle-accent transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-base sm:text-lg">{suggestion.icon}</span>
                            <span className="text-xs sm:text-sm font-medium">{suggestion.text}</span>
                        </span>
                        {/* Hover glow */}
                        <div className="absolute inset-0 rounded-full bg-jungle-accent/10 opacity-0 group-hover:opacity-100 blur transition-opacity -z-10" />
                    </button>
                ))}
            </div>
        </div>
    );
}
