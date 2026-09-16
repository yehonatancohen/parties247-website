import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="font-apple flex min-h-[70vh] flex-col items-center justify-center bg-stage px-4 py-20 text-center text-ink">
      <h1 className="text-[40px] font-bold leading-tight sm:text-[64px]">העמוד לא נמצא</h1>
      <p className="mt-4 max-w-[480px] text-[17px] text-ink-2 sm:text-[19px]">
        ייתכן שהקישור שגוי או שהאירוע כבר הסתיים.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
        <Link href="/all-parties" className="rounded-full bg-action px-6 py-3 text-[17px] font-medium text-on-action transition-colors hover:bg-action-hover">
          למסיבות הקרובות
        </Link>
        <Link href="/" className="text-[17px] text-link hover:underline underline-offset-4">
          לעמוד הבית
        </Link>
      </div>
    </main>
  );
}
