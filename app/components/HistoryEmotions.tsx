"use client";
import { useEffect, useMemo, useState } from "react";

type Entry = {
  id: number;
  date: string;
  time: string;       // "HH:MM UTC"
  emotion: string;
  note: string | null;
  createdAt: string;
};

export default function HistoryEmotions({
  child,
  days = 7,
}: {
  child?: { id: number; name: string };
  days?: number;
}) {
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  // explicit last N day labels, newest first
  const dates = useMemo(() => {
    const out: string[] = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }, [days]);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!child?.id) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          childId: String(child.id),
          days: String(days),
          from: new Date().toISOString().slice(0, 10), // start “today” then days back
        });
        const res = await fetch(`/api/emotions?` + params.toString(), { cache: "no-store" });
        const data = res.ok ? await res.json() : null;
        if (!alive) return;
        const arr: Entry[] = data?.items ?? [];
        setItems(arr);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [child?.id, days]);

  const byDate = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    for (const d of dates) map[d] = [];
    for (const it of items) {
      (map[it.date] ||= []).push(it);
    }
    return map;
  }, [items, dates]);

  const who = child?.name || "Kid";

  return (
    <section className="mt-10 w-full">
      <h2 className="text-xl font-semibold text-center">
        History (last {days} days) for {who}
      </h2>
      {loading && (
        <div className="text-center text-sm text-gray-500 mt-2">Loading…</div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dates.map((d) => {
          const rows = byDate[d] || [];
          return (
            <div key={d} className="rounded-2xl border p-4 shadow bg-white/50">
              <div className="font-medium">{d}</div>
              {rows.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {rows.map((r) => (
                    <li key={r.id} className="flex items-start gap-2 text-sm">
                      <span className="min-w-[56px] font-mono text-gray-600">{r.time}</span>
                      <span className="text-xl leading-none">{r.emotion}</span>
                      {r.note ? (
                        <span className="text-gray-700 break-words">— {r.note}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 text-sm text-gray-500">No entries.</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
