"use client";
import { useState } from "react";
import Link from "next/link";

type Task = { key: string; label: string; icon: string };

const TASKS: Task[] = [
  { key: "toothbrush", label: "Brush teeth", icon: "🪥" },
  { key: "breakfast", label: "Breakfast", icon: "🍳" },
  { key: "homework", label: "Homework", icon: "📚" },
  { key: "bath", label: "Bath", icon: "🛁" },
];

export default function AgendaPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (t: Task) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(t.key)) next.delete(t.key);
      else next.add(t.key);
      return next;
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 text-center">
      <Link
        href="/"
        aria-label="Home"
        className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
      >
        <span aria-hidden="true" className="leading-none text-[80px]">🏠</span>
      </Link>

      <h1 className="text-2xl font-semibold">Agenda</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TASKS.map(t => {
          const isOn = checked.has(t.key);
          return (
            <button
              key={t.key}
              type="button"
              aria-pressed={isOn}
              onClick={() => toggle(t)}
              className={`tap-target flex flex-col items-center justify-center rounded-2xl border px-6 py-4 shadow active:scale-95 ${
                isOn ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
              }`}
            >
              <div className="leading-none text-[200px]" aria-hidden="true">{t.icon}</div>
              <div className="mt-2 text-lg font-medium">{t.label}</div>
              <div className={`mt-2 text-xs inline-block rounded-full px-2 py-0.5 ${
                isOn ? "bg-emerald-100" : "bg-gray-100"
              }`}>{isOn ? "Done" : "To do"}</div>
            </button>
          );
        })}
      </div>
    </main>
  );
}
