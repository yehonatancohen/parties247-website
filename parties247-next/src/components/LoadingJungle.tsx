import JungleSpinner from "./ui/JungleSpinner";

export default function LoadingJungle() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-4">
        <JungleSpinner />
        <p className="text-sm font-semibold tracking-wide text-jungle-text/80">
          טוען את המסיבות החמות
        </p>
      </div>
    </div>
  );
}
