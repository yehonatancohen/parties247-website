import JungleSpinner from "./ui/JungleSpinner";

export default function LoadingJungle() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 py-14 flex flex-col gap-8">
        <div className="flex items-center gap-4 text-jungle-text/80">
          <JungleSpinner />
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-wide">טוען את המסיבות החמות...</p>
            <p className="text-xs text-jungle-text/60">מכין לכם את הג׳ונגל עם כל ההטבות הכי טובות</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-hidden>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-36 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
