"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface AllPartiesAISearchProps {
    defaultQuery?: string;
}

export default function AllPartiesAISearch({ defaultQuery = '' }: AllPartiesAISearchProps) {
    const router = useRouter();
    const [query, setQuery] = useState(defaultQuery);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const suggestions = [
        { text: 'טכנו הלילה', keyword: 'מסיבות טכנו הלילה' },
        { text: 'על החוף', keyword: 'מסיבות על החוף' },
        { text: 'סוף שבוע', keyword: 'מסיבות סוף שבוע' },
        { text: 'תל אביב', keyword: 'מסיבות בתל אביב' },
    ];

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);

        try {
            // Fetch all parties using the service
            const parties = await getParties();

            // A direct name/location match should win outright — don't let the AI
            // second-guess an exact or partial name the user actually typed.
            const lowered = searchQuery.trim().toLowerCase();
            const directMatches = parties.filter((p: any) =>
                p.name?.toLowerCase().includes(lowered) ||
                p.location?.name?.toLowerCase().includes(lowered)
            );

            if (directMatches.length > 0) {
                router.push(`/all-parties?query=${encodeURIComponent(searchQuery)}`, { scroll: false });
                return;
            }

            // No direct match — fall back to AI for natural-language queries
            // (e.g. "מסיבות טכנו הלילה").
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

            if (suggestedPartyIds.length > 0) {
                router.push(`/all-parties?query=${encodeURIComponent(searchQuery)}&ai_filter=${suggestedPartyIds.join(',')}`, { scroll: false });
            } else {
                router.push(`/all-parties?query=${encodeURIComponent(searchQuery)}`, { scroll: false });
            }

        } catch (error) {
            console.error('Search error:', error);
            // On error, just do a regular search
            router.push(`/all-parties?query=${encodeURIComponent(searchQuery)}`, { scroll: false });
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
        <div className="mx-auto w-full max-w-[680px] space-y-4">
            {/* Main Search Box */}
            <div className="relative group z-10">

                {/* Search Box */}
                <form onSubmit={handleSubmit} className="relative">
                    <div className={`relative flex items-center overflow-hidden rounded-full bg-tile transition-shadow duration-300 ${isFocused ? 'shadow-[0_0_0_2px_#76c893]' : 'shadow-[0_0_0_1px_rgba(196,255,218,0.11)]'}`}>

                        <div className="pointer-events-none absolute right-4 flex items-center text-ink-3 sm:right-5">
                            <SparklesIcon />
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
                            aria-label="חיפוש מסיבות"
                            className="flex-1 bg-transparent py-3.5 pl-3 pr-11 text-[16px] text-ink placeholder:text-ink-3 focus:outline-none disabled:opacity-50 sm:py-4 sm:pr-12 sm:text-[17px]"
                            dir="rtl"
                        />

                        {/* Search Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            aria-label="חיפוש"
                            className="m-1.5 flex flex-shrink-0 items-center gap-2 rounded-full bg-action px-4 py-2 font-semibold text-on-action transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:py-2.5"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-on-action border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <SearchIcon />
                            )}
                            <span className="hidden sm:inline">{isLoading ? 'מחפש...' : 'חיפוש'}</span>
                        </button>
                    </div>
                </form>

                <p className="mt-2 text-center text-[12px] text-ink-3">
                    אפשר לכתוב בשפה חופשית, החיפוש החכם יבין
                </p>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.keyword)}
                        disabled={isLoading}
                        className="rounded-full border border-hairline px-4 py-2 text-[14px] text-ink transition-colors hover:border-white/25 hover:bg-tile disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {suggestion.text}
                    </button>
                ))}
            </div>
        </div>
    );
}
