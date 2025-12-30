import LoadingSpinner from "@/components/LoadingSpinner";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col gap-6">
        <div className="flex items-center gap-3 text-jungle-text/80">
          <LoadingSpinner />
          <span className="text-sm">טוען את המסיבות החמות...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-32 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
