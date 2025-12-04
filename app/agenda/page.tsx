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
      { key: "snack",      label: "Snack",       icon: "🍎" },
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

  const tasks = useMemo(() => {
    const age = child?.age ?? 3;
    return getTasksForAge(age);
  }, [child]);

  function toggleTask(t: Task) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(t.key)) next.delete(t.key);
      else next.add(t.key);
      return next;
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[1000px] mx-auto text-center">
        {/* Top row: Home, date, child switcher */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex items-center justify-center rounded-2xl border p-2 shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <span aria-hidden="true" className="leading-none text-[120px]">🏠</span>
            <span className="sr-only">Home</span>
          </Link>

          <label className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 shadow">
            <span className="text-sm">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded border px-2 py-1"
            />
          </label>

          <div className="rounded-xl border px-3 py-2 shadow">
            <ChildSwitcher value={child?.id} onChange={setChild} />
          </div>
        </div>

        {/* Task grid */}
        <div
          className="grid gap-3 justify-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
        >
          {tasks.map((task) => {
            const isOn = checked.has(task.key);
            return (
              <button
                key={task.key}
                type="button"
                aria-pressed={isOn}
                onClick={() => toggleTask(task)}
                className={`tap-target text-left inline-flex flex-col items-center rounded-2xl border px-4 py-4 shadow active:scale-95 ${
                  isOn ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-gray-50"
                }`}
              >
                <div className="text-[120px] leading-none" aria-hidden="true">{task.icon}</div>
                <div className="font-semibold mt-2 text-lg">{task.label}</div>
                <div
                  className={`mt-2 text-xs inline-block rounded-full px-2 py-0.5 ${
                    isOn ? "bg-emerald-100" : "bg-gray-200"
                  }`}
                >
                  {isOn ? "Done" : "To do"}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
