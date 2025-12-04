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
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [last, setLast] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (!child?.id) return;
    setLast(null);
    setNote("");
    fetch(`/api/emotions?childId=${child.id}&date=${date}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setLast(d?.emotion ?? null); setNote(d?.note ?? ""); } })
      .catch(()=>{});
  }, [child?.id, date]);

  function saveEmotion(emotion: string) {
    if (!child?.id) return;
    setLast(emotion);
    fetch(`/api/emotions?childId=${child.id}&date=${date}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emotion, note }),
      keepalive: true,
    }).catch(()=>{});
  }

  return (
    <main className="w-full">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center p-4 gap-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <BackHome />
          <ChildSwitcher value={child?.id} onChange={setChild as any} />
          <input
            type="date"
            className="border rounded-xl px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Select date"
          />
        </div>

        <div
          className="grid gap-4 justify-center place-items-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
        >
          {EMOJIS.map(e => {
            const active = last === e.key;
            return (
              <button
                key={e.key}
                type="button"
                aria-pressed={active}
                onClick={() => saveEmotion(e.key)}
                className={`tap-target inline-flex flex-col items-center rounded-2xl border px-3 py-2 shadow active:scale-95 ${
                  active ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                }`}
              >
                <span className="text-[96px]" aria-hidden="true">{e.icon}</span>
                <span className="mt-1 font-medium capitalize">{e.key}</span>
              </button>
            );
          })}
        </div>

        <textarea
          className="w-full max-w-xl border rounded-2xl p-3"
          rows={4}
          placeholder="Add a note (optional)…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </main>
  );
}
