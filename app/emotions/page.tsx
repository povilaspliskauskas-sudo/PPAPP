"use client";
import { useState } from "react";
import Link from "next/link";

const EMOJIS = [
  { key: "happy", icon: "😊" },
  { key: "calm", icon: "😌" },
  { key: "excited", icon: "🤩" },
  { key: "neutral", icon: "😐" },
  { key: "sad", icon: "😢" },
  { key: "angry", icon: "😠" },
  { key: "tired", icon: "🥱" },
];

export default function EmotionsPage() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 text-center">
      <Link
        href="/"
        aria-label="Home"
        className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
      >
        <span aria-hidden="true" className="leading-none text-[80px]">🏠</span>
      </Link>

      <h1 className="text-2xl font-semibold">How do you feel?</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {EMOJIS.map(e => (
          <button
            key={e.key}
            type="button"
            aria-pressed={last === e.key}
            onClick={() => setLast(e.key)}
            className={`tap-target flex flex-col items-center justify-center rounded-2xl border px-6 py-4 shadow active:scale-95 ${
              last === e.key ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
            }`}
          >
            <span className="leading-none text-[200px]" aria-hidden="true">{e.icon}</span>
            <span className="mt-2 text-lg font-medium capitalize">{e.key}</span>
          </button>
        ))}
      </div>

      {last && <div className="text-sm text-gray-600">Selected: {last}</div>}
    </main>
  );
}
