"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-screen grid place-items-center">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-10 p-6">
        <h1 className="text-3xl font-semibold">PPAPP</h1>

        <div
          className="grid gap-8 justify-items-center w-full"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          <Link
            href="/agenda"
            className="tap-target inline-flex flex-col items-center justify-center rounded-2xl border px-6 py-8 shadow bg-gray-50 hover:bg-gray-100 active:scale-95"
            aria-label="Open Agenda"
          >
            <span aria-hidden="true" className="leading-none text-[200px]">🗓️</span>
            <span className="mt-3 text-lg font-medium">Agenda</span>
          </Link>

          <Link
            href="/emotions"
            className="tap-target inline-flex flex-col items-center justify-center rounded-2xl border px-6 py-8 shadow bg-gray-50 hover:bg-gray-100 active:scale-95"
            aria-label="Open Emotions"
          >
            <span aria-hidden="true" className="leading-none text-[200px]">😊</span>
            <span className="mt-3 text-lg font-medium">Emotions</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
