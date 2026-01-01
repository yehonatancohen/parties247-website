"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

interface PartySearchInputProps {
  defaultValue?: string;
  className?: string;
  placeholder?: string;
}

export default function PartySearchInput({
  defaultValue = "",
  className = "",
  placeholder = "חפש מסיבה..."
}: PartySearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [text, setText] = useState(defaultValue);

  const handleSearch = (term: string) => {
    setText(term);

    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={className}>
      <input
        type="text"
        value={text}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}