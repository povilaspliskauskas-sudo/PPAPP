"use client";
import { useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

const EMOJIS = [
  { key: "happy",   icon: "😊" },
  { key: "calm",    icon: "😌" },
  { key: "excited", icon: "🤩" },
  { key: "neutral", icon: "😐" },
  { key: "sad",     icon: "😢" },
  { key: "angry",   icon: "😠" },
  { key: "tired",   icon: "🥱" },
];

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [last, setLast] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        {/* Top row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <span aria-hidden="true" className="leading-none text-[120px]">🏠</span>
            <span className="sr-only">Home</span>
          </Link>

          <label className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 shadow">
            <span className="text-sm">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded border px-2 py-1"
            />
          </label>

          <div className="rounded-xl border px-3 py-2 shadow">
            <ChildSwitcher value={child?.id} onChange={setChild} />
          </div>
        </div>

        {/* Emoji grid */}
        <div
          className="grid gap-3 justify-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
        >
          {EMOJIS.map((e) => {
            const selected = last === e.key;
            return (
              <button
                key={e.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setLast(e.key)}
                className={`tap-target inline-flex flex-col items-center justify-center rounded-2xl border px-4 py-4 shadow active:scale-95 ${
                  selected ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                }`}
              >
                <div className="text-[120px] leading-none" aria-hidden="true">{e.icon}</div>
                <div className="mt-2 text-base font-medium">{e.key}</div>
              </button>
            );
          })}
        </div>

        {last && (
          <div className="mt-4 text-sm text-gray-600">Selected: {last}</div>
        )}
      </div>
    </main>
  );
}
