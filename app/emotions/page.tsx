"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

type LocalEmotionRow = {
  id: string;           // local unique id
  childId: number;
  emotion: string;      // happy|calm|...
  who: string;          // "Mom", "Dad", "Teacher", etc
  ts: number;           // epoch millis (when tapped)
};

const EMOJIS = [
  { key: "happy", icon: "😊" },
  { key: "calm", icon: "😌" },
  { key: "excited", icon: "🤩" },
  { key: "neutral", icon: "😐" },
  { key: "sad", icon: "😢" },
  { key: "angry", icon: "😠" },
  { key: "tired", icon: "🥱" },
];

// ---------- Local storage helpers ----------
const LS_KEY = "emotionLocalLogV1";

function loadLocalLog(): LocalEmotionRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

function saveLocalLog(rows: LocalEmotionRow[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(rows));
  } catch {}
}

function fmtDateTime(ts: number) {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}:${ss}` };
}

// -------------------------------------------

export default function EmotionsPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [identity, setIdentity] = useState<string>("");
  const [last, setLast] = useState<string | null>(null);

  // local history
  const [rows, setRows] = useState<LocalEmotionRow[]>([]);

  // filter controls
  const [open, setOpen] = useState<boolean>(true);
  const [from, setFrom] = useState<string>(new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState<number>(30);
  const [filter, setFilter] = useState<string>("all");

  // hydrate from localStorage
  useEffect(() => {
    setRows(loadLocalLog());
    try {
      const savedWho = window.localStorage.getItem("emotionWho") || "";
      setIdentity(savedWho);
    } catch {}
  }, []);

  // persist who recorder name
  useEffect(() => {
    try {
      window.localStorage.setItem("emotionWho", identity || "");
    } catch {}
  }, [identity]);

  // tap handler: POST to API (best effort) AND log locally
  async function recordEmotion(emotion: string) {
    if (!child?.id) return;
    const who = (identity || "Unknown").trim();

    // fire-and-forget server log (won't block UI)
    try {
      fetch("/api/emotions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ childId: child.id, emotion }),
      }).catch(() => {});
    } catch {}

    // local append
    const ts = Date.now();
    const newRow: LocalEmotionRow = {
      id: String(ts) + ":" + Math.random().toString(36).slice(2, 6),
      childId: child.id,
      emotion,
      who,
      ts,
    };
    setRows((prev) => {
      const next = [newRow, ...prev].slice(0, 2000); // cap
      saveLocalLog(next);
      return next;
    });

    setLast(emotion);
    // small transient acknowledgement is handled by your existing UI state if any
  }

  // filter local rows for display
  const visibleRows = useMemo(() => {
    if (!child?.id) return [];
    const start = new Date(`${from}T00:00:00.000Z`).getTime();
    const end = (() => {
      const e = new Date(`${from}T00:00:00.000Z`);
      e.setUTCDate(e.getUTCDate() + Math.max(1, Math.min(90, days)));
      return e.getTime();
    })();
    return rows
      .filter((r) => r.childId === child.id)
      .filter((r) => r.ts >= start && r.ts < end)
      .filter((r) => (filter === "all" ? true : r.emotion === filter))
      .sort((a, b) => b.ts - a.ts);
  }, [rows, child?.id, from, days, filter]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        {/* Home */}
        <Link
          href="/"
          aria-label="Home"
          className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 mb-4"
        >
          <span aria-hidden="true" className="leading-none text-[96px]">🏠</span>
          <span className="sr-only">Home</span>
        </Link>

        {/* Who's recording + Child + Date */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <label className="inline-flex items-center gap-2 border rounded-xl px-3 py-2 shadow bg-white">
            <span className="text-sm">Who’s recording?</span>
            <input
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              placeholder="e.g. Mom"
              className="border rounded px-2 py-1 text-sm"
            />
          </label>

          <ChildSwitcher onChange={setChild} />
        </div>

        {/* Big emoji buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          {EMOJIS.map((e) => (
            <button
              key={e.key}
              type="button"
              aria-pressed={last === e.key}
              onClick={() => recordEmotion(e.key)}
              className={`tap-target w-[240px] h-[240px] inline-flex flex-col items-center justify-center rounded-2xl border p-6 shadow active:scale-95 bg-white`}
            >
              <div className="text-[120px]" aria-hidden="true">{e.icon}</div>
              <div className="font-medium mt-3 text-lg">{e.key}</div>
            </button>
          ))}
        </div>

        {/* Local History */}
        <details open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)} className="mt-8">
          <summary className="cursor-pointer text-left mx-auto inline-block px-4 py-2 rounded-xl border bg-white shadow">
            History (local, last {days} days)
          </summary>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr,120px,1fr,auto] items-end justify-center">
            <label className="text-left">
              <div className="text-xs mb-1">From</div>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </label>

            <label className="text-left">
              <div className="text-xs mb-1">Days</div>
              <input
                type="number"
                min={1}
                max={90}
                value={days}
                onChange={(e) => setDays(Number(e.target.value) || 30)}
                className="border rounded px-2 py-1 w-full"
              />
            </label>

            <label className="text-left">
              <div className="text-xs mb-1">Emotion</div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="all">All</option>
                {EMOJIS.map((x) => (
                  <option key={x.key} value={x.key}>{x.key}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="border rounded-xl px-3 py-2 shadow bg-white"
            >
              Apply
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            {child?.id ? (
              visibleRows.length ? (
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-sm text-gray-600">
                      <th className="px-2">When</th>
                      <th className="px-2">Emotion</th>
                      <th className="px-2">Who</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((r) => {
                      const { date, time } = fmtDateTime(r.ts);
                      const emoji = EMOJIS.find((x) => x.key === r.emotion)?.icon || "❓";
                      return (
                        <tr key={r.id} className="bg-white">
                          <td className="px-2 py-1 whitespace-nowrap">{date} {time}</td>
                          <td className="px-2 py-1 whitespace-nowrap">{emoji} {r.emotion}</td>
                          <td className="px-2 py-1 whitespace-nowrap">{r.who}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-sm text-gray-600">No entries for selected range/filters.</div>
              )
            ) : (
              <div className="text-sm text-gray-600">Select a child to view history.</div>
            )}
          </div>
        </details>

        {/* tiny status */}
        {last && (
          <div className="mt-4 text-sm text-gray-600">
            Last recorded: <span className="font-medium">{last}</span>
          </div>
        )}
      </div>
    </main>
  );
}
