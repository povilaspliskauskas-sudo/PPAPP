"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1200px] mx-auto text-center">
        <h1 className="sr-only">PPAPP Home</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 justify-items-center gap-[240px]">
          <Link
            href="/agenda"
            aria-label="Open Agenda"
            className="tap-target w-[240px] h-[240px] rounded-2xl border shadow active:scale-95
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500
                       flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center">
              <span aria-hidden="true" className="text-[120px] leading-none">📋</span>
              <span className="mt-3 text-2xl font-semibold">Agenda</span>
            </div>
          </Link>

          <Link
            href="/emotions"
            aria-label="Open Emotions"
            className="tap-target w-[240px] h-[240px] rounded-2xl border shadow active:scale-95
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500
                       flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center">
              <span aria-hidden="true" className="text-[120px] leading-none">😊</span>
              <span className="mt-3 text-2xl font-semibold">Emotions</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
