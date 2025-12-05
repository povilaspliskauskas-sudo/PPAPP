"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

/** The 7 emotions we support */
const EMOJIS = [
  { key: "happy",   icon: "😊" },
  { key: "calm",    icon: "😌" },
  { key: "excited", icon: "🤩" },
  { key: "neutral", icon: "😐" },
  { key: "sad",     icon: "😢" },
  { key: "angry",   icon: "😠" },
  { key: "tired",   icon: "🥱" },
] as const;

type HistItem = {
  id: number | string;     // number from DB, string for optimistic rows
  date: string;            // YYYY-MM-DD (UTC)
  time: string;            // HH:MM:SS (UTC)
  emotion: string;         // matches one of EMOJIS keys
  note?: string | null;
  optimistic?: boolean;
};

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [from, setFrom]   = useState<string>(new Date().toISOString().slice(0, 10));
  const [days, setDays]   = useState<number>(30);
  const [filter, setFilter] = useState<string>("all");
  const [items, setItems] = useState<HistItem[]>([]);
  const [open, setOpen]   = useState<boolean>(true);
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const emojiMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const e of EMOJIS) m[e.key] = e.icon;
    return m;
  }, []);

  function nowParts() {
    // Record current day/time from UTC ISO string parts
    const d = new Date();
    const day = new Date(d.toISOString().slice(0, 10) + "T00:00:00.000Z")
      .toISOString()
      .slice(0, 10);
    const time = d.toISOString().slice(11, 19);
    return { date: day, time };
  }

  async function fetchHistory() {
    if (!child?.id) { setItems([]); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        childId: String(child.id),
        from,
        days: String(days),
        emotion: filter || "all",
      });
      const res = await fetch(`/api/emotions?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      const serverItems: HistItem[] = Array.isArray(data?.items) ? data.items : [];
      setItems(serverItems);
    } finally {
      setLoading(false);
    }
  }

  async function sendEmotion(key: string) {
    if (!child?.id) return;
    setLastPressed(key);

    // Optimistic append
    const { date, time } = nowParts();
    const optimisticRow: HistItem = {
      id: "tmp-" + Math.random().toString(36).slice(2),
      date,
      time,
      emotion: key,
      note: null,
      optimistic: true,
    };
    setItems(prev => [optimisticRow, ...prev]);
    setOpen(true);

    try {
      await fetch("/api/emotions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ childId: child.id, emotion: key }),
      });
    } catch {
      // keep optimistic row; user still sees feedback
    }
    // Refresh with server truth
    await fetchHistory();
  }

  // Refresh when inputs change and the panel is open
  useEffect(() => {
    if (open) fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child?.id, from, days, filter, open]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        {/* Home button */}
        <Link
          href="/"
          aria-label="Home"
          className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          <span aria-hidden="true" className="leading-none text-[96px]">🏠</span>
          <span className="sr-only">Home</span>
        </Link>

        {/* Child selector on its own row */}
        <div className="mt-6 flex justify-center">
          <ChildSwitcher onChange={setChild} />
        </div>

        {/* Emoji grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          {!child?.id && (
            <div className="col-span-full text-sm text-red-600">
              Select a child to start logging emotions.
            </div>
          )}
          {EMOJIS.map(e => {
            const pressed = lastPressed === e.key;
            return (
              <button
                key={e.key}
                type="button"
                disabled={!child?.id}
                aria-disabled={!child?.id}
                onClick={() => sendEmotion(e.key)}
                className={`tap-target w-[240px] h-[240px] inline-flex flex-col items-center justify-center rounded-2xl border shadow active:scale-95 ${
                  pressed ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-white"
                }`}
              >
                <div className="text-[120px]" aria-hidden="true">{e.icon}</div>
                <div className="mt-2 font-semibold text-lg capitalize">{e.key}</div>
              </button>
            );
          })}
        </div>

        {/* History + Filters */}
        <div className="mt-10 text-left">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="rounded-lg border px-4 py-2 shadow"
                aria-expanded={open}
                aria-controls="history-panel"
              >
                {open ? "Hide" : "Show"} History
              </button>

              {/* Filters to the right */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm text-gray-600">From</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="rounded border px-3 py-2"
                  aria-label="From date"
                />
                <label className="text-sm text-gray-600">Days</label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={days}
                  onChange={(e) =>
                    setDays(Math.max(1, Math.min(90, Number(e.target.value) || 30)))
                  }
                  className="w-24 rounded border px-3 py-2"
                  aria-label="Number of days"
                />
                <label className="text-sm text-gray-600">Emotion</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded border px-3 py-2"
                  aria-label="Filter emotion"
                >
                  <option value="all">All</option>
                  {EMOJIS.map(e => (
                    <option key={e.key} value={e.key}>{e.key}</option>
                  ))}
                </select>
                <button
                  onClick={fetchHistory}
                  className="rounded-lg border px-3 py-2 shadow active:scale-95"
                >
                  Apply
                </button>
              </div>
            </div>

            {open && (
              <div id="history-panel" className="rounded-2xl border p-4">
                {loading && <div className="text-sm text-gray-500">Loading…</div>}
                {!loading && items.length === 0 && (
                  <div className="text-sm text-gray-500">
                    No entries for selected range/filters.
                  </div>
                )}
                {!loading && items.length > 0 && (
                  <ul className="divide-y">
                    {items.map((it) => (
                      <li key={it.id} className="py-2 flex items-center gap-3">
                        <span className="text-xl" aria-hidden="true">
                          {emojiMap[it.emotion] ?? "❓"}
                        </span>
                        <span className="text-sm text-gray-600 w-40">
                          {it.date} {it.time}
                        </span>
                        <span className="font-medium capitalize">{it.emotion}</span>
                        {it.optimistic && (
                          <span className="ml-2 text-[10px] uppercase text-amber-600">
                            pending
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
