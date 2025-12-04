"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

type Task = { key: string; label: string; icon: string };

function getTasksForAge(age: number): Task[] {
  if (age >= 6) {
    return [
      { key: "toothbrush", label: "Brush teeth", icon: "🪥" },
      { key: "breakfast",  label: "Breakfast",   icon: "🍳" },
      { key: "homework",   label: "Homework",    icon: "📚" },
      { key: "bath",       label: "Bath",        icon: "🛁" },
    ];
  } else if (age >= 2) {
    return [
      { key: "toothbrush", label: "Brush teeth", icon: "🪥" },
      { key: "snack",      label: "Snack",       icon: "��" },
      { key: "play",       label: "Play time",   icon: "🧸" },
      { key: "nap",        label: "Nap",         icon: "😴" },
    ];
  }
  return [
    { key: "milk",   label: "Milk",       icon: "🍼" },
    { key: "diaper", label: "Diaper",     icon: "🧷" },
    { key: "tummy",  label: "Tummy time", icon: "🤸" },
  ];
}

export default function AgendaPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const tasks = useMemo(() => getTasksForAge(child?.age ?? 6), [child?.age]);

  const toggle = (t: Task) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(t.key) ? next.delete(t.key) : next.add(t.key);
      return next;
    });
  };

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        <Link
          href="/"
          aria-label="Home"
          className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          <span aria-hidden="true" className="leading-none text-[80px]">��</span>
        </Link>

        <h1 className="mt-4 text-3xl font-bold">Agenda</h1>

        <div className="mt-6 flex flex-col items-center gap-4">
          <ChildSwitcher onChange={setChild} />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="rounded-xl border px-3 py-2 shadow text-center"
            aria-label="Select date"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
          {tasks.map(t => {
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
      </div>
    </main>
  );
}
