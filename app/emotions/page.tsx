"use client";
import { useEffect, useMemo, useState } from "react";
import BackHome from "../components/BackHome";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

const EMOJIS = [
  { key: "happy", icon: "😊" },
  { key: "calm", icon: "��" },
  { key: "excited", icon: "🤩" },
  { key: "neutral", icon: "😐" },
  { key: "sad", icon: "😢" },
  { key: "angry", icon: "😠" },
  { key: "tired", icon: "🥱" },
];

const fmt = (d: Date) => d.toISOString().slice(0, 10);
const lastNDates = (n: number) => {
  const out: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const dd = new Date(today);
    dd.setDate(today.getDate() - i);
    out.push(fmt(dd));
  }
  return out.reverse();
};

type EmotionRow = { date: string; emotion: string | null; note: string | null };

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [last, setLast] = useState<string | null>(null);
  const [history, setHistory] = useState<EmotionRow[]>([]);

  // Load history for last 7 days on child change
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!child?.id) return;
      const dates = lastNDates(7);
      const rows: EmotionRow[] = [];
      for (const d of dates) {
        try {
          const res = await fetch(`/api/emotions?childId=${child.id}&date=${d}`, { cache: "no-store" });
          const data = res.ok ? await res.json() : null;
          rows.push({ date: d, emotion: data?.emotion ?? null, note: data?.note ?? null });
        } catch {
          rows.push({ date: d, emotion: null, note: null });
        }
      }
      if (alive) setHistory(rows);
    })();
    return () => { alive = false; };
  }, [child?.id]);

  async function setEmotion(emotion: string) {
    if (!child?.id) return;
    try {
      await fetch(`/api/emotions?childId=${child.id}&date=${date}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion }),
      });
      setLast(emotion);

      // Refresh today row in history
      const today = fmt(new Date());
      setHistory((prev) => {
        const idx = prev.findIndex((r) => r.date === today);
        const copy = [...prev];
        if (idx >= 0) copy[idx] = { ...copy[idx], emotion };
        else copy.push({ date: today, emotion, note: null });
        return copy;
      });
    } catch {}
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1200px] mx-auto px-4 text-center">
        <BackHome />

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border px-3 py-2 shadow"
            />
          </div>

          <ChildSwitcher onChange={setChild} />
        </div>

        <div
          className="grid justify-items-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}
        >
          {EMOJIS.map((e) => (
            <button
              key={e.key}
              type="button"
              onClick={() => setEmotion(e.key)}
              aria-pressed={last === e.key}
              className={`tap-target rounded-2xl border shadow px-6 py-4 w-[240px] h-[240px] bg-white inline-flex flex-col items-center justify-center transition
                ${last === e.key ? "outline outline-2 outline-emerald-400 bg-emerald-50" : ""}`}
            >
              <span aria-hidden className="text-[200px] leading-none">{e.icon}</span>
              <span className="mt-2 font-medium">{e.key}</span>
            </button>
          ))}
        </div>

        {last && <div className="mt-4 text-sm text-gray-600">Selected: {last}</div>}

        {/* History */}
        {child && (
          <section className="mt-10 text-left">
            <h2 className="text-xl font-semibold mb-2 text-center">Emotions – last 7 days</h2>
            <div className="rounded-2xl border p-4 shadow bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 pr-4 text-left">Date</th>
                      <th className="py-2 pr-4 text-left">Emotion</th>
                      <th className="py-2 text-left">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((r) => (
                      <tr key={r.date} className="border-b last:border-0">
                        <td className="py-2 pr-4">{r.date}</td>
                        <td className="py-2 pr-4">{r.emotion ?? "—"}</td>
                        <td className="py-2">{r.note ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
