"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 p-6 text-center">
      <h1 className="text-3xl font-bold">PPAPP</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-center">
        <Link
          href="/agenda"
          className="tap-target flex flex-col items-center justify-center rounded-2xl border p-6 shadow hover:scale-[1.02] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          aria-label="Open Agenda"
        >
          <span aria-hidden="true" className="leading-none text-[200px]">📝</span>
          <span className="mt-2 text-xl font-semibold">Agenda</span>
        </Link>

        <Link
          href="/emotions"
          className="tap-target flex flex-col items-center justify-center rounded-2xl border p-6 shadow hover:scale-[1.02] active:scale-95 focus-visible:outline focus-visible:outline-emerald-500"
          aria-label="Open Emotions"
        >
          <span aria-hidden="true" className="leading-none text-[200px]">😊</span>
          <span className="mt-2 text-xl font-semibold">Emotions</span>
        </Link>
      </div>
    </main>
  );
}
