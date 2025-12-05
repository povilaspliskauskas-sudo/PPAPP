"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

type Item = {
  id: number;
  date: string;     // YYYY-MM-DD
  time: string;     // HH:MM (UTC)
  emotion: string;
  createdAt: string;
  note: string | null;
};

const EMOJIS = [
  { key: "happy", icon: "😊", label: "Happy" },
  { key: "calm", icon: "😌", label: "Calm" },
  { key: "excited", icon: "🤩", label: "Excited" },
  { key: "neutral", icon: "😐", label: "Neutral" },
  { key: "sad", icon: "😢", label: "Sad" },
  { key: "angry", icon: "😠", label: "Angry" },
  { key: "tired", icon: "🥱", label: "Tired" },
] as const;

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [lastPressed, setLastPressed] = useState<string | null>(null);

  // History UI state
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [from, setFrom] = useState<string>(new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState<number>(30);
  const [emotionFilter, setEmotionFilter] = useState<string>("all");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchHistory() {
    if (!child?.id) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        childId: String(child.id),
        from,
        days: String(days),
        emotion: emotionFilter,
      });
      const res = await fetch(`/api/emotions?` + params.toString(), { cache: "no-store" });
      const data = res.ok ? await res.json() : { items: [] };
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Load when opening panel or when filters/child change while open
  useEffect(() => {
    if (historyOpen) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyOpen, child?.id, from, days, emotionFilter]);

  // Press-to-log emotion
  async function sendEmotion(key: string) {
    if (!child?.id) return;
    setLastPressed(key);
    try {
      const res = await fetch("/api/emotions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ childId: child.id, emotion: key }),
      });
      const saved = await res.json().catch(() => null);

      // Optimistically append if panel open and entry matches filters
      if (historyOpen && saved) {
        const okEmotion = emotionFilter === "all" || saved.emotion === emotionFilter;
        const fromDate = new Date(from + "T00:00:00.000Z");
        const toDate = new Date(fromDate);
        toDate.setUTCDate(toDate.getUTCDate() + (days || 30));
        const savedDate = new Date(saved.date + "T00:00:00.000Z");
        const okRange = savedDate >= fromDate && savedDate < toDate;
        if (okEmotion && okRange) {
          setItems(prev => [{ ...saved }, ...prev]);
        }
      }
    } catch {
      /* no-op */
    }
  }

  // Group items by date to show multiple presses per day
  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      if (!map.has(it.date)) map.set(it.date, []);
      map.get(it.date)!.push(it);
    }
    // sort each day by createdAt desc (already desc from API, but ensure)
    for (const arr of map.values()) {
      arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [items]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        {/* Top bar with Home + Child + Date */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <span aria-hidden="true" className="leading-none text-[96px]">🏠</span>
            <span className="sr-only">Home</span>
          </Link>

          <ChildSwitcher value={child?.id} onChange={setChild} />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border px-3 py-2 shadow"
            aria-label="Date"
          />
        </div>

        {/* Emoji grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          {EMOJIS.map(e => (
            <button
              key={e.key}
              type="button"
              aria-pressed={lastPressed === e.key}
              onClick={() => sendEmotion(e.key)}
              className={`tap-target w-[240px] h-[240px] rounded-2xl border shadow active:scale-95 flex flex-col items-center justify-center ${
                lastPressed === e.key ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-white"
              }`}
            >
              <div className="text-[120px]" aria-hidden="true">{e.icon}</div>
              <div className="mt-2 font-medium">{e.label}</div>
            </button>
          ))}
        </div>

        {/* History Panel */}
        <div className="mt-10 text-left">
          <button
            type="button"
            onClick={() => setHistoryOpen(v => !v)}
            className="rounded-xl border px-4 py-2 shadow"
            aria-expanded={historyOpen}
          >
            {historyOpen ? "Hide" : "Show"} History (last {days} days)
          </button>

          {historyOpen && (
            <div className="mt-4 rounded-2xl border p-4">
              {/* Filters */}
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-sm text-gray-600">From</label>
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="rounded-xl border px-3 py-2 shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Days</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Math.min(90, Number(e.target.value) || 1)))}
                    className="w-24 rounded-xl border px-3 py-2 shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Emotion</label>
                  <select
                    value={emotionFilter}
                    onChange={(e) => setEmotionFilter(e.target.value)}
                    className="rounded-xl border px-3 py-2 shadow"
                  >
                    <option value="all">All</option>
                    {EMOJIS.map(e => (
                      <option key={e.key} value={e.key}>{e.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={fetchHistory}
                  className="h-[42px] rounded-xl border px-4 py-2 shadow"
                >
                  Apply
                </button>
              </div>

              {/* Results */}
              <div className="mt-4">
                {loading && <div className="text-sm text-gray-500">Loading…</div>}
                {!loading && grouped.length === 0 && (
                  <div className="text-sm text-gray-500">No entries for selected range/filters.</div>
                )}
                {!loading && grouped.length > 0 && (
                  <div className="space-y-4">
                    {grouped.map(([day, list]) => (
                      <div key={day} className="rounded-xl border p-3">
                        <div className="font-semibold mb-2">{day}</div>
                        <ul className="space-y-1">
                          {list.map(it => (
                            <li key={it.id} className="flex items-center gap-2 text-sm">
                              <span className="inline-block w-14 text-gray-600">{it.time}</span>
                              <span className="text-base">
                                {EMOJIS.find(e => e.key === it.emotion)?.icon ?? "❓"}
                              </span>
                              <span className="ml-2">{it.emotion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
