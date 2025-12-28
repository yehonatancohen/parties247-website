import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white">
      <LoadingSpinner />
      <p className="text-jungle-text/80">טוען את המסיבות הקרובות...</p>
    </div>
  );
}
