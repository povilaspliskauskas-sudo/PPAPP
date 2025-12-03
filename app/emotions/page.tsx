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
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!child?.id) return;
    fetch(`/api/emotions?childId=${child.id}&date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        setLast(d?.emotion ?? null);
        setNote(d?.note ?? "");
      });
  }, [child?.id, date]);

  const save = async (emotion: string) => {
    if (!child?.id) return;
    setSaving(true);
    try {
      await fetch("/api/emotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId: child.id, date, emotion, note }),
      });
      setLast(emotion);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen p-4 flex flex-col gap-4">
      <BackHome />

      <h1 className="text-2xl font-bold px-4">😊 Emotions</h1>

      <div className="flex flex-wrap items-center gap-3 px-4">
        <ChildSwitcher value={child?.id} onChange={(c) => setChild(c)} />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border px-3 py-2 shadow"
        />
      </div>

      <div
        className="grid gap-3 px-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", display: "grid" }}
      >
        {EMOJIS.map((e) => (
          <button
            key={e.key}
            disabled={saving}
            onClick={() => save(e.key)}
            className={`h-24 rounded-2xl border shadow flex flex-col items-center justify-center gap-2 active:scale-95 ${
              last === e.key ? "outline outline-2 outline-emerald-400" : ""
            }`}
          >
            <div className="text-3xl" aria-hidden>
              {e.icon}
            </div>
            <div className="text-xs">{e.key}</div>
          </button>
        ))}
      </div>

      <div className="px-4">
        <textarea
          placeholder="Optional note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-2xl border p-3 shadow min-h-[80px]"
        />
      </div>

      {last && <div className="px-4 text-sm text-gray-600">Selected: {last}</div>}
    </main>
  );
}
