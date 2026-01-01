import React from 'react';

export default function JungleSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-wood-brown/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-jungle-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      
      <p className="text-jungle-accent text-sm font-display tracking-widest animate-pulse">
        LOADING PARTY...
      </p>
    </div>
  );
}