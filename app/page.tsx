"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ChildSwitcher, { Child } from "./components/ChildSwitcher";

// Home tiles
type Card = { href: string; icon: string; label: string };
const CARDS: Card[] = [
  { href: "/agenda",   icon: "📋", label: "Agenda" },
  { href: "/emotions", icon: "😊", label: "Emotions" },
];

// --- Simple helpers for history ---
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

type AgendaRow = { date: string; done: number };
type EmotionRow = { date: string; emotion: string | null; note: string | null };

// Get static tasks count by age (same presets as Agenda)
type Task = { key: string; label: string; icon: string; slot?: string };
function getTasksForAge(age: number): Task[] {
  if (age >= 6) {
    return [
      { key: "toothbrush", label: "Brush teeth", icon: "🪥" },
      { key: "breakfast",  label: "Breakfast",   icon: "🍳" },
      { key: "homework",   label: "Homework",    icon: "📚" },
      { key: "bath",       label: "Bath",        icon: "🛁" },
      { key: "waterplants", label: "Water plants", icon: "🌸" },
      { key: "petdog", label: "Feed/play dog", icon: "🐶" },
      { key: "petcat", label: "Feed/play cat", icon: "🐱" },
    ];
  } else if (age >= 2) {
    return [
      { key: "toothbrush", label: "Brush teeth", icon: "🪥" },
      { key: "snack",      label: "Snack",       icon: "🥪" },
      { key: "play",       label: "Play time",   icon: "🧸" },
      { key: "nap",        label: "Nap",         icon: "😴" },
      { key: "waterplants", label: "Water plants", icon: "🌸" },
      { key: "petdog", label: "Pet dog", icon: "🐶" },
      { key: "petcat", label: "Pet cat", icon: "🐱" },
    ];
  }
  return [
    { key: "milk",   label: "Milk",       icon: "🍼" },
    { key: "diaper", label: "Diaper",     icon: "🧷" },
    { key: "tummy",  label: "Tummy time", icon: "🤸" },
  ];
}

export default function Home() {
  const [child, setChild] = useState<Child | undefined>();
  const [agendaHistory, setAgendaHistory] = useState<AgendaRow[]>([]);
  const [emotionHistory, setEmotionHistory] = useState<EmotionRow[]>([]);

  const totalTasks = useMemo(() => (child ? getTasksForAge(child.age).length : 0), [child]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!child?.id) return;
      const dates = lastNDates(7);

      // Agenda: count completed items per date
      const agendaRows: AgendaRow[] = [];
      for (const date of dates) {
        try {
          const res = await fetch(`/api/agenda?childId=${child.id}&date=${date}`, { cache: "no-store" });
          const data = res.ok ? await res.json() : null;
          const items = Array.isArray(data?.items) ? data.items : [];
          agendaRows.push({ date, done: items.length });
        } catch {
          agendaRows.push({ date, done: 0 });
        }
      }

      // Emotions: get selected emotion per date
      const emotionRows: EmotionRow[] = [];
      for (const date of dates) {
        try {
          const res = await fetch(`/api/emotions?childId=${child.id}&date=${date}`, { cache: "no-store" });
          const data = res.ok ? await res.json() : null;
          emotionRows.push({ date, emotion: data?.emotion ?? null, note: data?.note ?? null });
        } catch {
          emotionRows.push({ date, emotion: null, note: null });
        }
      }

      if (!alive) return;
      setAgendaHistory(agendaRows);
      setEmotionHistory(emotionRows);
    })();
    return () => { alive = false; };
  }, [child?.id]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1200px] mx-auto px-4 text-center">
        <h1 className="sr-only">PPAPP</h1>

        {/* 240px icon squares with 240px gaps */}
        <div
          className="grid justify-items-center mb-12"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "240px" }}
        >
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="tap-target block w-full max-w-[260px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
              aria-label={c.label}
            >
              <div className="rounded-2xl border shadow bg-white flex items-center justify-center w-[240px] h-[240px] mx-auto">
                <span aria-hidden className="text-[240px] leading-none">{c.icon}</span>
              </div>
              <div className="mt-3 text-center font-semibold text-xl">{c.label}</div>
            </Link>
          ))}
        </div>

        {/* History area (same idea as Agenda page) */}
        <section className="mt-6">
          <div className="mb-4">
            <ChildSwitcher onChange={setChild} />
          </div>

          {child && (
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border p-4 shadow bg-white">
                <h2 className="text-xl font-semibold mb-2">Agenda – last 7 days</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agendaHistory.map((r) => (
                        <tr key={r.date} className="border-b last:border-0">
                          <td className="py-2 pr-4">{r.date}</td>
                          <td className="py-2">{r.done}/{totalTasks || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border p-4 shadow bg-white">
                <h2 className="text-xl font-semibold mb-2">Emotions – last 7 days</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Emotion</th>
                        <th className="py-2">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emotionHistory.map((r) => (
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
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
