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
  }, [child, date]);

  const choose = (key: string) => setLast(prev => (prev === key ? null : key));

  return (
    <main className="w-full flex flex-col items-center text-center gap-6">
      <BackHome />
      <h1 className="text-3xl font-semibold">Emotions</h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-3">
        <ChildSwitcher value={child?.id} onChange={setChild} />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-2xl border px-3 py-2 shadow"
          aria-label="Select date"
        />
      </div>

      {!child && <p className="text-gray-600">Choose a child to log today’s emotion.</p>}

      {child && (
        <>
          <div
            className="grid gap-6 justify-items-center w-full"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
          >
            {EMOJIS.map((e) => {
              const active = e.key === last;
              return (
                <button
                  key={e.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(e.key)}
                  className={`tap-target inline-flex flex-col items-center text-center rounded-2xl border px-4 py-5 shadow active:scale-95 ${
                    active ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                  }`}
                >
                  <span aria-hidden="true" className="leading-none text-[96px]">{e.icon}</span>
                  <span className="mt-3 text-sm">{e.key}</span>
                </button>
              );
            })}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note…"
            className="w-full max-w-xl rounded-2xl border p-3 shadow"
            rows={3}
            aria-label="Emotion note"
          />

          {last && <div className="px-4 text-sm text-gray-600">Selected: {last}</div>}
        </>
      )}
    </main>
  );
}
