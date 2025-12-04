"use client";
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
import { useEffect, useState } from "react";
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">import BackHome from "../components/BackHome";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
const EMOJIS = [
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  { key: "happy", icon: "😊" },
  { key: "calm", icon: "😌" },
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  { key: "excited", icon: "🤩" },
  { key: "neutral", icon: "😐" },
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  { key: "sad", icon: "😢" },
  { key: "angry", icon: "😠" },
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  { key: "tired", icon: "🥱" },
];
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
export default function EmotionsPage() {
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  const [child, setChild] = useState<Child | undefined>();
  return (
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [last, setLast] = useState<string | null>(null);
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  const [note, setNote] = useState<string>("");

      <div className="w-full max-w-[900px] mx-auto px-4 text-center">  useEffect(() => {
    setLast(null);
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">    setNote("");
  }, [child, date]);
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
  const choose = (key: string) => setLast(prev => (prev === key ? null : key));
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
  return (
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">    <main className="w-full flex flex-col items-center">
      <BackHome />
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">      <h1 className="text-3xl font-semibold">Emotions</h1>

      <div className="w-full max-w-[900px] mx-auto px-4 text-center">      <div className="flex flex-col md:flex-row items-center justify-center gap-3">
        <ChildSwitcher value={child?.id} onChange={setChild} />
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">        <input
          type="date"
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">          value={date}
          onChange={(e) => setDate(e.target.value)}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">          className="rounded-2xl border px-3 py-2 shadow"
          aria-label="Select date"
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">        />
      </div>
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
      {!child && <p className="text-gray-600">Choose a child to log today’s emotion.</p>}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
      {child && (
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">        <>
          <div
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">            className="grid gap-6 justify-items-center w-full"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">          >
            {EMOJIS.map((e) => {
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">              const active = e.key === last;
              return (
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">                <button
                  key={e.key}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">                  type="button"
                  aria-pressed={active}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">                  onClick={() => choose(e.key)}
                  className={`tap-target inline-flex flex-col items-center text-center rounded-2xl border px-4 py-5 shadow active:scale-95 ${
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">                    active ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                  }`}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">                >
                  <span aria-hidden="true" className="leading-none text-[96px]">{e.icon}</span>
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">                  <span className="mt-3 text-sm">{e.key}</span>
                </button>
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">              );
            })}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">          </div>

      <div className="w-full max-w-[900px] mx-auto px-4 text-center">          <textarea
            value={note}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note…"
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">            className="w-full max-w-xl rounded-2xl border p-3 shadow"
            rows={3}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">            aria-label="Emotion note"
          />
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">
          {last && <div className="px-4 text-sm text-gray-600">Selected: {last}</div>}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">        </>
      )}
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">    </main>
  );
      <div className="w-full max-w-[900px] mx-auto px-4 text-center">}
</div>
