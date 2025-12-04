"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full">
      <h1 className="text-center text-2xl font-semibold mb-6">PPAPP</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
        <Link
          href="/agenda"
          className="tap-target flex flex-col items-center justify-center rounded-2xl border px-4 py-6 shadow active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          aria-label="Open Agenda"
        >
          <span aria-hidden="true" className="leading-none text-[200px]">🗓️</span>
          <span className="mt-2 text-lg font-medium">Agenda</span>
        </Link>

        <Link
          href="/emotions"
          className="tap-target flex flex-col items-center justify-center rounded-2xl border px-4 py-6 shadow active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          aria-label="Open Emotions"
        >
          <span aria-hidden="true" className="leading-none text-[200px]">😊</span>
          <span className="mt-2 text-lg font-medium">Emotions</span>
        </Link>
      </div>
    </main>
  );
}
