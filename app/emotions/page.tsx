"use client";
import { useEffect, useState } from "react";
import ChildSwitcher from "../components/ChildSwitcher";
const EMOJIS = [
  { key: "happy", icon: "😊" },
  { key: "sad", icon: "😢" },
  { key: "angry", icon: "😠" },
  { key: "excited", icon: "🤩" },
  { key: "tired", icon: "🥱" },
  { key: "calm", icon: "😌" },
];

export default function EmotionsPage() {
  const [childId, setChildId] = useState<number>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [last, setLast] = useState<string | null>(null);

  const load = async () => {
    if (!childId) return;
    const r = await fetch(`/api/emotions?childId=${childId}&date=${date}`);
    const d = await r.json();
    setLast(d.entry?.emotion ?? null);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [childId, date]);

  const setEmotion = async (emotion: string) => {
    if (!childId) return;
    await fetch("/api/emotions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ childId, date, emotion }),
    });
    setLast(emotion);
  };

  return (
    <main className="min-h-screen p-4 space-y-4">
      <h1 className="text-xl font-bold">Emotions</h1>
      <ChildSwitcher value={childId} onChange={setChildId} />
      <div className="flex items-center gap-3">
        <label className="text-sm">Date</label>
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="border rounded px-3 py-2" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {EMOJIS.map((e) => (
          <button key={e.key} onClick={()=>setEmotion(e.key)}
            className={`h-24 text-4xl rounded-2xl border shadow active:scale-95 ${last===e.key ? "bg-gray-100" : ""}`}>
            {e.icon}
          </button>
        ))}
      </div>
      {last && <div className="text-sm text-gray-600">Selected: {last}</div>}
    </main>
  );
}
