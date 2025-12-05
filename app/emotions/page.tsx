"use client";
import { useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";
import HistoryEmotions from "../components/HistoryEmotions";

const EMOJIS = [
  { value: "HAPPY",   label: "happy",   icon: "😊" },
  { value: "CALM",    label: "calm",    icon: "😌" },
  { value: "EXCITED", label: "excited", icon: "🤩" },
  { value: "NEUTRAL", label: "neutral", icon: "😐" },
  { value: "SAD",     label: "sad",     icon: "😢" },
  { value: "ANGRY",   label: "angry",   icon: "😠" },
  { value: "TIRED",   label: "tired",   icon: "🥱" },
];

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState<string>("");
  const [last, setLast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function pressEmotion(value: string) {
    if (!child?.id) return;
    setSaving(true);
    try {
      await fetch("/api/emotions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          childId: child.id,
          emotion: value, // already UPPERCASE to match enum
          note: note || null,
        }),
      });
      setLast(value);
      setNote("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-start p-6">
      <div className="w-full max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex items-center justify-center rounded-2xl border p-2 shadow active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <span aria-hidden="true" className="leading-none text-[96px]">🏠</span>
            <span className="sr-only">Home</span>
          </Link>

          <div className="text-right">
            <div className="text-sm text-gray-500">{date}</div>
            <ChildSwitcher value={child?.id} onChange={(c) => setChild(c)} />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-center">How do you feel?</h1>

        <div
          className="mt-4 grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {EMOJIS.map((e) => (
            <button
              key={e.value}
              type="button"
              aria-pressed={last === e.value}
              onClick={() => pressEmotion(e.value)}
              disabled={!child?.id || saving}
              className={`tap-target text-left inline-flex flex-col items-center justify-center rounded-2xl border p-4 shadow active:scale-95 ${
                last === e.value ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
              }`}
            >
              <div className="text-[96px]" aria-hidden="true">{e.icon}</div>
              <div className="font-medium mt-2">{e.label}</div>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border p-3"
            rows={2}
            placeholder="What happened?"
          />
        </div>

        <HistoryEmotions child={child} days={7} />
      </div>
    </main>
  );
}
