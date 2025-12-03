"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold">PPAPP</h1>
      <div className="flex gap-4">
        <Link href="/agenda" className="rounded-2xl border px-6 py-4 text-lg shadow active:scale-95">📅 Agenda</Link>
        <Link href="/emotions" className="rounded-2xl border px-6 py-4 text-lg shadow active:scale-95">😊 Emotions</Link>
      </div>
    </main>
  );
}
