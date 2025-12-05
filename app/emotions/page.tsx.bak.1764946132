"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

const EMOJIS = [
  { key: "happy", icon: "😊", label: "Happy" },
  { key: "calm", icon: "😌", label: "Calm" },
  { key: "excited", icon: "🤩", label: "Excited" },
  { key: "neutral", icon: "😐", label: "Neutral" },
  { key: "sad", icon: "😢", label: "Sad" },
  { key: "angry", icon: "😠", label: "Angry" },
  { key: "tired", icon: "🥱", label: "Tired" },
] as const;

type HistoryItem = {
  id: number;
  date: string;         // YYYY-MM-DD
  time: string;         // HH:MM UTC
  emotion: string;      // enum value
  note: string | null;  // (always null now, shown for completeness)
  createdAt: string;
};

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [last, setLast] = useState<string | null>(null);

  // History state + filters
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [from, setFrom] = useState<string>(new Date().toISOString().slice(0,10));
  const [days, setDays] = useState<number>(7);
  const [emotionFilter, setEmotionFilter] = useState<string>("");

  // Fetch children selection happens inside ChildSwitcher; here we just react when child changes
  useEffect(() => {
    if (!child?.id) return;
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child]);

  async function fetchHistory(opts?: { from?: string; days?: number }) {
    if (!child?.id) return;
    const f = opts?.from ?? from;
    const d = opts?.days ?? days;

    const url = new URL("/api/emotions", window.location.origin);
    url.searchParams.set("childId", String(child.id));
    url.searchParams.set("from", f);
    url.searchParams.set("days", String(d));

    const res = await fetch(url.toString(), { cache: "no-store" });
    const data = res.ok ? await res.json() : { items: [] };
    setHistory(Array.isArray(data.items) ? data.items : []);
  }

  async function sendEmotion(eKey: string) {
    if (!child?.id) return;
    const res = await fetch("/api/emotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: child.id,
        emotion: eKey,   // no note
      }),
    });
    if (res.ok) {
      setLast(eKey);
      // refresh history to show the new entry
      fetchHistory();
    }
  }

  // Derived: filtered history (by emotion)
  const filteredHistory = useMemo(() => {
    if (!emotionFilter) return history;
    return history.filter(h => h.emotion === emotionFilter);
  }, [history, emotionFilter]);

  // Group by date for nicer display
  const grouped = useMemo(() => {
    const map = new Map<string, HistoryItem[]>();
    for (const item of filteredHistory) {
      if (!map.has(item.date)) map.set(item.date, []);
      map.get(item.date)!.push(item);
    }
    // sort dates desc
    return Array.from(map.entries()).sort((a,b) => (a[0] < b[0] ? 1 : -1));
  }, [filteredHistory]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        {/* Top row: Home + date + children */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <Link
            href="/"
            aria-label="Home"
            className="tap-target inline-flex size-[120px] items-center justify-center rounded-2xl border shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <span aria-hidden="true" className="leading-none text-[80px]">🏠</span>
            <span className="sr-only">Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              value={from}
              onChange={(e) => { setFrom(e.target.value); fetchHistory({ from: e.target.value }); }}
              className="rounded-xl border px-3 py-2 shadow"
            />
          </div>

          <ChildSwitcher
            onChange={(c) => setChild(c)}
          />
        </div>

        {/* Big emotion tiles */}
        <div className="mt-8 grid grid-cols-[repeat(auto-fit,240px)] justify-center gap-[240px]">
          {EMOJIS.map((e) => (
            <button
              key={e.key}
              type="button"
              aria-pressed={last === e.key}
              onClick={() => sendEmotion(e.key)}
              className="tap-target inline-flex size-[240px] flex-col items-center justify-center rounded-2xl border bg-white shadow active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
            >
              <span className="text-[96px]" aria-hidden="true">{e.icon}</span>
              <span className="mt-2 text-base font-medium">{e.label}</span>
            </button>
          ))}
        </div>

        {/* Expandable history panel */}
        <details className="mt-10 text-left">
          <summary className="cursor-pointer select-none rounded-2xl border px-4 py-3 shadow">
            <span className="font-semibold">History (last {days} days)</span>
            {last && <span className="ml-3 text-sm text-gray-500">Last recorded: {last}</span>}
          </summary>

          <div className="mt-4 rounded-2xl border p-4">
            {/* Filters */}
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="rounded-xl border px-3 py-2 shadow"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Days</label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="rounded-xl border px-3 py-2 shadow"
                >
                  <option value={7}>7</option>
                  <option value={14}>14</option>
                  <option value={30}>30</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Emotion</label>
                <select
                  value={emotionFilter}
                  onChange={(e) => setEmotionFilter(e.target.value)}
                  className="rounded-xl border px-3 py-2 shadow"
                >
                  <option value="">All</option>
                  {EMOJIS.map(e => (
                    <option key={e.key} value={e.key}>{e.label}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => fetchHistory({ from, days })}
                className="rounded-2xl border px-4 py-2 shadow active:scale-95"
              >
                Apply
              </button>
            </div>

            {/* Results */}
            <div className="mt-6">
              {grouped.length === 0 && (
                <div className="text-sm text-gray-500">No entries for selected range/filters.</div>
              )}

              <div className="grid gap-4">
                {grouped.map(([date, items]) => (
                  <div key={date} className="rounded-xl border p-3">
                    <div className="font-semibold">{date}</div>
                    <ul className="mt-2 grid gap-2">
                      {items.map((it) => {
                        const emoji = EMOJIS.find(e => e.key === it.emotion)?.icon ?? "•";
                        const label = EMOJIS.find(e => e.key === it.emotion)?.label ?? it.emotion;
                        return (
                          <li key={it.id} className="flex items-center gap-3">
                            <span className="text-xl" aria-hidden="true">{emoji}</span>
                            <span className="text-sm">{label}</span>
                            <span className="ml-auto text-xs text-gray-500">{it.time}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}
