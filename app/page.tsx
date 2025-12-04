"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-6 p-6">
        <span aria-hidden="true" className="text-[96px] leading-none">🏠</span>
        <h1 className="text-2xl font-semibold">PPAPP</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/agenda" className="rounded-2xl border px-4 py-3 shadow">Agenda</Link>
          <Link href="/emotions" className="rounded-2xl border px-4 py-3 shadow">Emotions</Link>
        </div>
      </div>
    </main>
  );
}
