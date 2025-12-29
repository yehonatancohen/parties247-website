import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="h-10 w-48 rounded-full bg-white/10 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="h-28 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
