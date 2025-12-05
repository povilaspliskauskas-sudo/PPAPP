"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ChildSwitcher, { Child } from "../components/ChildSwitcher";

type Task = { key: string; label: string; icon: string };

function getTasksForAge(age: number): Task[] {
  // Add pet/plant care to all buckets
  const common: Task[] = [
    { key: "water_plants", label: "Water plants", icon: "🌱" },
    { key: "feed_cat",     label: "Feed cat",     icon: "🐱" },
    { key: "walk_dog",     label: "Walk dog",     icon: "🐶" },
  ];

  if (age >= 6) {
    return [
      { key: "toothbrush", label: "Brush teeth", icon: "🪥" },
      { key: "breakfast",  label: "Breakfast",   icon: "🍳" },
      { key: "homework",   label: "Homework",    icon: "📚" },
      { key: "bath",       label: "Bath",        icon: "🛁"  },
      ...common,
    ];
  } else if (age >= 2) {
    return [
      { key: "toothbrush", label: "Brush teeth", icon: "🪥" },
      { key: "snack",      label: "Snack",       icon: "🍎" },
      { key: "play",       label: "Play time",   icon: "🧸" },
      { key: "nap",        label: "Nap",         icon: "😴" },
      ...common,
    ];
  }
  return [
    { key: "milk",   label: "Milk",       icon: "🍼" },
    { key: "diaper", label: "Diaper",     icon: "🧷" },
    { key: "tummy",  label: "Tummy time", icon: "🤸" },
    ...common,
  ];
}

export default function AgendaPage() {
  const [child, setChild] = useState<Child | undefined>();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const tasks = useMemo(() => getTasksForAge(child?.age ?? 3), [child?.age]);

  const storageKey = useMemo(() => {
    if (!child?.id) return "";
    return `agenda:${child.id}:${date}`;
  }, [child?.id, date]);

  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());

  // Load saved state when child/date changes
  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      setCheckedKeys(new Set(arr));
    } catch {
      setCheckedKeys(new Set());
    }
  }, [storageKey]);

  // Toggle + save
  function toggleTask(task: Task) {
    setCheckedKeys(prev => {
      const next = new Set(prev);
      if (next.has(task.key)) next.delete(task.key);
      else next.add(task.key);
      try {
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }

  // Simple history: show the last 7 days for the selected child
  const last7 = useMemo(() => {
    const out: { date: string; keys: string[] }[] = [];
    if (!child?.id) return out;
    for (let i = 0; i < 7; i++) {
      const d = new Date(date);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const k = `agenda:${child.id}:${ds}`;
      try {
        const raw = localStorage.getItem(k);
        const arr: string[] = raw ? JSON.parse(raw) : [];
        out.push({ date: ds, keys: arr });
      } catch {
        out.push({ date: ds, keys: [] });
      }
    }
    return out;
  }, [child?.id, date]);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-[1000px] mx-auto px-4 text-center">
        {/* Header with Home */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            aria-label="Home"
            className="tap-target inline-flex items-center justify-center rounded-2xl border p-3 shadow active:scale-95"
          >
            <span aria-hidden="true" className="leading-none text-[96px]">🏠</span>
            <span className="sr-only">Home</span>
          </Link>

          <div className="inline-flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border px-3 py-2 shadow"
            />
          </div>
        </div>

        {/* Child tabs */}
        <div className="mb-4">
          <ChildSwitcher value={child?.id} onChange={setChild as any} />
        </div>

        {/* History for selected child */}
        {child?.id && (
          <details className="mb-6 mx-auto w-full max-w-[820px] rounded-2xl border p-4 text-left">
            <summary className="cursor-pointer select-none font-semibold">
              History (last 7 days) for {child.name}
            </summary>
            <div className="mt-3 space-y-2">
              {last7.map(({ date: d, keys }) => (
                <div key={d} className="text-sm">
                  <span className="font-medium">{d}: </span>
                  {keys.length === 0 ? (
                    <span className="text-gray-500">no completed tasks</span>
                  ) : (
                    <span>
                      {keys
                        .map(k => tasks.find(t => t.key === k)?.label ?? k)
                        .join(", ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Task grid */}
        <div
          className="grid gap-4 justify-items-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {tasks.map((task) => {
            const isOn = checkedKeys.has(task.key);
            return (
              <button
                key={task.key}
                type="button"
                aria-pressed={isOn}
                onClick={() => toggleTask(task)}
                className={`tap-target w-full max-w-[320px] text-left inline-flex flex-col items-center
                            rounded-2xl border px-6 py-5 shadow active:scale-95
                            ${isOn ? "outline outline-2 outline-emerald-400 bg-emerald-50" : "bg-white"}`}
              >
                <div className="text-[56px]" aria-hidden="true">{task.icon}</div>
                <div className="font-semibold mt-2 text-lg">{task.label}</div>
                <div
                  className={`mt-3 text-xs inline-block rounded-full px-3 py-1 ${isOn ? "bg-emerald-100" : "bg-gray-100"}`}
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
