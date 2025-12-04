"use client";

import { useEffect, useState } from "react";
import BackHome from "../components/BackHome";
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
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [last, setLast] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    setLast(null);
    setNote("");
  }, [child?.id, date]);

  async function saveEmotion(emotion: string) {
    setLast(emotion);
    // API call intentionally omitted here; UI first.
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
        <BackHome />

        <h1 className="text-2xl font-semibold mb-4">Emotions</h1>

        <div className="mb-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <ChildSwitcher value={child?.id} onChange={(c) => setChild(c)} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border px-3 py-2 shadow"
            aria-label="Select date"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 place-items-center">
          {EMOJIS.map((e) => {
            const active = last === e.key;
            return (
              <button
                key={e.key}
                type="button"
                aria-pressed={active}
                onClick={() => saveEmotion(e.key)}
                className={`tap-target flex flex-col items-center justify-center rounded-2xl border px-4 py-6 shadow active:scale-95 ${
                  active ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                }`}
                aria-label={e.key}
              >
                <span aria-hidden="true" className="leading-none text-[160px]">{e.icon}</span>
                <span className="mt-2 text-base font-medium capitalize">{e.key}</span>
              </button>
            );
          })}
        </div>

        {last && (
          <div className="mt-6 text-sm text-gray-600">Selected: {last}</div>
        )}

        <div className="mt-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-xl border px-3 py-2 shadow"
            placeholder="Optional note…"
            aria-label="Optional note"
          />
        </div>
      </div>
    </main>
  );
}
