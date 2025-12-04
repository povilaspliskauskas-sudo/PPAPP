"use client";
import { useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

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
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [last, setLast] = useState<string | null>(null);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        <Link
          href="/"
          aria-label="Home"
          className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          <span aria-hidden="true" className="leading-none text-[80px]">🏠</span>
        </Link>

        <h1 className="mt-4 text-3xl font-bold">How do you feel?</h1>

        <div className="mt-6 flex flex-col items-center gap-4">
          <ChildSwitcher onChange={setChild} />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="rounded-xl border px-3 py-2 shadow text-center"
            aria-label="Select date"
          />
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center">
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

        {last && <div className="mt-4 text-sm text-gray-600">Selected: {last}</div>}
      </div>
    </main>
  );
}
