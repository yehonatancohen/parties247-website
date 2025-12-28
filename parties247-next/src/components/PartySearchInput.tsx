"use client";

import { SearchIcon } from "./Icons";

interface PartySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PartySearchInput({ value, onChange, placeholder }: PartySearchInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <SearchIcon className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder || "חיפוש מסיבה (לפי שם, מקום...)"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-jungle-surface border border-wood-brown text-white text-sm rounded-lg focus:ring-jungle-lime focus:border-jungle-lime block w-full p-3.5 pr-12"
      />
    </div>
  );
}
