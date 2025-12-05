"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

const EMOJIS = [
  { key: "happy",   icon: "😊" },
  { key: "calm",    icon: "😌" },
  { key: "excited", icon: "🤩" },
  { key: "neutral", icon: "😐" },
  { key: "sad",     icon: "😢" },
  { key: "angry",   icon: "😠" },
  { key: "tired",   icon: "��" },
];

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [last, setLast] = useState<string | null>(null);

  // load/save last selection per child/date
  useEffect(() => {
    if (!child?.id) return;
    const k = `emotion:${child.id}:${date}`;
    const v = localStorage.getItem(k);
    setLast(v || null);
  }, [child?.id, date]);

  function choose(emotion: string) {
    if (!child?.id) return;
    const k = `emotion:${child.id}:${date}`;
    localStorage.setItem(k, emotion);
    setLast(emotion);
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto px-4 text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            aria-label="Home"
            className="tap-target inline-flex items-center justify-center rounded-2xl border p-3 shadow active:scale-95"
          >
            <span aria-hidden className="leading-none text-[96px]">🏠</span>
            <span className="sr-only">Home</span>
          </Link>

          <div className="inline-flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border px-3 py-2 shadow"
            />
          </div>
        </div>

        <div className="mb-4">
          <ChildSwitcher value={child?.id} onChange={setChild as any} />
        </div>

        <div
          className="grid gap-4 justify-items-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
        >
          {EMOJIS.map((e) => {
            const isOn = last === e.key;
            return (
              <button
                key={e.key}
                type="button"
                aria-pressed={isOn}
                onClick={() => choose(e.key)}
                className={`tap-target w-full max-w-[260px] rounded-2xl border px-6 py-6 shadow active:scale-95
                            ${isOn ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-white"}`}
              >
                <div className="text-[96px]" aria-hidden="true">{e.icon}</div>
                <div className="mt-2 text-sm">{e.key}</div>
              </button>
            );
          })}
        </div>

        {last && (
          <div className="mt-4 text-sm text-gray-600">
            Selected: <span className="font-medium">{last}</span>
          </div>
        )}
      </div>
    </main>
  );
}
