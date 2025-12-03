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
    if (!child?.id) return;
    fetch(`/api/emotions?childId=${child.id}&date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        setLast(d?.emotion ?? null);
        setNote(d?.note ?? "");
      })
      .catch(() => {
        setLast(null);
        setNote("");
      });
  }, [child?.id, date]);

  const save = async (emotion: string) => {
    if (!child?.id) return;
    await fetch("/api/emotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId: child.id, date, emotion, note }),
    });
    setLast(emotion);
  };

  return (
    <main className="min-h-screen p-4 flex flex-col gap-4">
      <BackHome />
      <h1 className="text-xl font-bold">Emotions</h1>

      <div className="flex items-center gap-3">
        <ChildSwitcher value={child?.id} onChange={setChild} />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border px-3 py-2 shadow w-fit"
        />
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
        {EMOJIS.map((e) => (
          <button
            key={e.key}
            onClick={() => save(e.key)}
            className={`rounded-2xl border p-3 shadow active:scale-95 ${
              last === e.key ? "outline outline-2 outline-emerald-400" : ""
            }`}
          >
            <div className="text-3xl">{e.icon}</div>
            <div className="text-sm mt-1">{e.key}</div>
          </button>
        ))}
      </div>

      <div className="mt-2">
        <textarea
          className="w-full rounded-xl border p-3 shadow min-h-[100px]"
          placeholder="Optional note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {last && <div className="px-4 text-sm text-gray-600">Selected: {last}</div>}
    </main>
  );
}
