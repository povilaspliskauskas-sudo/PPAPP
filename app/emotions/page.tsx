"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

type HistItem = {
  id: number;
  date: string;    // YYYY-MM-DD
  time: string;    // HH:MM:SS
  emotion: string; // happy|...
  note?: string | null;
};

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [from, setFrom] = useState<string>(new Date().toISOString().slice(0,10));
  const [days, setDays] = useState<number>(30);
  const [filter, setFilter] = useState<string>("all");
  const [items, setItems] = useState<HistItem[]>([]);
  const [open, setOpen] = useState<boolean>(true);
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const emojiMap = useMemo(() => {
    const m: Record<string,string> = {};
    for (const e of EMOJIS) m[e.key] = e.icon;
    return m;
  }, []);

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
      setItems(Array.isArray(data?.items) ? data.items : []);
    } finally {
      setLoading(false);
    }
  }

  async function sendEmotion(key: string) {
    if (!child?.id) return;
    setLastPressed(key);
    try {
      const res = await fetch("/api/emotions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ childId: child.id, emotion: key }),
      });
      // ignore body – we’ll refetch authoritative server data
    } catch {}
    setOpen(true);         // make sure user sees history
    await fetchHistory();  // always refresh after press
  }

  // Auto-refresh when child or filters change (if panel open)
  useEffect(() => {
    if (open) fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child?.id, from, days, filter, open]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        <Link
          href="/"
          aria-label="Home"
          className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          <span aria-hidden="true" className="leading-none text-[96px]">🏠</span>
          <span className="sr-only">Home</span>
        </Link>

        {/* child + date controls */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center items-center">
          <ChildSwitcher onChange={setChild} />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded border px-3 py-2"
            aria-label="From date"
          />
          <input
            type="number"
            min={1}
            max={90}
            value={days}
            onChange={(e) => setDays(Math.max(1, Math.min(90, Number(e.target.value) || 30)))}
            className="w-24 rounded border px-3 py-2"
            aria-label="Number of days"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded border px-3 py-2"
            aria-label="Filter emotion"
          >
            <option value="all">All</option>
            {EMOJIS.map(e => <option key={e.key} value={e.key}>{e.key}</option>)}
          </select>
          <button
            onClick={fetchHistory}
            className="rounded-lg border px-3 py-2 shadow active:scale-95"
          >
            Apply
          </button>
        </div>

        {/* emoji grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
          {!child?.id && (
            <div className="col-span-full text-sm text-red-600">Select a child to start logging emotions.</div>
          )}
          {EMOJIS.map((e) => {
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
                <div className="mt-2 font-semibold text-lg">{e.key}</div>
              </button>
            );
          })}
        </div>

        {/* History */}
        <div className="mt-10 text-left">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="rounded-lg border px-4 py-2 shadow"
            aria-expanded={open}
            aria-controls="history-panel"
          >
            {open ? "Hide" : "Show"} History (last {days} days)
          </button>

          {open && (
            <div id="history-panel" className="mt-4 rounded-2xl border p-4">
              {loading && <div className="text-sm text-gray-500">Loading…</div>}
              {!loading && items.length === 0 && (
                <div className="text-sm text-gray-500">No entries for selected range/filters.</div>
              )}
              {!loading && items.length > 0 && (
                <ul className="divide-y">
                  {items.map((it) => (
                    <li key={it.id} className="py-2 flex items-center gap-3">
                      <span className="text-xl" aria-hidden="true">{emojiMap[it.emotion] ?? "❓"}</span>
                      <span className="text-sm text-gray-600 w-28">{it.date} {it.time}</span>
                      <span className="font-medium capitalize">{it.emotion}</span>
                      {it.note && <span className="text-sm text-gray-500">— {it.note}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
