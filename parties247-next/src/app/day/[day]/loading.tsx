export default function DayLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded-full bg-white/10" />
      <div className="h-4 w-80 rounded-full bg-white/10" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-48 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10"
          >
            <div className="h-full w-full rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_30%)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
