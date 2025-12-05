"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

type HistoryItem = { id: number; date: string; time: string; emotion: string; createdAt: string; note?: string | null };

const EMOJIS = [
  { key: "happy",   icon: "😊", label: "Happy" },
  { key: "calm",    icon: "😌", label: "Calm" },
  { key: "excited", icon: "��", label: "Excited" },
  { key: "neutral", icon: "😐", label: "Neutral" },
  { key: "sad",     icon: "😢", label: "Sad" },
  { key: "angry",   icon: "😠", label: "Angry" },
  { key: "tired",   icon: "🥱", label: "Tired" },
] as const;

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [historyOpen, setHistoryOpen] = useState(false);

  // filters
  const [from, setFrom] = useState<string>(new Date().toISOString().slice(0,10));
  const [days, setDays] = useState<number>(30);
  const [emotionFilter, setEmotionFilter] = useState<string>("all");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [lastPressed, setLastPressed] = useState<string | null>(null);

  const selectedChildLabel = useMemo(() => {
    return child ? `${child.name} (${child.age})` : "Select child";
  }, [child]);

  async function sendEmotion(key: string) {
    if (!child?.id) return;
    setLastPressed(key);
    try {
      await fetch("/api/emotions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ childId: child.id, emotion: key }),
      });
      // after saving, refresh history if panel open
      if (historyOpen) loadHistory();
    } catch {}
  }

  async function loadHistory() {
    if (!child?.id) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        childId: String(child.id),
        from,
        days: String(days),
      });
      const res = await fetch(`/api/emotions?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({ items: [] }));
      let arr: HistoryItem[] = Array.isArray(data) ? data : (data?.items ?? []);
      if (emotionFilter !== "all") {
        arr = arr.filter(r => r.emotion === emotionFilter);
      }
      setItems(arr);
    } finally {
      setLoading(false);
    }
  }

  // auto-load when opening panel or when child/filters change while open
  useEffect(() => {
    if (historyOpen) loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyOpen, child?.id, from, days, emotionFilter]);

  // group by date
  const grouped = useMemo(() => {
    const map = new Map<string, HistoryItem[]>();
    for (const it of items) {
      if (!map.has(it.date)) map.set(it.date, []);
      map.get(it.date)!.push(it);
    }
    return Array.from(map.entries()).sort((a,b) => (a[0] < b[0] ? 1 : -1)); // newest day first
  }, [items]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            aria-label="Home"
            className="tap-target inline-flex items-center justify-center rounded-2xl border p-4 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 w-[120px] h-[120px]"
          >
            <span aria-hidden="true" className="leading-none text-[64px]">🏠</span>
            <span className="sr-only">Home</span>
          </Link>

          <div className="flex-1" />

          <div className="inline-flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-xl px-3 py-2"
              aria-label="Date"
            />
            <ChildSwitcher value={child?.id} onChange={setChild} />
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Emotions for {selectedChildLabel}</h1>

        {/* emoji grid */}
        <div
          className="grid justify-center"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 240px))",
            gap: "24px",
          }}
        >
          {EMOJIS.map(e => (
            <button
              key={e.key}
              type="button"
              onClick={() => sendEmotion(e.key)}
              aria-label={e.label}
              className="tap-target rounded-2xl border shadow active:scale-95 w-[240px] h-[240px] inline-flex flex-col items-center justify-center"
            >
              <span className="text-[96px]" aria-hidden="true">{e.icon}</span>
              <span className="mt-2 text-base font-medium">{e.label}</span>
            </button>
          ))}
        </div>

        {lastPressed && (
          <div className="mt-3 text-sm text-gray-600">Last pressed: {lastPressed}</div>
        )}

        {/* History panel */}
        <div className="mt-10 text-left">
          <button
            type="button"
            onClick={() => setHistoryOpen(v => !v)}
            className="rounded-xl border px-4 py-2 shadow active:scale-95"
            aria-expanded={historyOpen}
            aria-controls="history-panel"
          >
            {historyOpen ? "Hide" : "Show"} History (last {days} days)
          </button>

          {historyOpen && (
            <div id="history-panel" className="mt-4 rounded-2xl border p-4">
              <form
                className="flex flex-wrap items-end gap-3 mb-4"
                onSubmit={(e) => { e.preventDefault(); loadHistory(); }}
              >
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600">From</label>
                  <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border rounded-xl px-3 py-2" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600">Days</label>
                  <input type="number" min={1} max={365} value={days} onChange={e=>setDays(Number(e.target.value || 1))} className="border rounded-xl px-3 py-2 w-[110px]" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600">Emotion</label>
                  <select value={emotionFilter} onChange={e=>setEmotionFilter(e.target.value)} className="border rounded-xl px-3 py-2">
                    <option value="all">All</option>
                    {EMOJIS.map(e => <option key={e.key} value={e.key}>{e.label}</option>)}
                  </select>
                </div>
                <button type="submit" className="rounded-xl border px-4 py-2 shadow active:scale-95">Apply</button>
              </form>

              {loading ? (
                <div className="text-sm text-gray-600">Loading…</div>
              ) : grouped.length === 0 ? (
                <div className="text-sm text-gray-600">No entries for selected range/filters.</div>
              ) : (
                <div className="space-y-4">
                  {grouped.map(([d, rows]) => (
                    <div key={d} className="rounded-xl border p-3">
                      <div className="font-medium mb-2">{d}</div>
                      <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {rows.map(r => {
                          const emoji = EMOJIS.find(x => x.key === r.emotion)?.icon ?? "📝";
                          const label = EMOJIS.find(x => x.key === r.emotion)?.label ?? r.emotion;
                          return (
                            <li key={r.id} className="rounded-lg border px-3 py-2 flex items-center gap-3">
                              <span className="text-2xl" aria-hidden="true">{emoji}</span>
                              <div className="text-sm">
                                <div className="font-medium">{label}</div>
                                <div className="text-gray-600">{r.time}</div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
